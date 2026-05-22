import { useState } from "react";
import { http } from "../api/http";
import BookCard from "../components/BookCard.jsx";
import { EmptyState, ErrorMessage, Loading } from "../components/StatusMessage.jsx";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 12 });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function search(event, page = 1) {
    event?.preventDefault();
    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const { data } = await http.get("/books/search", { params: { keyword, course, category, page } });
      setBooks(data.items || []);
      setMeta({ total: data.total, page: data.page, pageSize: data.pageSize });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function buy(bookId) {
    try {
      await http.post("/orders", { bookId });
      alert("订单已创建，请到交易页查看");
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
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
      <section className="panel">
        <h1>关键词检索</h1>
        <p className="muted">支持书名、作者、标签、描述和课程名模糊匹配。</p>
        <form className="search-bar" onSubmit={search}>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="输入书名 / 标签 / 关键词" />
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="课程名，例如 数据结构" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="分类，例如 教材" />
          <button>搜索</button>
        </form>
      </section>

      <ErrorMessage error={error} />
      {loading && <Loading />}
      {searched && !loading && <p className="muted">共找到 {meta.total} 本书</p>}
      <div className="grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} onBuy={buy} onView={view} />
        ))}
      </div>
      {searched && !loading && !books.length && <EmptyState text="没有找到匹配书籍，换个关键词试试" />}
      {meta.total > meta.page * meta.pageSize && (
        <button className="ghost" onClick={() => search(null, meta.page + 1)}>下一页</button>
      )}
    </main>
  );
}
