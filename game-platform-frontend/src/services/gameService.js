import api from "../api/axios";

const gameService = {
  getAll: () => api.get("/games"),
  getAllAdmin: () => api.get("/games/admin"),
  create: (data) => api.post("/games", data),
  update: (id, data) => api.put(`/games/${id}`, data),
  delete: (id) => api.delete(`/games/${id}`),
  toggle: (id) => api.put(`/games/${id}/toggle`),
};

export default gameService;
