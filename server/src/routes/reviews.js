import express from "express";
import { Order } from "../models/Order.js";
import { Review } from "../models/Review.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toCleanString } from "../utils/validation.js";

const router = express.Router();

router.post("/", authRequired, asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const rating = Number(req.body.rating);
  const content = toCleanString(req.body.content);
  const order = await Order.findById(orderId);

  if (!order || order.status !== "completed") {
    return res.status(400).json({ message: "仅已完成订单可评价" });
  }

  const isBuyer = String(order.buyer) === String(req.user._id);
  const isSeller = String(order.seller) === String(req.user._id);
  if (!isBuyer && !isSeller) return res.status(403).json({ message: "无权限评价该订单" });

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "评分必须是 1 到 5 的整数" });
  }

  const exists = await Review.findOne({ order: order._id, reviewer: req.user._id });
  if (exists) return res.status(409).json({ message: "该订单你已经评价过" });

  const review = await Review.create({
    order: order._id,
    book: order.book,
    reviewer: req.user._id,
    targetUser: isBuyer ? order.seller : order.buyer,
    rating,
    content
  });

  res.status(201).json(review);
}));

router.get("/mine", authRequired, asyncHandler(async (req, res) => {
  const reviews = await Review.find({ targetUser: req.user._id })
    .populate("reviewer", "nickname campus")
    .populate("book", "title courseName")
    .sort({ createdAt: -1 });

  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 5;

  res.json({ reviews, avgRating, total: reviews.length });
}));

router.get("/order/:orderId", authRequired, asyncHandler(async (req, res) => {
  const reviews = await Review.find({ order: req.params.orderId }).populate("reviewer targetUser", "nickname campus");
  res.json(reviews);
}));

export default router;
