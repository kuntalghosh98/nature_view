const Media = require("../models/Media");
const { createAuditLog } = require("../services/audit.service");
const { uploadStream } = require("../services/cloudinary.service");

// handle multipart file upload -> upload to Cloudinary, save media doc
async function uploadFile(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ success: false, message: "No file uploaded" });

    const file = req.file;

    const result = await uploadStream(file.buffer, { resource_type: file.mimetype.startsWith("video") ? "video" : "image" });

    const media = await Media.create({
      filename: file.originalname,
      url: result.secure_url || result.url,
      publicId: result.public_id,
      type: result.resource_type || (file.mimetype.startsWith("video") ? "video" : "image"),
      size: result.bytes || file.size,
      width: result.width || null,
      height: result.height || null,
      duration: result.duration || null,
      alt: file.originalname,
      createdBy: req.user?._id || null
    });

    await createAuditLog({
      user: req.user,
      action: "UPLOAD_MEDIA_FILE",
      module: "MEDIA",
      entityId: media._id,
      entityTitle: media.filename
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
}

async function uploadMedia(req, res, next) {
  try {
    const { filename, url, type = "image", size = 0, width = null, height = null, duration = null, alt = "", tags = [], language = "en" } = req.body;

    if (!filename || !url) {
      return res.status(400).json({ success: false, message: "filename and url are required" });
    }

    const media = await Media.create({
      filename,
      url,
      type,
      size,
      width,
      height,
      duration,
      alt,
      tags,
      language,
      createdBy: req.user?._id || null
    });

    await createAuditLog({
      user: req.user,
      action: "UPLOAD_MEDIA",
      module: "MEDIA",
      entityId: media._id,
      entityTitle: media.filename
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
}

async function listMedia(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Media.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Media.countDocuments()
    ]);

    res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
}

async function deleteMedia(req, res, next) {
  try {
    const { id } = req.params;
    const media = await Media.findByIdAndDelete(id);

    if (!media) {
      return res.status(404).json({ success: false, message: "Media not found" });
    }

    await createAuditLog({
      user: req.user,
      action: "DELETE_MEDIA",
      module: "MEDIA",
      entityId: media._id,
      entityTitle: media.filename
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
  uploadMedia,
  listMedia,
  deleteMedia
};
