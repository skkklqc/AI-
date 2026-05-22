import { useEffect, useState } from "react";
import { http } from "../api/http";
import BookForm, { emptyBookForm } from "../components/BookForm.jsx";
import OrderCard from "../components/OrderCard.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import { EmptyState, ErrorMessage } from "../components/StatusMessage.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function TradePage() {
  const { user } = useAuth();
  const [book, setBook] = useState(emptyBookForm);
  const [orders, setOrders] = useState([]);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadOrders() {
    const { data } = await http.get("/orders/mine");
    setOrders(data);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function publish(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await http.post("/books", { ...book, price: Number(book.price), originalPrice: Number(book.originalPrice) });
      setBook(emptyBookForm);
      alert("书籍已上架，系统已自动生成关键词标签");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirm(orderId) {
    await http.patch(`/orders/${orderId}/confirm`);
    await loadOrders();
  }

  async function complete(orderId) {
    try {
      await http.patch(`/orders/${orderId}/complete`);
      await loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  async function cancel(orderId) {
    const reason = window.prompt("请输入取消原因", "计划有变");
    if (reason === null) return;
    await http.patch(`/orders/${orderId}/cancel`, { reason });
    await loadOrders();
  }

  async function submitReview(payload) {
    try {
      await http.post("/reviews", payload);
      setReviewOrder(null);
      alert("评价已提交");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="two-columns">
      <section className="panel">
        <h1>上架书籍</h1>
        <p className="muted">填写课程、价格和联系方式后，同学可直接下单联系你。</p>
        <ErrorMessage error={error} />
        <BookForm value={book} onChange={setBook} onSubmit={publish} disabled={submitting} />
      </section>

      <section className="panel">
        <h1>我的交易</h1>
        <p className="muted">流程：买家下单、卖家确认、线下自提、买家确认完成、双方评价。</p>
        {reviewOrder && <ReviewForm order={reviewOrder} onSubmit={submitReview} onClose={() => setReviewOrder(null)} />}
        <div className="list">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              currentUserId={user.id}
              onConfirm={confirm}
              onComplete={complete}
              onCancel={cancel}
              onReview={setReviewOrder}
            />
          ))}
        </div>
        {!orders.length && <EmptyState text="暂无交易订单" />}
      </section>
    </main>
  );
}
