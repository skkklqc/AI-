const fields = [
  ["title", "书名 *"],
  ["author", "作者"],
  ["courseName", "关联课程 *"],
  ["category", "分类"],
  ["price", "售价 *"],
  ["originalPrice", "原价"],
  ["condition", "成色"],
  ["contactMethod", "联系方式 *"],
  ["imageUrls", "图片 URL，逗号分隔"],
  ["description", "书籍描述"],
  ["tradeNote", "交易备注"]
];

export const emptyBookForm = {
  title: "",
  author: "",
  courseName: "",
  category: "教材",
  price: 20,
  originalPrice: 50,
  condition: "八成新",
  contactMethod: "",
  imageUrls: "",
  description: "",
  tradeNote: ""
};

export default function BookForm({ value, onChange, onSubmit, submitText = "发布书籍", disabled = false }) {
  function update(field, fieldValue) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      {fields.map(([field, label]) => (
        <label key={field}>
          <span>{label}</span>
          {["description", "tradeNote"].includes(field) ? (
            <textarea value={value[field] || ""} onChange={(event) => update(field, event.target.value)} />
          ) : (
            <input
              value={value[field] || ""}
              type={["price", "originalPrice"].includes(field) ? "number" : "text"}
              onChange={(event) => update(field, event.target.value)}
            />
          )}
        </label>
      ))}
      <button disabled={disabled}>{disabled ? "提交中..." : submitText}</button>
    </form>
  );
}
