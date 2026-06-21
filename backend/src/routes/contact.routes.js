const express = require("express");
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validate.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const { adminList, createContactSubmission } = require("../controllers/contact.controller");

const router = express.Router();

router.post(
  "/",
  [
    body("name").exists().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").exists().withMessage("Message is required")
  ],
  validateRequest,
  createContactSubmission
);

router.use(authMiddleware);
router.get("/admin", adminList);

module.exports = router;
