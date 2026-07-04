const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema(
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
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    meta: { type: Object, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

attractionSchema.index({ isPublished: 1, isFeatured: -1, publishedAt: -1 });

module.exports = mongoose.model("Attraction", attractionSchema);
