const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    userName: {
      type: String,
      default: "System"
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    module: {
      type: String,
      required: true,
      trim: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    entityTitle: {
      type: String,
      default: ""
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
