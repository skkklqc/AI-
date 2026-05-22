import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nickname: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    major: { type: String, default: "" },
    grade: { type: String, default: "" },
    campus: { type: String, default: "" },
    courses: [{ type: String }],
    interests: [{ type: String }],
    behavior: {
      viewedBookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
      searchedKeywords: [{ type: String }],
      purchasedBookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
