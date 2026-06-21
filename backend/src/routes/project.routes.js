const express = require("express");
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validate.middleware");
const { authMiddleware, superAdminMiddleware } = require("../middleware/auth.middleware");
const {
  adminList,
  createProject,
  updateProject,
  deleteProject,
  publicList,
  publicDetail
} = require("../controllers/project.controller");

const router = express.Router();

// Public endpoints
router.get("/", publicList);
router.get("/slug/:slug", publicDetail);

// Admin endpoints (require auth)
router.use(authMiddleware);
router.get("/admin", adminList);

router.post(
  "/",
  [body("title.en").exists().withMessage("English title is required"), body("slug").optional().isString()],
  validateRequest,
  createProject
);

router.patch(
  "/:id",
  [param("id").isMongoId(), body("slug").optional().isString()],
  validateRequest,
  updateProject
);
router.delete("/:id", [param("id").isMongoId()], validateRequest, deleteProject);

module.exports = router;
