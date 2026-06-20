const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ROLES = require("../constants/roles");
const { createAuditLog } = require("../services/audit.service");

function sanitizeUser(user) {
  const output = user.toObject ? user.toObject() : user;
  delete output.password;
  return output;
}

async function listAdmins(_req, res, next) {
  try {
    const admins = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: admins });
  } catch (error) {
    next(error);
  }
}

async function createAdmin(req, res, next) {
  try {
    const { name, email, password, role = ROLES.ADMIN } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({ success: false, message: "Admin email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    await createAuditLog({
      user: req.user,
      action: "CREATE_ADMIN",
      module: "ADMINS",
      entityId: admin._id,
      entityTitle: admin.email,
      metadata: { role: admin.role }
    });

    res.status(201).json({ success: true, data: sanitizeUser(admin) });
  } catch (error) {
    next(error);
  }
}

async function updateAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const { name, role, isActive, password } = req.body;
    const admin = await User.findById(id).select("+password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (name !== undefined) admin.name = name;
    if (role !== undefined) admin.role = role;
    if (isActive !== undefined) admin.isActive = isActive;
    if (password) admin.password = await bcrypt.hash(password, 12);

    await admin.save();

    await createAuditLog({
      user: req.user,
      action: "UPDATE_ADMIN",
      module: "ADMINS",
      entityId: admin._id,
      entityTitle: admin.email,
      metadata: { changedFields: Object.keys(req.body) }
    });

    res.json({ success: true, data: sanitizeUser(admin) });
  } catch (error) {
    next(error);
  }
}

async function disableAdmin(req, res, next) {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot disable your own account" });
    }

    const admin = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    await createAuditLog({
      user: req.user,
      action: "DISABLE_ADMIN",
      module: "ADMINS",
      entityId: admin._id,
      entityTitle: admin.email
    });

    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAdmins,
  createAdmin,
  updateAdmin,
  disableAdmin
};
