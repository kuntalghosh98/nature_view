const express = require("express");
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validate.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  adminList,
  createImpact,
  updateImpact,
  deleteImpact,
  publicList
} = require("../controllers/impact.controller");

const router = express.Router();

router.get("/", publicList);

router.use(authMiddleware);
router.get("/admin", adminList);

router.post(
  "/",
  [body("title.en").optional().isString(), body("value").exists().withMessage("Value is required")],
  validateRequest,
  createImpact
);

router.patch(
  "/:id",
  [param("id").isMongoId(), body("title.en").optional().isString()],
  validateRequest,
  updateImpact
);

router.delete("/:id", [param("id").isMongoId()], validateRequest, deleteImpact);

module.exports = router;
