const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: Object, default: {} },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: Object, default: {} },
    body: { type: Object, default: {} },
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
    featuredImage: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    meta: { type: Object, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

newsSchema.index({ isPublished: 1, isFeatured: -1, publishedAt: -1 });

module.exports = mongoose.model("News", newsSchema);
