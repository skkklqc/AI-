import { useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";
import { ErrorMessage } from "../components/StatusMessage.jsx";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    nickname: "小李",
    phone: "13800000001",
    password: "123456",
    major: "计算机科学与技术",
    grade: "大二",
    campus: "东区",
    courses: "数据结构,操作系统",
    interests: "计算机,考研"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) {
      setError("请输入有效的 11 位手机号");
      return;
    }

    if (form.password.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }

    try {
      setSubmitting(true);
      if (isRegister) {
        await register({
          ...form,
          courses: form.courses.split(/[，,]/).map((item) => item.trim()).filter(Boolean),
          interests: form.interests.split(/[，,]/).map((item) => item.trim()).filter(Boolean)
        });
      } else {
        await login(form.phone, form.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-home">
      <section className="auth-hero">
        <p className="eyebrow">校园教材流转平台</p>
        <h1>登录后即可搜索、下单和发布二手书</h1>
        <p>支持手机号注册，系统会根据你的专业、课程和兴趣生成用户画像，推荐更适合你的教材和备考资料。</p>
        <div className="hero-actions">
          <span>手机号注册</span>
          <span>智能推荐</span>
          <span>关键词模糊搜索</span>
        </div>
      </section>

      <section className="panel auth-card">
        <div className="auth-tabs">
          <button className={!isRegister ? "tab-active" : "ghost"} onClick={() => setIsRegister(false)}>登录</button>
          <button className={isRegister ? "tab-active" : "ghost"} onClick={() => setIsRegister(true)}>注册</button>
        </div>
        <h2>{isRegister ? "手机号注册" : "手机号登录"}</h2>
        <p className="muted">测试账号：13800000001 / 123456。新用户可直接用自己的手机号注册。</p>
        <ErrorMessage error={error} />
        <form onSubmit={submit} className="form-grid">
          {isRegister && <input value={form.nickname} onChange={(e) => update("nickname", e.target.value)} placeholder="昵称（可选）" />}
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="手机号" />
          <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="密码，至少 6 位" />
          {isRegister && (
            <>
              <input value={form.major} onChange={(e) => update("major", e.target.value)} placeholder="专业，例如：计算机科学与技术" />
              <input value={form.grade} onChange={(e) => update("grade", e.target.value)} placeholder="年级，例如：大二" />
              <input value={form.campus} onChange={(e) => update("campus", e.target.value)} placeholder="校区，例如：东区" />
              <input value={form.courses} onChange={(e) => update("courses", e.target.value)} placeholder="课程，逗号分隔" />
              <input value={form.interests} onChange={(e) => update("interests", e.target.value)} placeholder="兴趣标签，逗号分隔" />
            </>
          )}
          <button disabled={submitting}>{submitting ? "处理中..." : isRegister ? "注册并进入平台" : "登录进入平台"}</button>
        </form>
      </section>
    </main>
  );
}
