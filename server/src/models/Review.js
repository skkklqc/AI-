import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, default: "" }
  },
  { timestamps: true }
);

reviewSchema.index({ order: 1, reviewer: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
