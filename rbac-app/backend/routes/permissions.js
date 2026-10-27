const express = require("express");
const Permission = require("../models/Permission");
const { authenticate, requirePermission } = require("../middleware/auth");
const { permissionView } = require("../utils/http");

const router = express.Router();

router.use(authenticate); // mọi endpoint dưới đây đều cần đăng nhập

// GET /permissions?resource=users – danh mục quyền, sắp xếp theo resource, code
router.get("/", requirePermission("permissions:read"), async (req, res) => {
    const filter = {};
    if (req.query.resource) filter.resource = String(req.query.resource).trim();

    const items = await Permission.find(filter).sort({ resource: 1, code: 1 });

    res.json({ data: items.map(permissionView), meta: { totalItems: items.length } });
});

module.exports = router;
