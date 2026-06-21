const express = require("express");
const { body, param } = require("express-validator");
const { uploadMedia, listMedia, deleteMedia, uploadFile } = require("../controllers/media.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validate.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listMedia);

router.post(
  "/",
  [body("filename").isString().notEmpty(), body("url").isURL().notEmpty()],
  validateRequest,
  uploadMedia
);

// file upload to Cloudinary (multipart/form-data, field: file)
router.post("/upload", upload.single("file"), uploadFile);

router.delete("/:id", [param("id").isMongoId()], validateRequest, deleteMedia);

module.exports = router;
