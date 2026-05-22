import { useEffect, useState } from "react";
import { http } from "../api/http";
import BookCard from "../components/BookCard.jsx";
import { EmptyState, ErrorMessage, Loading } from "../components/StatusMessage.jsx";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([http.get("/books", { params: { pageSize: 24 } }), http.get("/books/recommendations")])
      .then(([bookRes, recRes]) => {
        setBooks(bookRes.data.items || []);
        setRecommendations(recRes.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function buy(bookId) {
    try {
      await http.post("/orders", { bookId });
      alert("订单已创建，请到交易页查看");
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
      setRecommendations((prev) => prev.filter(({ book }) => book._id !== bookId));
    } catch (err) {
      alert(err.message);
    }
  }

  async function view(bookId) {
    const { data } = await http.get(`/books/${bookId}`);
    alert(`《${data.title}》\n课程：${data.courseName}\n联系方式：${data.contactMethod || "未填写"}\n备注：${data.tradeNote || "无"}`);
  }

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">AI 驱动的教材流通平台</p>
          <h1>让教材找到真正需要它的同学</h1>
          <p>按课程、专业和学习需求智能匹配二手教材，支持校内自提、在线下单和交易评价。</p>
          <div className="hero-actions">
            <span>课程精准匹配</span>
            <span>校内线下自提</span>
            <span>交易评价保障</span>
          </div>
        </div>
      </section>
      <ErrorMessage error={error} />

      <section className="feature-row">
        <div>
          <strong>一键求书</strong>
          <span>看到合适教材可直接下单，卖家确认后线下自提。</span>
        </div>
        <div>
          <strong>智能标签</strong>
          <span>上架时自动识别课程、备考、专业方向等标签。</span>
        </div>
        <div>
          <strong>个性推荐</strong>
          <span>根据课程、兴趣、浏览和购买行为推荐相关书籍。</span>
        </div>
      </section>

      <div className="section-title">
        <div>
          <p className="eyebrow">For You</p>
          <h2>智能推荐</h2>
        </div>
        <span>根据你的课程和画像生成</span>
      </div>
      {loading && <Loading />}
      <div className="grid">
        {recommendations.map(({ book, score }) => (
          <BookCard key={book._id} book={book} score={score} onBuy={buy} onView={view} />
        ))}
      </div>
      {!loading && !recommendations.length && <EmptyState text="暂无推荐，先去搜索或完善个人画像吧" />}

      <div className="section-title">
        <div>
          <p className="eyebrow">New Books</p>
          <h2>最新上架</h2>
        </div>
        <span>覆盖公共课、专业课、考研和四六级资料</span>
      </div>
      <div className="grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} onBuy={buy} onView={view} />
        ))}
      </div>
      {!loading && !books.length && <EmptyState text="暂无可交易书籍" />}
    </main>
  );
}
