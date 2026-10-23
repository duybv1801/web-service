const express = require("express");

const router = express.Router();

router.get("/", requirePermission("users:read"), async (req, res) => {
});

router.post("/", requirePermission("users:create"), async (req, res) => {
});

router.get("/:roleId", requirePermission("users:read"), loadUser, (req, res) => 
    res.json(userView(req.target)));

router.patch("/:userId", requirePermission("users:update"), loadUser, async (req, res) => { 
});

router.delete("/:userId", requirePermission("users:delete"), loadUser, async (req, res) => { 
});

module.exports = router;
