import express from "express";
import { Book } from "../models/Book.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toCleanString } from "../utils/validation.js";

const router = express.Router();

router.post("/", authRequired, asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);

  if (!book || book.status !== "available") {
    return res.status(400).json({ message: "书籍不可交易" });
  }

  if (String(book.owner) === String(req.user._id)) {
    return res.status(400).json({ message: "不能购买自己上架的书籍" });
  }

  const order = await Order.create({
    book: book._id,
    buyer: req.user._id,
    seller: book.owner,
    price: book.price,
    contactSnapshot: book.contactMethod,
    status: "pending"
  });

  book.status = "reserved";
  await book.save();

  res.status(201).json(order);
}));

router.patch("/:id/confirm", authRequired, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "订单不存在" });

  const isSeller = String(order.seller) === String(req.user._id);
  if (!isSeller) return res.status(403).json({ message: "仅卖家可以确认订单" });
  if (order.status !== "pending") return res.status(400).json({ message: "仅待确认订单可确认" });

  order.status = "confirmed";
  order.confirmedAt = new Date();
  await order.save();

  res.json(order);
}));

router.patch("/:id/complete", authRequired, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "订单不存在" });

  const isBuyer = String(order.buyer) === String(req.user._id);
  if (!isBuyer) return res.status(403).json({ message: "仅买家可以确认收书" });
  if (order.status !== "confirmed") return res.status(400).json({ message: "卖家确认后才能完成订单" });

  order.status = "completed";
  order.completedAt = new Date();
  await order.save();
  await Book.findByIdAndUpdate(order.book, { status: "sold" });
  await User.findByIdAndUpdate(order.buyer, {
    $addToSet: { "behavior.purchasedBookIds": order.book }
  });

  res.json(order);
}));

router.patch("/:id/cancel", authRequired, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "订单不存在" });

  const isBuyer = String(order.buyer) === String(req.user._id);
  const isSeller = String(order.seller) === String(req.user._id);
  if (!isBuyer && !isSeller) return res.status(403).json({ message: "无权限取消该订单" });
  if (!["pending", "confirmed"].includes(order.status)) {
    return res.status(400).json({ message: "当前订单状态不可取消" });
  }

  order.status = "cancelled";
  order.cancelReason = toCleanString(req.body.reason) || "用户取消";
  order.cancelledAt = new Date();
  await order.save();
  await Book.findByIdAndUpdate(order.book, { status: "available" });

  res.json(order);
}));

router.get("/mine", authRequired, asyncHandler(async (req, res) => {
  const orders = await Order.find({
    $or: [{ buyer: req.user._id }, { seller: req.user._id }]
  })
    .populate("book", "title price courseName status tags")
    .populate("buyer seller", "nickname campus")
    .sort({ createdAt: -1 });

  res.json(orders);
}));

export default router;
