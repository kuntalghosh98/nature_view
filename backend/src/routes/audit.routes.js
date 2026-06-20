const express = require("express");
const { listAuditLogs } = require("../controllers/audit.controller");
const { authMiddleware, superAdminMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, superAdminMiddleware, listAuditLogs);

module.exports = router;
