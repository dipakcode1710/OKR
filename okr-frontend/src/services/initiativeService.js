import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const initiativeService = {
  getByKeyResult: async (keyResultId) => {
    const res = await apiClient.get(ENDPOINTS.initiatives.byKeyResult(keyResultId));
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.initiatives.byId(id));
    return res.data;
  },

  /**
   * Create. Payload fields:
   *   keyResultId, initiativeTitle, initiativeDescription, ownerEmployeeId,
   *   initiativeStatus, impactEstimate, effortEstimate, completionPct,
   *   blockerNote?, startDate, dueDate, priority, sortOrder
   */
  create: async (payload) => {
    const res = await apiClient.post(ENDPOINTS.initiatives.create, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.put(ENDPOINTS.initiatives.update(id), payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.initiatives.remove(id));
    return res.data;
  },
};

export default initiativeService;
