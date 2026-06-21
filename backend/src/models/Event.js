const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: Object, default: {} },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: Object, default: {} },
    body: { type: Object, default: {} },
    location: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    registrationUrl: { type: String, default: "" },
    featuredImage: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    meta: { type: Object, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

eventSchema.index({ isPublished: 1, isFeatured: -1, publishedAt: -1 });

module.exports = mongoose.model("Event", eventSchema);
