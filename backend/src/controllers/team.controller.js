const TeamMember = require("../models/TeamMember");
const { createAuditLog } = require("../services/audit.service");
const fs = require("fs");
const path = require("path");

function loadFallback() {
  try {
    const json = fs.readFileSync(path.join(__dirname, "../../fallback/team.json"), "utf8");
    return JSON.parse(json);
  } catch (_err) {
    return [];
  }
}

async function adminList(req, res, next) {
  try {
    const items = await TeamMember.find().populate("photo").sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createTeamMember(req, res, next) {
  try {
    const payload = req.body;
    const member = await TeamMember.create({ ...payload, createdBy: req.user?._id || null });

    await createAuditLog({
      user: req.user,
      action: "CREATE_TEAM_MEMBER",
      module: "TEAM",
      entityId: member._id,
      entityTitle: member.name?.en || member.name?.bn || "Team member"
    });

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
}

async function updateTeamMember(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const member = await TeamMember.findById(id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });

    Object.assign(member, payload);
    await member.save();

    await createAuditLog({
      user: req.user,
      action: "UPDATE_TEAM_MEMBER",
      module: "TEAM",
      entityId: member._id,
      entityTitle: member.name?.en || member.name?.bn || "Team member",
      metadata: { changedFields: Object.keys(payload) }
    });

    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
}

async function deleteTeamMember(req, res, next) {
  try {
    const { id } = req.params;
    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });

    await createAuditLog({
      user: req.user,
      action: "DELETE_TEAM_MEMBER",
      module: "TEAM",
      entityId: member._id,
      entityTitle: member.name?.en || member.name?.bn || "Team member"
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function publicList(req, res, next) {
  try {
    const items = await TeamMember.find({ isPublished: true }).populate("photo").sort({ createdAt: -1 });
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
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  publicList
};
