export default function BookCard({ book, score, onBuy, onOffline, onOnline, onView }) {
  return (
    <article className="card">
      {book.imageUrls?.[0] && <img className="book-image" src={book.imageUrls[0]} alt={book.title} />}
      <div className="card-title">
        <h3>{book.title}</h3>
        <span className="price">¥{book.price}</span>
      </div>
      <p>{book.courseName || "未绑定课程"} · {book.condition}</p>
      <p className="muted">{book.description}</p>
      <div className="tags">
        {(book.tags || []).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      {typeof score === "number" && <p className="score">推荐分：{Math.round(score)}</p>}
      <div className="actions">
        {onView && <button className="ghost" onClick={() => onView(book._id)}>查看详情</button>}
        {onBuy && <button onClick={() => onBuy(book._id)}>一键求书/下单</button>}
        {onOffline && book.status !== "offline" && <button className="ghost" onClick={() => onOffline(book._id)}>下架</button>}
        {onOnline && book.status === "offline" && <button onClick={() => onOnline(book._id)}>重新上架</button>}
      </div>
    </article>
  );
}
