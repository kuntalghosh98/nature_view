const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: null },
    type: { type: String, default: "image" },
    size: { type: Number, default: 0 },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    duration: { type: Number, default: null },
    alt: { type: String, default: "" },
    tags: { type: [String], default: [] },
    language: { type: String, default: "en" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Media", mediaSchema);
