// context/AuthContext.jsx
// -----------------------------------------------------------------------
// React Context lets us share the "who is logged in?" state with every
// page/component in the app, without passing props down manually through
// every level (this is called "prop drilling", and Context avoids it).
// -----------------------------------------------------------------------

import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // On first load, check if we already have a saved user/token from a
  // previous session (so refreshing the page doesn't log you out).
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // --- login: sends credentials, saves the returned token + user -------
  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data);
    return data;
  }

  // --- register: creates an account, then logs the user straight in ----
  async function register(name, email, password, campusId) {
    const { data } = await api.post("/auth/register", { name, email, password, campusId });
    saveSession(data);
    return data;
  }

  // --- logout: clears everything -----------------------------------
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  // Helper used by both login() and register()
  function saveSession(data) {
    const { token, ...userInfo } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  const value = { user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components can just do: const { user, login } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
