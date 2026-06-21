const express = require("express");
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validate.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  adminList,
  createEvent,
  updateEvent,
  deleteEvent,
  publicList,
  publicDetail
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/", publicList);
router.get("/slug/:slug", publicDetail);

router.use(authMiddleware);
router.get("/admin", adminList);

router.post(
  "/",
  [body("title.en").exists().withMessage("English title is required"), body("slug").optional().isString()],
  validateRequest,
  createEvent
);

router.patch(
  "/:id",
  [param("id").isMongoId(), body("slug").optional().isString()],
  validateRequest,
  updateEvent
);

router.delete("/:id", [param("id").isMongoId()], validateRequest, deleteEvent);

module.exports = router;
