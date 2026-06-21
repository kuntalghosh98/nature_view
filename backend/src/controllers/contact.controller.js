const ContactSubmission = require("../models/ContactSubmission");
const { createAuditLog } = require("../services/audit.service");

async function adminList(req, res, next) {
  try {
    const items = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createContactSubmission(req, res, next) {
  try {
    const payload = req.body;
    const submission = await ContactSubmission.create({ ...payload, createdBy: req.user?._id || null });

    await createAuditLog({
      user: req.user,
      action: "CREATE_CONTACT_SUBMISSION",
      module: "CONTACT",
      entityId: submission._id,
      entityTitle: submission.name
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  adminList,
  createContactSubmission
};
