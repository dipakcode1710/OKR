import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const employeeService = {
  getAll: async () => {
    const res = await apiClient.get(ENDPOINTS.employees.list);
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.employees.byId(id));
    return res.data;
  },
};

export default employeeService;
