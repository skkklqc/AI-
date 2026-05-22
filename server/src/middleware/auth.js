import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "请先登录" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await User.findById(payload.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "用户不存在" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "登录状态已失效" });
  }
}
