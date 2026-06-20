const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { createAuditLog } = require("../services/audit.service");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    
 console.log("User found:", user);
 console.log("Password provided:", password);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account disabled" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    await createAuditLog({
      user,
      action: "LOGIN",
      module: "AUTH",
      entityId: user._id,
      entityTitle: user.email
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      success: true,
      token: generateToken(user),
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({ success: true, user: req.user });
}

async function logout(req, res, next) {
  try {
    await createAuditLog({
      user: req.user,
      action: "LOGOUT",
      module: "AUTH",
      entityId: req.user._id,
      entityTitle: req.user.email
    });

    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  me,
  logout
};
