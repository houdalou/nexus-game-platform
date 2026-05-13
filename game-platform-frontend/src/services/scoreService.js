import api from "../api/axios";

const scoreService = {
  getLeaderboard: () => api.get("/scores/leaderboard"),
  submitScore: (points) => api.post("/scores", null, { params: { points } }),
  submitArcade: (points, gameType) => api.post("/arcade/score", null, { params: { points, gameType } }),
};

export default scoreService;
