import api from "../api/axios";

const auditService = {
  getAll: () => api.get("/admin/audit"),
  getRecent: (days) => api.get(`/admin/audit/recent/${days}`),
  getByAdmin: (username) => api.get(`/admin/audit/admin/${username}`),
  getByAction: (action) => api.get(`/admin/audit/action/${action}`),
};

export default auditService;
