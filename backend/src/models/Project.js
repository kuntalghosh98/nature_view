const mongoose = require("mongoose");

const localizedString = {
  en: { type: String, default: "" },
  bn: { type: String, default: "" }
};

const projectSchema = new mongoose.Schema(
  {
    title: { type: Object, default: {} },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: Object, default: {} },
    body: { type: Object, default: {} },
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
    featuredImage: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
    status: {
      type: String,
      enum: ["demo", "upcoming", "on-going", "completed"],
      default: "demo"
    },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    meta: { type: Object, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

projectSchema.index({ isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model("Project", projectSchema);
