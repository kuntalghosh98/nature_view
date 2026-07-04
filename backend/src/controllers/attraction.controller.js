const Attraction = require("../models/Attraction");
const { createAuditLog } = require("../services/audit.service");
const fs = require("fs");
const path = require("path");

function loadFallback() {
  try {
    const json = fs.readFileSync(path.join(__dirname, "../../fallback/attractions.json"), "utf8");
    return JSON.parse(json);
  } catch (_err) {
    return [];
  }
}

async function adminList(req, res, next) {
  try {
    const items = await Attraction.find().populate("featuredImage gallery").sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createAttraction(req, res, next) {
  try {
    const payload = req.body;
    if (!payload.slug) payload.slug = (payload.title?.en || payload.title?.bn || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const exists = await Attraction.findOne({ slug: payload.slug });
    if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });

    const attraction = await Attraction.create({ ...payload, createdBy: req.user?._id || null });

    await createAuditLog({ user: req.user, action: "CREATE_ATTRACTION", module: "ATTRACTIONS", entityId: attraction._id, entityTitle: attraction.slug });

    res.status(201).json({ success: true, data: attraction });
  } catch (error) {
    next(error);
  }
}

async function updateAttraction(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const attraction = await Attraction.findById(id);
    if (!attraction) return res.status(404).json({ success: false, message: "Attraction not found" });

    if (payload.slug && payload.slug !== attraction.slug) {
      const exists = await Attraction.findOne({ slug: payload.slug });
      if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });
      attraction.slug = payload.slug;
    }

    Object.assign(attraction, payload);

    if (payload.isPublished && !attraction.publishedAt) attraction.publishedAt = new Date();
    if (!payload.isPublished) attraction.publishedAt = null;

    await attraction.save();

    await createAuditLog({ user: req.user, action: "UPDATE_ATTRACTION", module: "ATTRACTIONS", entityId: attraction._id, entityTitle: attraction.slug, metadata: { changedFields: Object.keys(payload) } });

    res.json({ success: true, data: attraction });
  } catch (error) {
    next(error);
  }
}

async function deleteAttraction(req, res, next) {
  try {
    const { id } = req.params;
    const attraction = await Attraction.findByIdAndDelete(id);
    if (!attraction) return res.status(404).json({ success: false, message: "Attraction not found" });

    await createAuditLog({ user: req.user, action: "DELETE_ATTRACTION", module: "ATTRACTIONS", entityId: attraction._id, entityTitle: attraction.slug });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function publicList(req, res, next) {
  try {
    const featured = await Attraction.find({ isPublished: true, isFeatured: true }).populate("featuredImage").sort({ publishedAt: -1 }).limit(4);
    const items = await Attraction.find({ isPublished: true }).populate("featuredImage gallery").sort({ publishedAt: -1 });

    if ((!items || items.length === 0) && (!featured || featured.length === 0)) {
      const fallback = loadFallback();
      const featuredFallback = fallback.filter(x => x.isFeatured);
      return res.json({ success: true, data: { featured: featuredFallback, items: fallback } });
    }

    res.json({ success: true, data: { featured, items } });
  } catch (error) {
    next(error);
  }
}

async function publicDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const item = await Attraction.findOne({ slug, isPublished: true }).populate("featuredImage gallery");
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
  createAttraction,
  updateAttraction,
  deleteAttraction,
  publicList,
  publicDetail
};
