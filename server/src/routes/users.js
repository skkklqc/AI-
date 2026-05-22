import express from "express";
import { User } from "../models/User.js";
import { Book } from "../models/Book.js";
import { Review } from "../models/Review.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toCleanString, toStringList } from "../utils/validation.js";

const router = express.Router();

router.get("/me", authRequired, asyncHandler(async (req, res) => {
  const [user, books, reviews] = await Promise.all([
    User.findById(req.user._id).select("-passwordHash"),
    Book.find({ owner: req.user._id }).sort({ createdAt: -1 }),
    Review.find({ targetUser: req.user._id }).sort({ createdAt: -1 }).limit(20).populate("reviewer", "nickname")
  ]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 5;

  res.json({ user, books, reviews, avgRating });
}));

router.patch("/me/profile", authRequired, asyncHandler(async (req, res) => {
  const allowedFields = ["nickname", "major", "grade", "campus", "courses", "interests"];
  const update = {};

  allowedFields.forEach((field) => {
    if (field in req.body) {
      update[field] = ["courses", "interests"].includes(field)
        ? toStringList(req.body[field])
        : toCleanString(req.body[field]);
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-passwordHash");
  res.json(user);
}));

export default router;
