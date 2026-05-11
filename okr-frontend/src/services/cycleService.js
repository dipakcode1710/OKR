import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const cycleService = {
  getAll: async () => {
    const res = await apiClient.get(ENDPOINTS.cycles.list);
    return res.data;
  },

  getActive: async () => {
    const res = await apiClient.get(ENDPOINTS.cycles.active);
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.cycles.byId(id));
    return res.data;
  },

  create: async (payload) => {
    // payload: { cycleName, cycleCode, cycleType, startDate, endDate, isActive, meta? }
    const res = await apiClient.post(ENDPOINTS.cycles.create, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.put(ENDPOINTS.cycles.update(id), payload);
    return res.data;
  },

  lock: async (id) => {
    const res = await apiClient.patch(ENDPOINTS.cycles.lock(id));
    return res.data;
  },

  remove: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.cycles.remove(id));
    return res.data;
  },
};

export default cycleService;
