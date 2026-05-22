import { useState } from "react";

export default function ReviewForm({ order, onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  async function submit(event) {
    event.preventDefault();
    await onSubmit({ orderId: order._id, rating, content });
    setContent("");
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <h3>评价订单：{order.book?.title}</h3>
      <label>
        <span>评分</span>
        <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value} 分</option>
          ))}
        </select>
      </label>
      <label>
        <span>评价内容</span>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="交易是否顺利、书籍描述是否准确" />
      </label>
      <div className="actions">
        <button>提交评价</button>
        <button type="button" className="ghost" onClick={onClose}>关闭</button>
      </div>
    </form>
  );
}
