import { useEffect, useState } from "react";
import { http } from "../api/http";
import BookCard from "../components/BookCard.jsx";
import { EmptyState, ErrorMessage, Loading } from "../components/StatusMessage.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(5);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    const { data } = await http.get("/users/me");
      setProfile(data.user);
      setBooks(data.books);
    setReviews(data.reviews || []);
    setAvgRating(data.avgRating || 5);
    setForm({
      nickname: data.user.nickname || "",
      major: data.user.major || "",
      grade: data.user.grade || "",
      campus: data.user.campus || "",
      courses: (data.user.courses || []).join(","),
      interests: (data.user.interests || []).join(",")
    });
  }

  useEffect(() => {
    loadProfile()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function offline(bookId) {
    await http.patch(`/books/${bookId}/offline`);
    setBooks((prev) => prev.map((book) => (book._id === bookId ? { ...book, status: "offline" } : book)));
  }

  async function online(bookId) {
    await http.patch(`/books/${bookId}/online`);
    setBooks((prev) => prev.map((book) => (book._id === bookId ? { ...book, status: "available" } : book)));
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const { data } = await http.patch("/users/me/profile", {
        ...form,
        courses: form.courses.split(/[，,]/).map((item) => item.trim()).filter(Boolean),
        interests: form.interests.split(/[，,]/).map((item) => item.trim()).filter(Boolean)
      });
      setProfile(data);
      updateUser(data);
      setSuccess("个人信息已保存");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <main className="two-columns">
      <section className="panel">
        <h1>个人中心</h1>
        <ErrorMessage error={error} />
        {success && <div className="success-box">{success}</div>}
        <p><strong>{profile?.nickname || user.nickname}</strong></p>
        <p className="muted">{profile?.major} · {profile?.grade} · {profile?.campus}</p>
        <p className="score">信用评分：{avgRating.toFixed(1)} / 5</p>
        <h3>用户画像</h3>
        <div className="tags">
          {[...(profile?.courses || []), ...(profile?.interests || [])].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <button className="ghost profile-edit-button" onClick={() => setEditing((value) => !value)}>
          {editing ? "收起编辑" : "编辑资料"}
        </button>

        {editing && form && (
          <form className="form-grid compact" onSubmit={saveProfile}>
            <label>
              <span>昵称</span>
              <input value={form.nickname} onChange={(e) => update("nickname", e.target.value)} placeholder="请输入昵称" />
            </label>
            <label>
              <span>专业</span>
              <input value={form.major} onChange={(e) => update("major", e.target.value)} placeholder="例如：计算机科学与技术" />
            </label>
            <label>
              <span>年级</span>
              <input value={form.grade} onChange={(e) => update("grade", e.target.value)} placeholder="例如：大二" />
            </label>
            <label>
              <span>校区</span>
              <input value={form.campus} onChange={(e) => update("campus", e.target.value)} placeholder="例如：东区" />
            </label>
            <label>
              <span>课程</span>
              <input value={form.courses} onChange={(e) => update("courses", e.target.value)} placeholder="多个课程用逗号分隔" />
            </label>
            <label>
              <span>兴趣标签</span>
              <input value={form.interests} onChange={(e) => update("interests", e.target.value)} placeholder="多个兴趣用逗号分隔" />
            </label>
            <button disabled={saving}>{saving ? "保存中..." : "保存个人信息"}</button>
          </form>
        )}

        <h3>收到的评价</h3>
        <div className="list">
          {reviews.map((review) => (
            <div className="list-item" key={review._id}>
              <strong>{review.rating} 分 · {review.reviewer?.nickname}</strong>
              <span>{review.content || "对方没有填写文字评价"}</span>
            </div>
          ))}
        </div>
        {!reviews.length && <EmptyState text="暂无评价" />}

        <div className="profile-footer">
          <button className="ghost logout-button" onClick={logout}>退出登录</button>
        </div>
      </section>

      <section>
        <h1>我的上架</h1>
        <div className="grid single">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onOffline={offline} onOnline={online} />
          ))}
        </div>
        {!books.length && <EmptyState text="你还没有上架书籍" />}
      </section>
    </main>
  );
}
