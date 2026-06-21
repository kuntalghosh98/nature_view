const Project = require("../models/Project");
const { createAuditLog } = require("../services/audit.service");
const fs = require("fs");
const path = require("path");

function loadFallback() {
  try {
    const json = fs.readFileSync(path.join(__dirname, "../../fallback/projects.json"), "utf8");
    return JSON.parse(json);
  } catch (_err) {
    return [];
  }
}

async function adminList(req, res, next) {
  try {
    const items = await Project.find().populate("featuredImage gallery").sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createProject(req, res, next) {
  try {
    const payload = req.body;
    if (!payload.slug) payload.slug = (payload.title?.en || payload.title?.bn || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const exists = await Project.findOne({ slug: payload.slug });
    if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });

    const project = await Project.create({ ...payload, createdBy: req.user?._id || null });

    await createAuditLog({ user: req.user, action: "CREATE_PROJECT", module: "PROJECTS", entityId: project._id, entityTitle: project.slug });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (payload.slug && payload.slug !== project.slug) {
      const exists = await Project.findOne({ slug: payload.slug });
      if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });
      project.slug = payload.slug;
    }

    Object.assign(project, payload);

    if (payload.isPublished && !project.publishedAt) project.publishedAt = new Date();
    if (!payload.isPublished) project.publishedAt = null;

    await project.save();

    await createAuditLog({ user: req.user, action: "UPDATE_PROJECT", module: "PROJECTS", entityId: project._id, entityTitle: project.slug, metadata: { changedFields: Object.keys(payload) } });

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    await createAuditLog({ user: req.user, action: "DELETE_PROJECT", module: "PROJECTS", entityId: project._id, entityTitle: project.slug });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

// Public: list published projects, fallback to JSON if none
async function publicList(req, res, next) {
  try {
    const items = await Project.find({ isPublished: true }).populate("featuredImage gallery").sort({ publishedAt: -1 });
    if (!items || items.length === 0) {
      const fallback = loadFallback();
      return res.json({ success: true, data: fallback });
    }
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

// Public: get project by slug
async function publicDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const item = await Project.findOne({ slug, isPublished: true }).populate("featuredImage gallery");
    if (!item) {
      const fallback = loadFallback();
      const found = fallback.find((p) => p.slug === slug);
      if (found) return res.json({ success: true, data: found });
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  adminList,
  createProject,
  updateProject,
  deleteProject,
  publicList,
  publicDetail
};
