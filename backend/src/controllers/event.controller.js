const Event = require("../models/Event");
const { createAuditLog } = require("../services/audit.service");
const fs = require("fs");
const path = require("path");

function loadFallback() {
  try {
    const json = fs.readFileSync(path.join(__dirname, "../../fallback/events.json"), "utf8");
    return JSON.parse(json);
  } catch (_err) {
    return [];
  }
}

async function adminList(req, res, next) {
  try {
    const items = await Event.find().populate("featuredImage").sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const payload = req.body;
    if (!payload.slug) payload.slug = (payload.title?.en || payload.title?.bn || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const exists = await Event.findOne({ slug: payload.slug });
    if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });

    const eventItem = await Event.create({ ...payload, createdBy: req.user?._id || null });

    await createAuditLog({ user: req.user, action: "CREATE_EVENT", module: "EVENTS", entityId: eventItem._id, entityTitle: eventItem.slug });

    res.status(201).json({ success: true, data: eventItem });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const eventItem = await Event.findById(id);
    if (!eventItem) return res.status(404).json({ success: false, message: "Event not found" });

    if (payload.slug && payload.slug !== eventItem.slug) {
      const exists = await Event.findOne({ slug: payload.slug });
      if (exists) return res.status(409).json({ success: false, message: "Slug already exists" });
      eventItem.slug = payload.slug;
    }

    Object.assign(eventItem, payload);

    if (payload.isPublished && !eventItem.publishedAt) eventItem.publishedAt = new Date();
    if (!payload.isPublished) eventItem.publishedAt = null;

    await eventItem.save();

    await createAuditLog({ user: req.user, action: "UPDATE_EVENT", module: "EVENTS", entityId: eventItem._id, entityTitle: eventItem.slug, metadata: { changedFields: Object.keys(payload) } });

    res.json({ success: true, data: eventItem });
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const eventItem = await Event.findByIdAndDelete(id);
    if (!eventItem) return res.status(404).json({ success: false, message: "Event not found" });

    await createAuditLog({ user: req.user, action: "DELETE_EVENT", module: "EVENTS", entityId: eventItem._id, entityTitle: eventItem.slug });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function publicList(req, res, next) {
  try {
    const featured = await Event.find({ isPublished: true, isFeatured: true }).populate("featuredImage").sort({ startDate: 1 }).limit(4);
    const items = await Event.find({ isPublished: true }).populate("featuredImage").sort({ startDate: 1 });
    if ((!items || items.length === 0) && (!featured || featured.length === 0)) {
      const fallback = loadFallback();
      return res.json({ success: true, data: fallback });
    }
    res.json({ success: true, data: { featured, items } });
  } catch (error) {
    next(error);
  }
}

async function publicDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const item = await Event.findOne({ slug, isPublished: true }).populate("featuredImage");
    if (!item) {
      const fallback = loadFallback();
      const found = fallback.find((e) => e.slug === slug);
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
  createEvent,
  updateEvent,
  deleteEvent,
  publicList,
  publicDetail
};
