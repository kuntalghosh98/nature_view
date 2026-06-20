const AuditLog = require("../models/AuditLog");

async function listAuditLogs(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments()
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAuditLogs
};
