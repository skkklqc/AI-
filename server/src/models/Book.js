import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    author: { type: String, default: "", trim: true, maxlength: 40 },
    isbn: { type: String, default: "", trim: true, maxlength: 20 },
    courseName: { type: String, required: true, trim: true, index: true },
    category: { type: String, default: "教材", trim: true },
    tags: [{ type: String, index: true }],
    description: { type: String, default: "", maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    condition: {
      type: String,
      enum: ["全新", "九成新", "八成新", "有笔记", "旧书"],
      default: "八成新"
    },
    contactMethod: { type: String, required: true, trim: true, maxlength: 80 },
    tradeNote: { type: String, default: "", maxlength: 200 },
    imageUrls: [{ type: String }],
    viewCount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["available", "reserved", "sold", "offline"],
      default: "available",
      index: true
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", courseName: "text", description: "text", tags: "text" });

export const Book = mongoose.model("Book", bookSchema);
