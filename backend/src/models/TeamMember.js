const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: Object, default: {} },
    role: { type: Object, default: {} },
    bio: { type: Object, default: {} },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

teamMemberSchema.index({ isPublished: -1, createdAt: -1 });

module.exports = mongoose.model("TeamMember", teamMemberSchema);
