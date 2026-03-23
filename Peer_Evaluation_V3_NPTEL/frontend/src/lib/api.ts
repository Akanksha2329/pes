import axios from "axios";

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:${PORT}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { API_BASE_URL };
