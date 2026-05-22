const courseDictionary = {
  "高等数学": ["数学", "大一", "理工", "公共课"],
  "线性代数": ["数学", "理工", "公共课"],
  "大学英语": ["英语", "公共课", "四六级"],
  "数据结构": ["计算机", "编程", "算法"],
  "操作系统": ["计算机", "系统", "考研"],
  "计算机网络": ["计算机", "网络", "考研"],
  "数据库原理": ["计算机", "数据库", "SQL"],
  "Java程序设计": ["计算机", "Java", "编程"],
  "Python程序设计": ["计算机", "Python", "编程"],
  "管理学": ["经管", "管理", "商科"],
  "微观经济学": ["经管", "经济学", "商科"],
  "宏观经济学": ["经管", "经济学", "商科"],
  "会计学": ["经管", "会计", "商科"]
};

const keywordDictionary = {
  "考研": ["考研", "复习资料"],
  "真题": ["真题", "备考"],
  "教材": ["教材"],
  "笔记": ["有笔记"],
  "习题": ["习题册", "刷题"],
  "期末": ["期末复习"],
  "复习": ["复习资料"],
  "计算机": ["计算机"],
  "英语": ["英语"],
  "数学": ["数学"],
  "四六级": ["英语", "四六级"]
};

const searchAliasDictionary = {
  "高数": ["高等数学", "数学", "同济"],
  "线代": ["线性代数", "数学"],
  "大英": ["大学英语", "英语", "四级", "六级", "四六级"],
  "四级": ["大学英语", "英语", "四级", "CET4", "四六级"],
  "六级": ["大学英语", "英语", "六级", "CET6", "四六级"],
  "408": ["数据结构", "操作系统", "计算机网络", "计算机组成原理", "组成原理", "计网"],
  "计网": ["计算机网络", "网络", "408"],
  "组成原理": ["计算机组成原理", "计组", "408"],
  "计组": ["计算机组成原理", "组成原理", "408"],
  "数据库": ["数据库原理", "数据库系统概论", "SQL", "MySQL"],
  "软工": ["软件工程", "软件工程导论"],
  "算法": ["数据结构", "算法", "算法导论"],
  "java": ["Java", "Java程序设计", "后端开发"],
  "python": ["Python", "Python程序设计", "编程"],
  "前端": ["HTML", "CSS", "JavaScript", "Vue", "React"],
  "后端": ["Java", "Spring", "数据库", "操作系统", "计算机网络"],
  "考研": ["考研", "408", "考研数学", "考研英语", "考研政治", "复习资料"],
  "经管": ["管理学", "经济学", "会计学", "微观经济学", "宏观经济学"]
};

export function normalizeText(text = "") {
  return String(text).trim().toLowerCase();
}

export function generateBookTags({ title = "", courseName = "", description = "", category = "" }) {
  const source = normalizeText(`${title} ${courseName} ${description} ${category}`.replace(/\s+/g, ""));
  const tags = new Set();

  if (category) tags.add(String(category).trim());
  if (courseName) tags.add(String(courseName).trim());

  Object.entries(courseDictionary).forEach(([course, courseTags]) => {
    if (source.includes(course)) {
      courseTags.forEach((tag) => tags.add(tag));
    }
  });

  Object.entries(keywordDictionary).forEach(([keyword, keywordTags]) => {
    if (source.includes(keyword)) {
      keywordTags.forEach((tag) => tags.add(tag));
    }
  });

  // 实际项目可替换为大模型抽取接口，这里用词典规则保证示例可直接运行。
  return Array.from(tags).filter(Boolean);
}

export function buildSearchRegex(keyword = "") {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
}

export function expandSearchTerms(keyword = "") {
  const cleaned = normalizeText(keyword).replace(/\s+/g, "");
  if (!cleaned) return [];

  const terms = new Set([keyword, cleaned]);
  Object.entries(searchAliasDictionary).forEach(([alias, values]) => {
    const normalizedAlias = normalizeText(alias);
    const normalizedValues = values.map((value) => normalizeText(value));

    if (
      cleaned.includes(normalizedAlias) ||
      normalizedValues.some((value) => value.includes(cleaned) || cleaned.includes(value))
    ) {
      terms.add(alias);
      values.forEach((value) => terms.add(value));
    }
  });

  return Array.from(terms).filter(Boolean);
}
