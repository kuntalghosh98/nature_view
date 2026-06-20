const User = require("../models/User");
const ROLES = require("../constants/roles");
const { verifyToken } = require("../utils/jwt");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

function superAdminMiddleware(req, res, next) {
  if (req.user?.role !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({ success: false, message: "Super admin access required" });
  }

  next();
}

module.exports = {
  authMiddleware,
  superAdminMiddleware
};
