import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(phone, password) {
    const { data } = await http.post("/auth/login", { phone, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await http.post("/auth/register", payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  function updateUser(nextUser) {
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  useEffect(() => {
    function handleExpired() {
      setUser(null);
    }

    window.addEventListener("auth-expired", handleExpired);
    const token = localStorage.getItem("token");
    if (token) {
      http.get("/users/me")
        .then(({ data }) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        })
        .catch(() => logout());
    }

    return () => window.removeEventListener("auth-expired", handleExpired);
  }, []);

  const value = useMemo(() => ({ user, login, register, logout, updateUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
