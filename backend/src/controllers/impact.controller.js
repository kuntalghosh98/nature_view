const ImpactMetric = require("../models/ImpactMetric");
const { createAuditLog } = require("../services/audit.service");
const fs = require("fs");
const path = require("path");

function loadFallback() {
  try {
    const json = fs.readFileSync(path.join(__dirname, "../../fallback/impact.json"), "utf8");
    return JSON.parse(json);
  } catch (_err) {
    return [];
  }
}

async function adminList(req, res, next) {
  try {
    const items = await ImpactMetric.find().sort({ isHighlighted: -1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createImpact(req, res, next) {
  try {
    const payload = req.body;
    const impact = await ImpactMetric.create({ ...payload, createdBy: req.user?._id || null });

    await createAuditLog({
      user: req.user,
      action: "CREATE_IMPACT_METRIC",
      module: "IMPACT",
      entityId: impact._id,
      entityTitle: impact.title?.en || impact.value
    });

    res.status(201).json({ success: true, data: impact });
  } catch (error) {
    next(error);
  }
}

async function updateImpact(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const impact = await ImpactMetric.findById(id);
    if (!impact) return res.status(404).json({ success: false, message: "Impact metric not found" });

    Object.assign(impact, payload);
    await impact.save();

    await createAuditLog({
      user: req.user,
      action: "UPDATE_IMPACT_METRIC",
      module: "IMPACT",
      entityId: impact._id,
      entityTitle: impact.title?.en || impact.value,
      metadata: { changedFields: Object.keys(payload) }
    });

    res.json({ success: true, data: impact });
  } catch (error) {
    next(error);
  }
}

async function deleteImpact(req, res, next) {
  try {
    const { id } = req.params;
    const impact = await ImpactMetric.findByIdAndDelete(id);
    if (!impact) return res.status(404).json({ success: false, message: "Impact metric not found" });

    await createAuditLog({
      user: req.user,
      action: "DELETE_IMPACT_METRIC",
      module: "IMPACT",
      entityId: impact._id,
      entityTitle: impact.title?.en || impact.value
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function publicList(req, res, next) {
  try {
    const items = await ImpactMetric.find({ isPublished: true }).sort({ isHighlighted: -1, createdAt: -1 });
    if (!items || items.length === 0) {
      const fallback = loadFallback();
      return res.json({ success: true, data: fallback });
    }
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  adminList,
  createImpact,
  updateImpact,
  deleteImpact,
  publicList
};
