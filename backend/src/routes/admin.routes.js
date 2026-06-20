const express = require("express");
const { body, param } = require("express-validator");
const ROLES = require("../constants/roles");
const {
  listAdmins,
  createAdmin,
  updateAdmin,
  disableAdmin
} = require("../controllers/admin.controller");
const { authMiddleware, superAdminMiddleware } = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validate.middleware");

const router = express.Router();

router.use(authMiddleware, superAdminMiddleware);

router.get("/", listAdmins);

router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2, max: 100 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    }),
    body("role").optional().isIn(Object.values(ROLES))
  ],
  validateRequest,
  createAdmin
);

router.patch(
  "/:id",
  [
    param("id").isMongoId(),
    body("name").optional().trim().isLength({ min: 2, max: 100 }),
    body("role").optional().isIn(Object.values(ROLES)),
    body("isActive").optional().isBoolean(),
    body("password")
      .optional()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
      })
  ],
  validateRequest,
  updateAdmin
);

router.delete("/:id", [param("id").isMongoId()], validateRequest, disableAdmin);

module.exports = router;
