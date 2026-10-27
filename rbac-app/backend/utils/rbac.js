const Role = require("../models/Role");
const User = require("../models/User");
const Permission = require("../models/Permission");
const { detail } = require("./http");

// Những quyền trong danh sách mà người gọi KHÔNG có (dùng chống leo thang đặc quyền)
const missingPermissions = (codes, myPermissions) => 
    [...new Set(codes)].filter((c) => !myPermissions.has(c));

// user có phải super-admin active cuối cùng không
async function isLastSuperAdmin(user) {
    const sa = await Role.findOne({ code: "super-admin" });

    if (!sa || !user.roles.some((r) => String(r._id || r) === String(sa._id)))
        return false;

    const others = await User.countDocuments({
        _id: { $ne: user._id }, status:
            "active", roles: sa._id
    });
    return others === 0;
}

const countUserByRole = (roleId) =>
    User.countDocuments({ status: { $ne: "deleted" }, roles: roleId });

async function unknownPermissions(codes) {
    const uniq = [...new Set(codes)];
    const found = new Set(await Permission.distinct("code", { code: { $in: uniq } }));
    return uniq.filter((c) => !found.has(c));
}

// Kiểm tra mảng mã quyền: đúng kiểu và tồn tại trong danh mục; hợp lệ -> null
async function checkPermissionList(perms) {
    if (!Array.isArray(perms) || !perms.every((p) => typeof p === "string"))
        return { status: 400, code: "VALIDATION_ERROR", details: 
            [detail("permissions", "INVALID_TYPE", "permissions phải là mảng mã quyền.")] };

    const unknown = await unknownPermissions(perms);
    if (unknown.length)
        return { status: 400, code: "PERMISSION_NOT_FOUND", details: 
            unknown.map((p) => detail("permissions", "NOT_FOUND", `Quyền '${p}' không tồn tại.`)) };

    return null;
}

module.exports = { missingPermissions, isLastSuperAdmin, countUserByRole, unknownPermissions, checkPermissionList };