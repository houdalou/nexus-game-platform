import api from "../api/axios";

const userService = {
  getMe: () => api.get("/users/me"),
  getProfile: () => api.get("/users/profile"),
  updateMe: (data) => api.put("/users/me", data),

  // Admin
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  getStats: (id) => api.get(`/users/${id}/stats`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  ban: (id) => api.put(`/users/${id}/ban`),
  unban: (id) => api.put(`/users/${id}/unban`),
  resetPassword: (id, password) => api.put(`/users/${id}/reset-password?password=${encodeURIComponent(password)}`),
};

export default userService;
