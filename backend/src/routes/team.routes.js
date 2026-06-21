const express = require("express");
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validate.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  adminList,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  publicList
} = require("../controllers/team.controller");

const router = express.Router();

router.get("/", publicList);

router.use(authMiddleware);
router.get("/admin", adminList);

router.post(
  "/",
  [body("name.en").exists().withMessage("English name is required"), body("role.en").exists().withMessage("English role is required")],
  validateRequest,
  createTeamMember
);

router.patch(
  "/:id",
  [param("id").isMongoId(), body("name.en").optional().isString(), body("role.en").optional().isString()],
  validateRequest,
  updateTeamMember
);

router.delete("/:id", [param("id").isMongoId()], validateRequest, deleteTeamMember);

module.exports = router;
