import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Book } from "./models/Book.js";
import { Order } from "./models/Order.js";
import { Review } from "./models/Review.js";
import { generateBookTags } from "./utils/tags.js";

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Book.deleteMany({}), Order.deleteMany({}), Review.deleteMany({})]);

  const passwordHash = await bcrypt.hash("123456", 10);
  const users = await User.insertMany([
    {
      nickname: "小李",
      phone: "13800000001",
      passwordHash,
      major: "计算机科学与技术",
      grade: "大二",
      campus: "东区",
      courses: ["数据结构", "操作系统"],
      interests: ["计算机", "考研"],
      behavior: { searchedKeywords: ["数据结构", "考研"] }
    },
    {
      nickname: "小王",
      phone: "13800000002",
      passwordHash,
      major: "经济学",
      grade: "大一",
      campus: "西区",
      courses: ["微观经济学", "高等数学"],
      interests: ["经管", "数学"]
    },
    {
      nickname: "小陈",
      phone: "13800000003",
      passwordHash,
      major: "英语",
      grade: "大三",
      campus: "南区",
      courses: ["大学英语"],
      interests: ["四六级", "真题", "备考"]
    },
    {
      nickname: "小赵",
      phone: "13800000004",
      passwordHash,
      major: "软件工程",
      grade: "大三",
      campus: "东区",
      courses: ["数据库原理", "Java程序设计"],
      interests: ["后端开发", "编程", "实习"]
    },
    {
      nickname: "小周",
      phone: "13800000005",
      passwordHash,
      major: "会计学",
      grade: "大二",
      campus: "西区",
      courses: ["会计学", "管理学"],
      interests: ["经管", "考证"]
    },
    {
      nickname: "小林",
      phone: "13800000006",
      passwordHash,
      major: "自动化",
      grade: "大一",
      campus: "北区",
      courses: ["高等数学", "线性代数"],
      interests: ["理工", "公共课", "刷题"]
    }
  ]);

  const rawBooks = [
    {
      title: "数据结构 C语言版",
      author: "严蔚敏",
      courseName: "数据结构",
      category: "教材",
      description: "计算机专业核心课教材，含少量笔记，适合期末复习。",
      price: 22,
      originalPrice: 45,
      condition: "有笔记",
      contactMethod: "微信 data-book-02",
      tradeNote: "晚 7 点后可在图书馆门口自提",
      imageUrls: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600"],
      owner: users[1]._id
    },
    {
      title: "高等数学同济第七版",
      author: "同济大学数学系",
      courseName: "高等数学",
      category: "教材",
      description: "公共课教材，保存较好，适合大一新生。",
      price: 18,
      originalPrice: 39,
      condition: "八成新",
      contactMethod: "手机号 13800000001",
      tradeNote: "适合大一公共课，封面轻微磨损",
      imageUrls: ["https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600"],
      owner: users[0]._id
    },
    {
      title: "大学英语四级真题",
      author: "新东方",
      courseName: "大学英语",
      category: "备考资料",
      description: "四六级真题和解析，适合考前刷题。",
      price: 15,
      originalPrice: 35,
      condition: "九成新",
      contactMethod: "QQ 123456789",
      tradeNote: "含 6 套未写真题",
      imageUrls: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600"],
      owner: users[1]._id
    },
    {
      title: "计算机网络第八版",
      author: "谢希仁",
      courseName: "计算机网络",
      category: "教材",
      description: "考研和期末都适合，重点章节有划线。",
      price: 26,
      originalPrice: 49,
      condition: "有笔记",
      contactMethod: "微信 network-book",
      tradeNote: "可附送课程 PPT 目录",
      imageUrls: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"],
      owner: users[2]._id
    },
    {
      title: "微观经济学原理",
      author: "曼昆",
      courseName: "微观经济学",
      category: "教材",
      description: "经管专业课教材，九成新，无笔记。",
      price: 30,
      originalPrice: 68,
      condition: "九成新",
      contactMethod: "手机号 13800000002",
      tradeNote: "支持当面验书",
      imageUrls: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"],
      owner: users[1]._id
    },
    {
      title: "操作系统概念",
      author: "Abraham Silberschatz",
      courseName: "操作系统",
      category: "教材",
      description: "计算机专业核心课，适合期末和考研复习，部分章节有重点标注。",
      price: 35,
      originalPrice: 88,
      condition: "八成新",
      contactMethod: "微信 os-review",
      tradeNote: "可一起交流复习重点",
      imageUrls: ["https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600"],
      owner: users[3]._id
    },
    {
      title: "数据库系统概论",
      author: "王珊",
      courseName: "数据库原理",
      category: "教材",
      description: "数据库课程常用教材，SQL 部分笔记完整。",
      price: 24,
      originalPrice: 49,
      condition: "有笔记",
      contactMethod: "手机号 13800000004",
      tradeNote: "附送实验报告目录参考",
      imageUrls: ["https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600"],
      owner: users[3]._id
    },
    {
      title: "Java 核心技术 卷 I",
      author: "Cay S. Horstmann",
      courseName: "Java程序设计",
      category: "编程书",
      description: "适合 Java 入门和课程设计，保存很好。",
      price: 42,
      originalPrice: 119,
      condition: "九成新",
      contactMethod: "微信 java-campus",
      tradeNote: "可送电子版学习路线",
      imageUrls: ["https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600"],
      owner: users[3]._id
    },
    {
      title: "Python 编程 从入门到实践",
      author: "Eric Matthes",
      courseName: "Python程序设计",
      category: "编程书",
      description: "适合选修课和自学，项目章节很实用。",
      price: 38,
      originalPrice: 89,
      condition: "八成新",
      contactMethod: "QQ 99887766",
      tradeNote: "封面轻微折痕，内容完整",
      imageUrls: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600"],
      owner: users[0]._id
    },
    {
      title: "线性代数辅导讲义",
      author: "李永乐",
      courseName: "线性代数",
      category: "考研资料",
      description: "考研数学线代复习资料，重点题型有标注。",
      price: 16,
      originalPrice: 39,
      condition: "有笔记",
      contactMethod: "微信 linear-book",
      tradeNote: "适合刚开始复习的同学",
      imageUrls: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600"],
      owner: users[5]._id
    },
    {
      title: "概率论与数理统计",
      author: "浙江大学",
      courseName: "概率论",
      category: "教材",
      description: "公共数学课教材，课后题答案页有少量标记。",
      price: 14,
      originalPrice: 36,
      condition: "八成新",
      contactMethod: "手机号 13800000006",
      tradeNote: "可和线代资料一起打包",
      imageUrls: ["https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600"],
      owner: users[5]._id
    },
    {
      title: "大学物理学",
      author: "张三慧",
      courseName: "大学物理",
      category: "教材",
      description: "理工科公共课教材，无缺页，有少量公式笔记。",
      price: 20,
      originalPrice: 52,
      condition: "八成新",
      contactMethod: "微信 physics-campus",
      tradeNote: "可晚上自提",
      imageUrls: ["https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=600"],
      owner: users[5]._id
    },
    {
      title: "管理学原理",
      author: "周三多",
      courseName: "管理学",
      category: "教材",
      description: "经管类基础课教材，适合期末复习。",
      price: 19,
      originalPrice: 45,
      condition: "九成新",
      contactMethod: "手机号 13800000005",
      tradeNote: "基本无笔记",
      imageUrls: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600"],
      owner: users[4]._id
    },
    {
      title: "基础会计学",
      author: "教材编写组",
      courseName: "会计学",
      category: "教材",
      description: "会计专业基础课，含重点章节目录标记。",
      price: 21,
      originalPrice: 48,
      condition: "有笔记",
      contactMethod: "微信 accounting-book",
      tradeNote: "可附送课堂练习照片",
      imageUrls: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600"],
      owner: users[4]._id
    },
    {
      title: "宏观经济学",
      author: "曼昆",
      courseName: "宏观经济学",
      category: "教材",
      description: "经济学专业教材，九成新，适合搭配微观经济学使用。",
      price: 32,
      originalPrice: 68,
      condition: "九成新",
      contactMethod: "QQ 456789123",
      tradeNote: "微观宏观一起买可优惠",
      imageUrls: ["https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600"],
      owner: users[1]._id
    },
    {
      title: "考研英语真题黄皮书",
      author: "张剑",
      courseName: "考研英语",
      category: "考研资料",
      description: "近十年真题解析，阅读部分有少量批注。",
      price: 28,
      originalPrice: 79,
      condition: "八成新",
      contactMethod: "微信 english-ky",
      tradeNote: "适合英语一备考",
      imageUrls: ["https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600"],
      owner: users[2]._id
    },
    {
      title: "六级词汇乱序版",
      author: "新东方",
      courseName: "大学英语",
      category: "备考资料",
      description: "六级词汇书，前 30 页有勾画。",
      price: 10,
      originalPrice: 32,
      condition: "八成新",
      contactMethod: "手机号 13800000003",
      tradeNote: "可送听力练习链接",
      imageUrls: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600"],
      owner: users[2]._id
    },
    {
      title: "四级听力专项训练",
      author: "星火英语",
      courseName: "大学英语",
      category: "备考资料",
      description: "四级听力专项练习，配套二维码可用。",
      price: 12,
      originalPrice: 29,
      condition: "九成新",
      contactMethod: "微信 cet-listen",
      tradeNote: "适合考前冲刺",
      imageUrls: ["https://images.unsplash.com/photo-1526243741027-444d633d7365?w=600"],
      owner: users[2]._id
    },
    {
      title: "计算机组成原理",
      author: "唐朔飞",
      courseName: "计算机组成原理",
      category: "教材",
      description: "计算机考研 408 相关教材，章节重点清楚。",
      price: 23,
      originalPrice: 45,
      condition: "有笔记",
      contactMethod: "微信 408-book",
      tradeNote: "可搭配操作系统一起出",
      imageUrls: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"],
      owner: users[3]._id
    },
    {
      title: "软件工程导论",
      author: "张海藩",
      courseName: "软件工程",
      category: "教材",
      description: "软件工程课程教材，适合课程设计和期末复习。",
      price: 18,
      originalPrice: 42,
      condition: "八成新",
      contactMethod: "手机号 13800000004",
      tradeNote: "可送课程项目模板",
      imageUrls: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600"],
      owner: users[3]._id
    },
    {
      title: "思想道德与法治",
      author: "高等教育出版社",
      courseName: "思政课",
      category: "公共课教材",
      description: "公共必修课教材，几乎全新。",
      price: 8,
      originalPrice: 25,
      condition: "九成新",
      contactMethod: "微信 public-course",
      tradeNote: "适合低年级同学",
      imageUrls: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"],
      owner: users[0]._id
    },
    {
      title: "中国近现代史纲要",
      author: "高等教育出版社",
      courseName: "思政课",
      category: "公共课教材",
      description: "公共课教材，便宜出，书页干净。",
      price: 7,
      originalPrice: 24,
      condition: "九成新",
      contactMethod: "QQ 112233445",
      tradeNote: "可与思修教材一起带走",
      imageUrls: ["https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600"],
      owner: users[1]._id
    },
    {
      title: "考研政治核心考案",
      author: "徐涛",
      courseName: "考研政治",
      category: "考研资料",
      description: "考研政治复习资料，框架图部分有标注。",
      price: 18,
      originalPrice: 49,
      condition: "有笔记",
      contactMethod: "微信 politics-ky",
      tradeNote: "适合暑期开始复习",
      imageUrls: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"],
      owner: users[2]._id
    }
  ];

  rawBooks.push(
    {
      title: "算法导论",
      author: "Thomas H. Cormen",
      courseName: "算法设计与分析",
      category: "计算机教材",
      description: "经典算法教材，适合算法课、竞赛入门和考研提升。",
      price: 55,
      originalPrice: 128,
      condition: "八成新",
      contactMethod: "微信 algo-campus",
      tradeNote: "书较厚，可在信息楼当面验书",
      imageUrls: ["https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600"],
      owner: users[3]._id
    },
    {
      title: "计算机组成与设计",
      author: "David A. Patterson",
      courseName: "计算机组成原理",
      category: "计算机教材",
      description: "组成原理进阶教材，适合深入理解 CPU、指令集和存储层次。",
      price: 48,
      originalPrice: 99,
      condition: "九成新",
      contactMethod: "QQ 4082026",
      tradeNote: "可搭配 408 资料一起出",
      imageUrls: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"],
      owner: users[0]._id
    },
    {
      title: "计算机组成原理考研辅导",
      author: "王道论坛",
      courseName: "计算机组成原理",
      category: "考研资料",
      description: "408 组成原理辅导书，选择题和大题重点都有标记。",
      price: 26,
      originalPrice: 49,
      condition: "有笔记",
      contactMethod: "微信 wangdao-408",
      tradeNote: "适合 408 一轮复习",
      imageUrls: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600"],
      owner: users[3]._id
    },
    {
      title: "数据结构考研复习指导",
      author: "王道论坛",
      courseName: "数据结构",
      category: "考研资料",
      description: "408 数据结构复习书，树、图、排序章节笔记较多。",
      price: 24,
      originalPrice: 46,
      condition: "有笔记",
      contactMethod: "手机号 13800000004",
      tradeNote: "适合考研计算机专业课",
      imageUrls: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600"],
      owner: users[3]._id
    },
    {
      title: "操作系统考研复习指导",
      author: "王道论坛",
      courseName: "操作系统",
      category: "考研资料",
      description: "408 操作系统复习书，进程、内存、文件系统部分有重点标记。",
      price: 25,
      originalPrice: 48,
      condition: "八成新",
      contactMethod: "微信 os-408",
      tradeNote: "可和计网资料打包",
      imageUrls: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"],
      owner: users[0]._id
    },
    {
      title: "计算机网络考研复习指导",
      author: "王道论坛",
      courseName: "计算机网络",
      category: "考研资料",
      description: "408 计算机网络复习资料，TCP/IP 和路由章节标注清晰。",
      price: 25,
      originalPrice: 48,
      condition: "有笔记",
      contactMethod: "QQ 100408408",
      tradeNote: "适合搜索 408、计网、网络",
      imageUrls: ["https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600"],
      owner: users[3]._id
    },
    {
      title: "MySQL 必知必会",
      author: "Ben Forta",
      courseName: "数据库原理",
      category: "编程书",
      description: "数据库入门书，适合 SQL、数据库实验和后端开发。",
      price: 18,
      originalPrice: 49,
      condition: "九成新",
      contactMethod: "微信 mysql-book",
      tradeNote: "几乎全新",
      imageUrls: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600"],
      owner: users[0]._id
    },
    {
      title: "数据库系统实现",
      author: "Hector Garcia-Molina",
      courseName: "数据库原理",
      category: "计算机教材",
      description: "数据库进阶教材，适合数据库系统课程和深入学习。",
      price: 46,
      originalPrice: 98,
      condition: "八成新",
      contactMethod: "微信 db-system",
      tradeNote: "适合搜索数据库、SQL",
      imageUrls: ["https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600"],
      owner: users[3]._id
    },
    {
      title: "Java 编程思想",
      author: "Bruce Eckel",
      courseName: "Java程序设计",
      category: "编程书",
      description: "Java 经典教材，适合 Java 课程、后端方向和实习准备。",
      price: 39,
      originalPrice: 108,
      condition: "八成新",
      contactMethod: "微信 java-think",
      tradeNote: "有少量便签",
      imageUrls: ["https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600"],
      owner: users[3]._id
    },
    {
      title: "Spring Boot 实战",
      author: "Craig Walls",
      courseName: "Java Web开发",
      category: "编程书",
      description: "适合后端开发、课程设计和毕业设计接口开发。",
      price: 32,
      originalPrice: 79,
      condition: "九成新",
      contactMethod: "手机号 13800000004",
      tradeNote: "可搭配 Java 编程思想",
      imageUrls: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600"],
      owner: users[3]._id
    },
    {
      title: "JavaScript 高级程序设计",
      author: "Nicholas C. Zakas",
      courseName: "Web前端开发",
      category: "编程书",
      description: "前端经典书，适合 JavaScript、React、Vue 学习。",
      price: 44,
      originalPrice: 119,
      condition: "八成新",
      contactMethod: "微信 js-front",
      tradeNote: "适合搜索前端、JS、JavaScript",
      imageUrls: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600"],
      owner: users[0]._id
    },
    {
      title: "Vue.js 设计与实现",
      author: "霍春阳",
      courseName: "Web前端开发",
      category: "编程书",
      description: "适合前端进阶，理解 Vue 原理和响应式实现。",
      price: 36,
      originalPrice: 89,
      condition: "九成新",
      contactMethod: "微信 vue-book",
      tradeNote: "没有明显划线",
      imageUrls: ["https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600"],
      owner: users[3]._id
    },
    {
      title: "React 学习手册",
      author: "Alex Banks",
      courseName: "Web前端开发",
      category: "编程书",
      description: "适合 React 项目开发、前端课程设计和组件化学习。",
      price: 30,
      originalPrice: 69,
      condition: "八成新",
      contactMethod: "QQ 20262026",
      tradeNote: "配合本项目也能学习",
      imageUrls: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"],
      owner: users[1]._id
    },
    {
      title: "Linux 就该这么学",
      author: "刘遄",
      courseName: "Linux系统",
      category: "计算机教材",
      description: "Linux 入门和服务器部署都能用，适合后端方向。",
      price: 27,
      originalPrice: 79,
      condition: "八成新",
      contactMethod: "微信 linux-campus",
      tradeNote: "命令章节有标注",
      imageUrls: ["https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600"],
      owner: users[0]._id
    },
    {
      title: "鸟哥的 Linux 私房菜",
      author: "鸟哥",
      courseName: "Linux系统",
      category: "计算机教材",
      description: "Linux 经典书，适合系统管理、服务器和运维方向。",
      price: 45,
      originalPrice: 128,
      condition: "八成新",
      contactMethod: "手机号 13800000001",
      tradeNote: "书很厚，建议当面自提",
      imageUrls: ["https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600"],
      owner: users[0]._id
    },
    {
      title: "编译原理",
      author: "Alfred V. Aho",
      courseName: "编译原理",
      category: "计算机教材",
      description: "龙书，适合编译原理课程和语言实现方向。",
      price: 52,
      originalPrice: 118,
      condition: "九成新",
      contactMethod: "微信 compiler-book",
      tradeNote: "适合高年级计算机同学",
      imageUrls: ["https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=600"],
      owner: users[3]._id
    },
    {
      title: "深入理解计算机系统 CSAPP",
      author: "Randal E. Bryant",
      courseName: "计算机系统基础",
      category: "计算机教材",
      description: "计算机系统经典教材，适合体系结构、操作系统和底层方向。",
      price: 58,
      originalPrice: 139,
      condition: "八成新",
      contactMethod: "QQ 1357911",
      tradeNote: "适合搜索 CSAPP、系统、操作系统",
      imageUrls: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"],
      owner: users[1]._id
    },
    {
      title: "计算机程序的构造和解释 SICP",
      author: "Harold Abelson",
      courseName: "程序设计基础",
      category: "计算机教材",
      description: "经典程序设计思想书，适合想提升抽象能力的同学。",
      price: 40,
      originalPrice: 88,
      condition: "九成新",
      contactMethod: "微信 sicp-book",
      tradeNote: "适合自学和进阶",
      imageUrls: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600"],
      owner: users[2]._id
    },
    {
      title: "网络安全基础",
      author: "教材编写组",
      courseName: "网络安全",
      category: "计算机教材",
      description: "网络安全课程教材，包含密码学、Web 安全和攻防基础。",
      price: 22,
      originalPrice: 55,
      condition: "八成新",
      contactMethod: "微信 security-book",
      tradeNote: "适合网安方向入门",
      imageUrls: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600"],
      owner: users[3]._id
    },
    {
      title: "软件测试技术",
      author: "朱少民",
      courseName: "软件测试",
      category: "计算机教材",
      description: "软件测试课程用书，适合测试方向和项目验收。",
      price: 18,
      originalPrice: 45,
      condition: "八成新",
      contactMethod: "手机号 13800000004",
      tradeNote: "可送测试用例模板",
      imageUrls: ["https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600"],
      owner: users[3]._id
    }
  );

  const books = await Book.insertMany(rawBooks.map((book) => ({ ...book, tags: generateBookTags(book) })));

  users[0].behavior = {
    ...(users[0].behavior || {}),
    viewedBookIds: [books[0]._id, books[3]._id],
    purchasedBookIds: [books[2]._id],
    searchedKeywords: ["数据结构", "考研"]
  };
  users[2].behavior = {
    viewedBookIds: [books[2]._id],
    searchedKeywords: ["英语", "真题"],
    purchasedBookIds: []
  };
  await Promise.all(users.map((user) => user.save()));

  const completedOrder = await Order.create({
    book: books[2]._id,
    buyer: users[0]._id,
    seller: users[1]._id,
    price: books[2].price,
    contactSnapshot: books[2].contactMethod,
    status: "completed",
    confirmedAt: new Date(),
    completedAt: new Date()
  });

  books[2].status = "sold";
  await books[2].save();

  await Review.create({
    order: completedOrder._id,
    book: books[2]._id,
    reviewer: users[0]._id,
    targetUser: users[1]._id,
    rating: 5,
    content: "书很新，线下自提很顺利。"
  });

  console.log("Seed data inserted. Demo accounts: 13800000001 / 123456, 13800000002 / 123456");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
