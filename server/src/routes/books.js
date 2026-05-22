import express from "express";
import { Book } from "../models/Book.js";
import { User } from "../models/User.js";
import { authRequired } from "../middleware/auth.js";
import { buildSearchRegex, expandSearchTerms, generateBookTags } from "../utils/tags.js";
import { findSimilarUsers, scoreBookForUser } from "../utils/recommendation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parsePagination, requireFields, toCleanString, toStringList } from "../utils/validation.js";

const router = express.Router();

function buildBookPayload(body) {
  const payload = {
    title: toCleanString(body.title),
    author: toCleanString(body.author),
    isbn: toCleanString(body.isbn),
    courseName: toCleanString(body.courseName),
    category: toCleanString(body.category) || "教材",
    description: toCleanString(body.description),
    price: Number(body.price),
    originalPrice: body.originalPrice === "" || body.originalPrice == null ? undefined : Number(body.originalPrice),
    condition: toCleanString(body.condition) || "八成新",
    contactMethod: toCleanString(body.contactMethod),
    tradeNote: toCleanString(body.tradeNote),
    imageUrls: toStringList(body.imageUrls)
  };

  payload.tags = Array.from(new Set([...toStringList(body.tags), ...generateBookTags(payload)]));
  return payload;
}

router.get("/", asyncHandler(async (req, res) => {
  const { page, pageSize, skip } = parsePagination(req.query);
  const filter = { status: "available" };
  if (req.query.category) filter.category = toCleanString(req.query.category);

  const [items, total] = await Promise.all([
    Book.find(filter)
    .populate("owner", "nickname campus")
    .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Book.countDocuments(filter)
  ]);

  res.json({ items, total, page, pageSize });
}));

router.post("/", authRequired, asyncHandler(async (req, res) => {
  const payload = buildBookPayload(req.body);
  const missing = requireFields(payload, ["title", "courseName", "contactMethod"]);

  if (missing) return res.status(400).json({ message: missing });
  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return res.status(400).json({ message: "价格必须是有效数字" });
  }

  const book = await Book.create({
    ...payload,
    owner: req.user._id
  });

  res.status(201).json(book);
}));

router.get("/search", authRequired, asyncHandler(async (req, res) => {
  const { page, pageSize, skip } = parsePagination(req.query);
  const keyword = toCleanString(req.query.keyword);
  const course = toCleanString(req.query.course);
  const category = toCleanString(req.query.category);
  const conditions = [{ status: "available" }];

  if (keyword) {
    const regexes = expandSearchTerms(keyword).map(buildSearchRegex);
    conditions.push({
      $or: regexes.flatMap((regex) => [
        { title: regex },
        { author: regex },
        { description: regex },
        { tags: regex },
        { courseName: regex }
      ])
    });
  }

  if (course) {
    const regexes = expandSearchTerms(course).map(buildSearchRegex);
    conditions.push({ $or: regexes.map((regex) => ({ courseName: regex })) });
  }

  if (category) {
    conditions.push({ category });
  }

  if (keyword) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { "behavior.searchedKeywords": keyword }
    });
  }

  const filter = { $and: conditions };
  const [items, total] = await Promise.all([
    Book.find(filter)
      .populate("owner", "nickname campus")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Book.countDocuments(filter)
  ]);

  res.json({ items, total, page, pageSize });
}));

router.get("/recommendations", authRequired, asyncHandler(async (req, res) => {
  const [currentUser, users, books] = await Promise.all([
    User.findById(req.user._id),
    User.find({}),
    Book.find({ status: "available", owner: { $ne: req.user._id } }).populate("owner", "nickname campus")
  ]);

  const similarUsers = findSimilarUsers(currentUser, users);
  const recommendations = books
    .map((book) => ({
      book,
      rawScore: scoreBookForUser(currentUser, book, similarUsers)
    }))
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 12)
    .map((item, index) => ({
      book: item.book,
      score: Math.max(7, 10 - Math.floor(index / 3))
    }));

  res.json(recommendations);
}));

router.get("/:id", authRequired, asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("owner", "nickname campus");
  if (!book) return res.status(404).json({ message: "书籍不存在" });

  if (String(book.owner._id || book.owner) !== String(req.user._id)) {
    await Book.findByIdAndUpdate(book._id, { $inc: { viewCount: 1 } });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { "behavior.viewedBookIds": book._id }
    });
  }

  res.json(book);
}));

router.put("/:id", authRequired, asyncHandler(async (req, res) => {
  const payload = buildBookPayload(req.body);
  const missing = requireFields(payload, ["title", "courseName", "contactMethod"]);

  if (missing) return res.status(400).json({ message: missing });
  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return res.status(400).json({ message: "价格必须是有效数字" });
  }

  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id, status: { $in: ["available", "offline"] } },
    payload,
    { new: true, runValidators: true }
  );

  if (!book) return res.status(404).json({ message: "书籍不存在、无权限操作或交易中不可编辑" });
  res.json(book);
}));

router.patch("/:id/offline", authRequired, asyncHandler(async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id, status: { $in: ["available", "offline"] } },
    { status: "offline" },
    { new: true }
  );

  if (!book) return res.status(404).json({ message: "书籍不存在或无权限操作" });
  res.json(book);
}));

router.patch("/:id/online", authRequired, asyncHandler(async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id, status: "offline" },
    { status: "available" },
    { new: true }
  );

  if (!book) return res.status(404).json({ message: "书籍不存在或无权限操作" });
  res.json(book);
}));

router.post("/:id/view", authRequired, asyncHandler(async (req, res) => {
  await Promise.all([
    Book.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }),
    User.findByIdAndUpdate(req.user._id, {
      $addToSet: { "behavior.viewedBookIds": req.params.id }
    })
  ]);
  res.json({ message: "浏览记录已更新" });
}));

export default router;
