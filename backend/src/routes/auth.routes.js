const express = require("express");
const { body } = require("express-validator");
const { login, me, logout } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validate.middleware");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 8 })
  ],
  validateRequest,
  login
);

router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

module.exports = router;
