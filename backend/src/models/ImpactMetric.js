const mongoose = require("mongoose");

const impactMetricSchema = new mongoose.Schema(
  {
    title: { type: Object, default: {} },
    value: { type: String, required: true },
    description: { type: Object, default: {} },
    isHighlighted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

impactMetricSchema.index({ isHighlighted: -1, createdAt: -1 });

module.exports = mongoose.model("ImpactMetric", impactMetricSchema);
