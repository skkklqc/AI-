# 在线访问

**校园二手书共享平台：** http://1.117.70.56

---

# AI 驱动的校园二手书共享平台

这是一个可运行的前后端分离示例项目，用于展示校园二手书共享小程序/平台的核心功能：用户画像、书籍上架与下架、关键词检索、课程名匹配、交易订单、评价体系和协同过滤智能推荐。

## 技术栈

- 前端：React + Vite + React Router + Axios
- 后端：Node.js + Express + MongoDB + Mongoose
- 鉴权：JWT
- 推荐：用户画像内容匹配 + 简化协同过滤

## 项目目录结构

```text
campus-used-book-platform
├── client
│   ├── index.html
│   ├── package.json
│   └── src
│       ├── api
│       │   └── http.js
│       ├── components
│       │   └── BookCard.jsx
│       ├── pages
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── SearchPage.jsx
│       │   └── TradePage.jsx
│       ├── state
│       │   └── AuthContext.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server
│   ├── .env.example
│   ├── package.json
│   └── src
│       ├── config
│       │   └── db.js
│       ├── middleware
│       │   └── auth.js
│       ├── models
│       │   ├── Book.js
│       │   ├── Order.js
│       │   ├── Review.js
│       │   └── User.js
│       ├── routes
│       │   ├── auth.js
│       │   ├── books.js
│       │   ├── orders.js
│       │   ├── reviews.js
│       │   └── users.js
│       ├── utils
│       │   ├── recommendation.js
│       │   └── tags.js
│       ├── app.js
│       └── seed.js
├── .gitignore
├── package.json
└── README.md
```

## 启动方式

1. 安装并启动 MongoDB，本地默认地址为 `mongodb://127.0.0.1:27017/campus_used_books`。
2. 复制环境变量文件：

```bash
cp server/.env.example server/.env
```

3. 安装依赖：

```bash
npm install
npm run install:all
```

4. 初始化示例数据：

```bash
npm run seed --prefix server
```

注意：`seed` 会清空当前示例数据库并重新写入演示数据，已有真实用户数据时不要执行。

5. 同时启动前后端：

```bash
npm run dev
```

前端默认访问 `http://localhost:5173`，后端默认访问 `http://localhost:5000`。

示例账号：

```text
13800000001 / 123456
13800000002 / 123456
13800000003 / 123456
```

## 部署成可直接访问的网址

本项目已经支持单服务部署：生产环境下 Express 会同时提供后端 API 和 React 前端页面。部署成功后，面试官只需要打开一个网址即可体验项目。

如果在中国大陆访问，优先推荐腾讯云轻量应用服务器部署。详细步骤见 [`DEPLOY_TENCENT.md`](DEPLOY_TENCENT.md)。

### 1. 准备 MongoDB Atlas

1. 注册并登录 [MongoDB Atlas](https://www.mongodb.com/atlas)。
2. 创建免费集群，创建数据库用户。
3. 在 Network Access 中允许访问。演示项目可临时设置为 `0.0.0.0/0`。
4. 复制连接字符串，格式类似：

```text
mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/campus_used_books?retryWrites=true&w=majority
```

### 2. 上传 GitHub

```bash
git init
git add .
git commit -m "init campus used book platform"
git branch -M main
git remote add origin https://github.com/你的用户名/campus-used-book-platform.git
git push -u origin main
```

### 3. 在 Render 部署

1. 登录 [Render](https://render.com/)。
2. New -> Web Service，连接你的 GitHub 仓库。
3. 配置：
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: `Node`
4. 添加环境变量：
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: 你的 MongoDB Atlas 连接字符串
   - `JWT_SECRET`: 任意一段较长随机字符串
5. 点击 Deploy。

部署完成后，Render 会生成一个类似下面的网址：

```text
https://campus-used-book-platform.onrender.com
```

### 4. 初始化线上演示数据

如果想让线上环境也有示例书籍，可以在 Render 的 Shell 中运行：

```bash
npm run seed
```

注意：`seed` 会清空当前数据库并重新写入演示数据，已有真实数据时不要执行。

## MVP 可用流程

1. 注册或登录用户，填写专业、课程和兴趣标签，形成基础用户画像。
2. 在首页查看智能推荐和最新上架书籍，点击查看详情会记录浏览行为。
3. 在搜索页通过关键词、课程名、分类筛选书籍，并可直接下单。
4. 在交易页上架自己的书籍，填写价格和联系方式。
5. 买家下单后，卖家在交易页确认订单；线下自提完成后，买家确认收书。
6. 订单完成后，双方可以评价，个人中心会展示信用评分和收到的评价。

## 核心页面

- 首页：展示 AI 推荐书籍、最新上架书籍和匹配效率指标。
- 搜索页：支持关键词、标签、课程名模糊检索。
- 交易页：支持书籍上架、卖家确认、买家完成、取消订单和提交评价。
- 个人中心：展示并编辑用户画像、信用评分、收到的评价、我的上架和重新上架/下架。

## 后端接口示例

### 用户注册 / 登录

- `POST /api/auth/register`
- `POST /api/auth/login`

注册时写入专业、年级、校区、课程、兴趣标签，形成基础用户画像。

### 上架 / 下架书籍

- `POST /api/books`
- `GET /api/books/:id`
- `PUT /api/books/:id`
- `PATCH /api/books/:id/offline`
- `PATCH /api/books/:id/online`
- `POST /api/books/:id/view`

书籍上架时会调用 `generateBookTags()` 自动生成标签。

### 搜索书籍

- `GET /api/books/search?keyword=数据结构&course=数据结构&category=教材&page=1`

支持分页、分类筛选、书名、作者、描述、标签、课程名匹配；搜索关键词会回写到用户行为画像。

### 智能推荐

- `GET /api/books/recommendations`

推荐接口会结合用户课程、兴趣、搜索关键词、相似用户浏览与购买行为，对可交易书籍进行排序。

### 订单与评价

- `POST /api/orders`
- `GET /api/orders/mine`
- `PATCH /api/orders/:id/confirm`
- `PATCH /api/orders/:id/complete`
- `PATCH /api/orders/:id/cancel`
- `POST /api/reviews`
- `GET /api/reviews/mine`
- `GET /api/reviews/order/:orderId`

## 数据库设计

### users 用户集合

- `nickname: String`：昵称
- `phone: String`：手机号，唯一
- `passwordHash: String`：加密密码
- `major: String`：专业
- `grade: String`：年级
- `campus: String`：校区
- `courses: String[]`：当前课程
- `interests: String[]`：兴趣标签
- `behavior.viewedBookIds: ObjectId[]`：浏览过的书
- `behavior.searchedKeywords: String[]`：搜索关键词
- `behavior.purchasedBookIds: ObjectId[]`：已购买书籍

### books 书籍集合

- `title: String`：书名
- `author: String`：作者
- `isbn: String`：ISBN
- `courseName: String`：关联课程
- `category: String`：分类
- `tags: String[]`：自动标签
- `description: String`：描述
- `price: Number`：售价
- `originalPrice: Number`：原价
- `condition: String`：成色
- `contactMethod: String`：交易联系方式
- `tradeNote: String`：交易备注
- `imageUrls: String[]`：书籍图片 URL
- `viewCount: Number`：浏览次数
- `status: String`：`available`、`reserved`、`sold`、`offline`
- `owner: ObjectId`：发布者

### orders 订单集合

- `book: ObjectId`：书籍
- `buyer: ObjectId`：买家
- `seller: ObjectId`：卖家
- `price: Number`：成交价
- `contactSnapshot: String`：下单时的联系方式快照
- `cancelReason: String`：取消原因
- `status: String`：`pending`、`confirmed`、`completed`、`cancelled`
- `confirmedAt/completedAt/cancelledAt: Date`：状态时间

### reviews 评价集合

- `order: ObjectId`：订单
- `book: ObjectId`：书籍
- `reviewer: ObjectId`：评价人
- `targetUser: ObjectId`：被评价人
- `rating: Number`：评分
- `content: String`：评价内容

## 核心算法逻辑

### 协同过滤推荐

`server/src/utils/recommendation.js` 中通过 Jaccard 相似度计算用户画像相似度：

```js
similarity = intersection(userAFeatures, userBFeatures) / union(userAFeatures, userBFeatures)
```

用户特征由课程、兴趣标签和搜索关键词组成。推荐时先找到相似用户，再结合相似用户浏览、购买行为和当前书籍标签匹配度计算综合分：

```js
finalScore = contentScore * 0.7 + collaborativeScore * 0.3
```

### 关键词自动标签生成

`server/src/utils/tags.js` 中使用课程词典和关键词词典抽取标签，例如：

- 书籍包含“数据结构”时自动生成 `计算机`、`编程`、`算法` 标签。
- 描述包含“真题”时自动生成 `真题`、`备考` 标签。

真实项目中可以将该模块替换为 AI 大模型接口，对书名、课程名和描述进行标签抽取、课程归一化和模糊语义匹配。
