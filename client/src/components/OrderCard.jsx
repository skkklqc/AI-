const statusText = {
  pending: "待卖家确认",
  confirmed: "已确认，待线下交易",
  completed: "已完成",
  cancelled: "已取消"
};

export default function OrderCard({ order, currentUserId, onConfirm, onComplete, onCancel, onReview }) {
  const isBuyer = String(order.buyer?._id || order.buyer) === String(currentUserId);
  const isSeller = String(order.seller?._id || order.seller) === String(currentUserId);

  return (
    <div className="list-item">
      <div className="card-title">
        <strong>{order.book?.title || "书籍已删除"}</strong>
        <span className={`badge ${order.status}`}>{statusText[order.status] || order.status}</span>
      </div>
      <span>成交价：¥{order.price}</span>
      <span>联系方式：{order.contactSnapshot || "下单后线下沟通"}</span>
      <span className="muted">
        买家：{order.buyer?.nickname} · 卖家：{order.seller?.nickname}
      </span>
      <div className="actions">
        {isSeller && order.status === "pending" && <button onClick={() => onConfirm(order._id)}>卖家确认</button>}
        {isBuyer && order.status === "confirmed" && <button onClick={() => onComplete(order._id)}>确认收书</button>}
        {["pending", "confirmed"].includes(order.status) && (
          <button className="ghost" onClick={() => onCancel(order._id)}>取消订单</button>
        )}
        {order.status === "completed" && <button className="ghost" onClick={() => onReview(order)}>评价</button>}
      </div>
    </div>
  );
}
