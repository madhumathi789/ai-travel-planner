// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ adjust if backend runs elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

// // Automatically attach token if logged in
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
 //✅ Attach token ONLY for protected routes
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
