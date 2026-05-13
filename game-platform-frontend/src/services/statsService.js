import api from "../api/axios";

const statsService = {
  getGlobal: () => api.get("/stats/global"),
};

export default statsService;
