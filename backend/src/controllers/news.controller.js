const News = require("../models/News");
const { createAuditLog } = require("../services/audit.service");
const fs = require("fs");
const path = require("path");

function loadFallback() {
  try {
    const json = fs.readFileSync(path.join(__dirname, "../../fallback/news.json"), "utf8");
    return JSON.parse(json);
  } catch (_err) {
    return [];
  }
}

async function adminList(req, res, next) {
  try {
    const items = await News.find().populate("featuredImage gallery").sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createNews(req, res, next) {
  try {
    const payload = req.body;
    if (!payload.slug) payload.slug = (payload.title?.en || payload.title?.bn || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const exists = await News.findOne({ slug: payload.slug });
    if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });

    const newsItem = await News.create({ ...payload, createdBy: req.user?._id || null });

    await createAuditLog({ user: req.user, action: "CREATE_NEWS", module: "NEWS", entityId: newsItem._id, entityTitle: newsItem.slug });

    res.status(201).json({ success: true, data: newsItem });
  } catch (error) {
    next(error);
  }
}

async function updateNews(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const newsItem = await News.findById(id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News item not found" });

    if (payload.slug && payload.slug !== newsItem.slug) {
      const exists = await News.findOne({ slug: payload.slug });
      if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });
      newsItem.slug = payload.slug;
    }

    Object.assign(newsItem, payload);

    if (payload.isPublished && !newsItem.publishedAt) newsItem.publishedAt = new Date();
    if (!payload.isPublished) newsItem.publishedAt = null;

    await newsItem.save();

    await createAuditLog({ user: req.user, action: "UPDATE_NEWS", module: "NEWS", entityId: newsItem._id, entityTitle: newsItem.slug, metadata: { changedFields: Object.keys(payload) } });

    res.json({ success: true, data: newsItem });
  } catch (error) {
    next(error);
  }
}

async function deleteNews(req, res, next) {
  try {
    const { id } = req.params;
    const newsItem = await News.findByIdAndDelete(id);
    if (!newsItem) return res.status(404).json({ success: false, message: "News item not found" });

    await createAuditLog({ user: req.user, action: "DELETE_NEWS", module: "NEWS", entityId: newsItem._id, entityTitle: newsItem.slug });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function publicList(req, res, next) {
  try {
    const featured = await News.find({ isPublished: true, isFeatured: true }).populate("featuredImage").sort({ publishedAt: -1 }).limit(4);
    const items = await News.find({ isPublished: true }).populate("featuredImage").sort({ publishedAt: -1 });
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
    const item = await News.findOne({ slug, isPublished: true }).populate("featuredImage gallery");
    if (!item) {
      const fallback = loadFallback();
      const found = fallback.find((n) => n.slug === slug);
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
  createNews,
  updateNews,
  deleteNews,
  publicList,
  publicDetail
};
