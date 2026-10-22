require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Permission = require("./models/Permission");
const Role = require("./models/Role");
const User = require("./models/User");

const PERMISSIONS = [
    ["users:read", "Xem danh sách và chi tiết người dùng"],
    ["users:create", "Tạo người dùng"],
    ["users:update", "Sửa thông tin, khóa/mở khóa người dùng"],
    ["users:delete", "Xóa người dùng"],
    ["roles:read", "Xem role và quyền của role"],
    ["roles:create", "Tạo role"],
    ["roles:update", "Sửa role, thay bộ quyền của role"],
    ["roles:delete", "Xóa role"],
    ["roles:assign", "Gán / gỡ role cho người dùng"],
    ["permissions:read", "Xem danh mục quyền"],
].map(([code, description]) => ({
    code, resource: code.split(":")[0], action:
        code.split(":")[1], description
}));

const ROLES = [
    {
        code: "super-admin", name: "Quản trị viên tối cao", isSystem: true,
        permissions: PERMISSIONS.map((p) => p.code)
    },
    // TODO: user-manager, auditor, member theo ma trận ở mục II.1.5
    {
        code: "user-manager", name: "Quản lý người dùng", isSystem: true,
        permissions: ["users:read", "users:create", "users:update", "roles:read", "roles:assign", "permissions:read"]
    },
    {
        code: "auditor", name: "Giám sát viên", isSystem: true,
        permissions: ["users:read", "roles:read", "permissions:read"]
    },
    { code: "member", name: "Thành viên", isSystem: true, permissions: [] },
    {
        code: "custom", name: "Custom role seed", isSystem: false,
        permissions: ["users:read"]
    }
];

// TODO: dữ liệu THẬT theo yêu cầu "Dữ liệu tối thiểu" (mục 1.11)
const USERS = [
    {
        email: "duy.bv251054m@sis.hust.edu.vn", 
        fullName: "Bùi Văn Duy", 
        phone: "+84394085998", 
        password: "Admin@2026", 
        roles: ["super-admin"]
    },
    {
        email: "duy.bv251054m+1@sis.hust.edu.vn", 
        fullName: "Bùi Văn Duy", 
        phone: "+84394085998", 
        password: "Admin@2026", 
        roles: ["user-manager"]
    },
    {
        email: "duy.bv251054m+2@sis.hust.edu.vn", 
        fullName: "Bùi Văn Duy", 
        phone: "+84394085998", 
        password: "Admin@2026", 
        roles: ["auditor"]
    },
    {
        email: "duy.bv251054m+3@sis.hust.edu.vn", 
        fullName: "Bùi Văn Duy", 
        phone: "+84394085998", 
        password: "Admin@2026", 
        roles: ["member"]
    },
    {
        email: "duy.bv251054m+4@sis.hust.edu.vn", 
        fullName: "Bùi Văn Duy", 
        phone: "+84394085998", 
        password: "Admin@2026", 
        roles: ["custom"]
    }
];

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await Promise.all([Permission.deleteMany({}), Role.deleteMany({}),
    User.deleteMany({})]);
    await Promise.all([Permission.init(), Role.init(), User.init()]); // tạo unique index
    await Permission.insertMany(PERMISSIONS);
    const roles = await Role.insertMany(ROLES);
    const roleId = Object.fromEntries(roles.map((r) => [r.code, r._id]));
    for (const u of USERS) {
        await User.create({
            email: u.email, fullName: u.fullName, phone: u.phone ?? null,
            passwordHash: await bcrypt.hash(u.password, 10),
            roles: u.roles.map((code) => roleId[code]),
        });
    }
    console.log(`Đã tạo ${PERMISSIONS.length} quyền, ${roles.length} role, ${USERS.length} người dùng.`);
    await mongoose.disconnect();
})();