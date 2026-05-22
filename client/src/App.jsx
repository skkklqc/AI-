import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import TradePage from "./pages/TradePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuth } from "./state/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="school-logo" aria-label="重庆大学标志">CQU</div>
          <div>
            <strong>重庆大学 · 校园二手书共享</strong>
            <span>AI 推荐 · 课程匹配 · 校园教材流转</span>
          </div>
        </div>
        {user && (
          <nav>
            <NavLink to="/">首页</NavLink>
            <NavLink to="/search">搜索</NavLink>
            <NavLink to="/trade">交易</NavLink>
            <NavLink to="/profile">我的</NavLink>
          </nav>
        )}
      </header>

      {!user ? (
        <LoginPage />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trade" element={<TradePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      )}
    </div>
  );
}
