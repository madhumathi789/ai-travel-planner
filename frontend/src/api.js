// src/api.js
import axios from "axios";

// Use deployed backend URL from .env
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token ONLY for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    !req.url.includes("/auth/login") &&
    !req.url.includes("/auth/register")
  ) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;