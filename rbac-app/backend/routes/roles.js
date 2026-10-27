const express = require("express");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const { authenticate, requirePermission } = require("../middleware/auth");
const { countUserByRole, missingPermissions, checkPermissionList } = require("../utils/rbac");
const { fail, detail, notAllowedFields, isObjectId, parsePaging, parseSort,
    escapeRegex, pageMeta, roleView, permissionView } = require("../utils/http");

const router = express.Router();

router.use(authenticate); // mọi endpoint dưới đây đều cần đăng nhập

// Middleware nạp role theo :roleId, trả 404 ROLE_NOT_FOUND
async function loadRole(req, res, next) {
    const { roleId } = req.params;
    const role = isObjectId(roleId) ? await Role.findById(roleId) : null;
    if (!role) return fail(res, 404, "ROLE_NOT_FOUND", "Không tìm thấy vai trò.");
    req.role = role;
    next();
}

router.get("/", requirePermission("roles:read"), async (req, res) => {
    const q = req.query;
    const details = [];
    const { page, limit } = parsePaging(q, details);
    const sort = parseSort(
        q.sort || "name",
        ["name", "code", "createdAt"],
        details
    );

    if (details.length) return fail(res, 400, "INVALID_QUERY_PARAMETER", "Tham số truy vấn không hợp lệ.", details);

    // q tìm trong name/code
    const filter = {};
    if (q.q && String(q.q).trim()) {
        const re = { $regex: escapeRegex(String(q.q).trim()), $options: "i" };
        filter.$or = [{ name: re }, { code: re }];
    }

    const [items, totalItems] = await Promise.all([
        Role.find(filter).sort({ ...sort, _id: 1 }).skip((page - 1) * limit).limit(limit),
        Role.countDocuments(filter),
    ]);

    // userCount = số người dùng chưa bị xóa đang mang role
    const counts = await Promise.all(items.map((r) => countUserByRole(r._id)));

    res.json({
        data: items.map((r, i) => roleView(r, counts[i])),
        meta: pageMeta(page, limit, totalItems),
    });
});

router.post("/", requirePermission("roles:create"), async (req, res) => {
    const body = req.body || {};

    // 1. Allow-list: chỉ nhận các trường này
    const details = notAllowedFields(body, ["code", "name", "description", "permissions"]);
    if (details.length) return fail(res, 400, "VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ.", details);

    // 2. Danh sách quyền: đúng kiểu và tồn tại trong danh mục
    const permissions = [...new Set(body.permissions ?? [])];
    const invalid = await checkPermissionList(body.permissions ?? []);
    if (invalid) return fail(res, invalid.status, invalid.code, "Danh sách quyền không hợp lệ.", invalid.details);

    // 3. Chống leo thang: chỉ được cấp cho role những quyền mình có (BR-02)
    const missing = missingPermissions(permissions, req.permissions);
    if (missing.length)
        return fail(res, 403, "PRIVILEGE_ESCALATION", "Không thể cấp cho vai trò quyền mà bạn không có.",
            missing.map((c) => detail("permissions", "PERMISSION_NOT_HELD", `Bạn không có quyền '${c}'.`)));

    // 4. Mã trùng -> 409 (kiểm tra trước để trả lỗi rõ ràng; unique index là lưới an toàn)
    if (body.code && (await Role.exists({ code: String(body.code).trim() })))
        return fail(res, 409, "ROLE_CODE_EXISTS", "Mã vai trò đã tồn tại.");

    // 5. Tạo – lỗi validation của schema được error handler chuyển thành 400
    const role = await Role.create({
        code: body.code,
        name: body.name,
        description: body.description ?? null,
        permissions,
    });

    res.status(201).location(`${req.baseUrl}/${role._id}`).json(roleView(role, 0));
});

router.get("/:roleId", requirePermission("roles:read"), loadRole, async (req, res) =>
    res.json(roleView(req.role, await countUserByRole(req.role._id))));

router.patch("/:roleId", requirePermission("roles:update"), loadRole, async (req, res) => {
    const body = req.body || {};
    const role = req.role;

    // 1. Allow-list: chỉ name, description (code, isSystem, permissions -> FIELD_NOT_ALLOWED)
    const details = notAllowedFields(body, ["name", "description"]);
    if (details.length) return fail(res, 400, "VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ.", details);

    // 2. Chỉ gán những trường có trong body
    for (const k of ["name", "description"])
        if (k in body) role[k] = body[k];

    await role.save(); // save() chạy lại validator của schema

    res.json(roleView(role, await countUserByRole(role._id)));
});

router.delete("/:roleId", requirePermission("roles:delete"), loadRole, async (req, res) => {
    const role = req.role;

    if (role.isSystem)
        return fail(res, 409, "SYSTEM_ROLE_PROTECTED", "Không thể xóa vai trò hệ thống.");

    if ((await countUserByRole(role._id)) > 0)
        return fail(res, 409, "ROLE_IN_USE", "Vai trò đang được gán cho người dùng.");

    await role.deleteOne();

    res.status(204).end();
});

router.get("/:roleId/permissions", requirePermission("roles:read"), loadRole, async (req, res) => {
    const items = await Permission.find({ code: { $in: req.role.permissions } }).sort({ resource: 1, code: 1 });

    res.json({ data: items.map(permissionView), meta: { totalItems: items.length } });
});

router.put("/:roleId/permissions", requirePermission("roles:update"), loadRole, async (req, res) => {
    const body = req.body || {};
    const role = req.role;

    // 1. Allow-list + bắt buộc có permissions
    const details = notAllowedFields(body, ["permissions"]);
    if (!("permissions" in body)) details.push(detail("permissions", "REQUIRED", "Thiếu danh sách quyền."));
    if (details.length) return fail(res, 400, "VALIDATION_ERROR", "Dữ liệu đầu vào không hợp lệ.", details);

    // 2. Danh sách quyền: đúng kiểu và tồn tại trong danh mục
    const invalid = await checkPermissionList(body.permissions);
    if (invalid) return fail(res, invalid.status, invalid.code, "Danh sách quyền không hợp lệ.", invalid.details);

    // 3. Vai trò hệ thống không được đổi bộ quyền (BR-05)
    if (role.isSystem)
        return fail(res, 409, "SYSTEM_ROLE_PROTECTED", "Không thể đổi bộ quyền của vai trò hệ thống.");

    // 4. Chống leo thang trên phần thay đổi: quyền thêm vào và quyền bị bớt đi (BR-02)
    const next = [...new Set(body.permissions)];
    const added = next.filter((c) => !role.permissions.includes(c));
    const removed = role.permissions.filter((c) => !next.includes(c));
    const missing = missingPermissions([...added, ...removed], req.permissions);
    if (missing.length)
        return fail(res, 403, "PRIVILEGE_ESCALATION", "Không thể thêm/bớt quyền mà bạn không có.",
            missing.map((c) => detail("permissions", "PERMISSION_NOT_HELD", `Bạn không có quyền '${c}'.`)));

    // 5. Lưu
    role.permissions = next;
    await role.save();

    res.json(roleView(role, await countUserByRole(role._id)));
});

module.exports = router;
