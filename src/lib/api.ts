import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// PRODUCTOS
export const productAPI = {
  getAll: (categoria?: string, sortBy?: string) =>
    api.get("/products", { params: { categoria, sortBy } }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post("/products", data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  registerClick: (id: string, referer?: string) =>
    api.post(`/products/${id}/click`, { referer }),
};

// ANALYTICS
export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
  getProductAnalytics: (id: string) => api.get(`/analytics/producto/${id}`),
  getRecent: () => api.get("/analytics/recent"),
};

export default api;