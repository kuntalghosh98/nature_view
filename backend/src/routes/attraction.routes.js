const express = require("express");
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validate.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  adminList,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  publicList,
  publicDetail
} = require("../controllers/attraction.controller");

const router = express.Router();

router.get("/", publicList);
router.get("/slug/:slug", publicDetail);

router.use(authMiddleware);
router.get("/admin", adminList);

router.post(
  "/",
  [body("title.en").exists().withMessage("English title is required"), body("slug").optional().isString()],
  validateRequest,
  createAttraction
);

router.patch(
  "/:id",
  [param("id").isMongoId(), body("slug").optional().isString()],
  validateRequest,
  updateAttraction
);
router.delete("/:id", [param("id").isMongoId()], validateRequest, deleteAttraction);

module.exports = router;
