const AuditLog = require("../models/AuditLog");

async function createAuditLog({ user, action, module, entityId = null, entityTitle = "", metadata = {} }) {
  return AuditLog.create({
    userId: user?._id || user?.userId || null,
    userName: user?.name || user?.email || "System",
    action,
    module,
    entityId,
    entityTitle,
    metadata
  });
}

module.exports = {
  createAuditLog
};
