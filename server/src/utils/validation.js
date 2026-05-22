export function toCleanString(value = "") {
  return String(value).trim();
}

export function toStringList(value = []) {
  if (Array.isArray(value)) {
    return value.map(toCleanString).filter(Boolean);
  }

  return String(value)
    .split(/[，,]/)
    .map(toCleanString)
    .filter(Boolean);
}

export function isPhone(value = "") {
  return /^1[3-9]\d{9}$/.test(toCleanString(value));
}

export function requireFields(payload, fields) {
  const missing = fields.filter((field) => !toCleanString(payload[field]));
  if (missing.length) {
    return `${missing.join("、")}不能为空`;
  }
  return "";
}

export function parsePagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 12, 1), 50);
  return { page, pageSize, skip: (page - 1) * pageSize };
}

export function publicUser(user) {
  return {
    id: user._id,
    nickname: user.nickname,
    phone: user.phone,
    major: user.major,
    grade: user.grade,
    campus: user.campus,
    courses: user.courses || [],
    interests: user.interests || []
  };
}
