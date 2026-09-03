// api/axios.js
// -----------------------------------------------------------------------
// A single, shared Axios instance so we don't repeat the base URL and
// auth-header logic in every page. Every API call in the app goes
// through this file.
// -----------------------------------------------------------------------

import axios from "axios";

// During development, Vite proxies /api requests to the backend (see
// vite.config.js) — but to keep this explicit and simple for beginners,
// we point straight at the backend URL here instead.
const API_BASE_URL = import.meta.env.VITE_API_URL|| "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// "Request interceptor": runs before every single request. If we have a
// login token saved in localStorage, attach it as an Authorization header
// so protected backend routes (like POST /items) accept the request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
