import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/users.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ message: "campus used book server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));

  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(error.errors)[0]?.message || "数据校验失败" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "数据已存在，请勿重复提交" });
  }

  res.status(error.status || 500).json({ message: error.message || "服务器内部错误" });
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  });
