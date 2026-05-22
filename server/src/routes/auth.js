import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isPhone, publicUser, toCleanString, toStringList } from "../utils/validation.js";

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
}

router.post("/register", asyncHandler(async (req, res) => {
  const phone = toCleanString(req.body.phone);
  const nickname = toCleanString(req.body.nickname) || `用户${phone.slice(-4)}`;
  const password = toCleanString(req.body.password);
  const major = toCleanString(req.body.major);
  const grade = toCleanString(req.body.grade);
  const campus = toCleanString(req.body.campus);
  const courses = toStringList(req.body.courses);
  const interests = toStringList(req.body.interests);

  if (!phone || !password) {
    return res.status(400).json({ message: "手机号和密码不能为空" });
  }

  if (!isPhone(phone)) {
    return res.status(400).json({ message: "请输入有效的 11 位手机号" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "密码至少需要 6 位" });
  }

  const exists = await User.findOne({ phone });
  if (exists) {
    return res.status(409).json({ message: "手机号已注册" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    nickname,
    phone,
    passwordHash,
    major,
    grade,
    campus,
    courses,
    interests
  });

  res.status(201).json({
    token: createToken(user),
    user: publicUser(user)
  });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const phone = toCleanString(req.body.phone);
  const password = toCleanString(req.body.password);

  if (!isPhone(phone) || !password) {
    return res.status(400).json({ message: "请输入有效手机号和密码" });
  }

  const user = await User.findOne({ phone });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "手机号或密码错误" });
  }

  res.json({
    token: createToken(user),
    user: publicUser(user)
  });
}));

export default router;
