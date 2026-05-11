import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const checkInService = {
  getByObjective: async (objectiveId) => {
    const res = await apiClient.get(ENDPOINTS.checkIns.byObjective(objectiveId));
    return res.data;
  },

  getByKeyResult: async (keyResultId) => {
    const res = await apiClient.get(ENDPOINTS.checkIns.byKeyResult(keyResultId));
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.checkIns.byId(id));
    return res.data;
  },

  /**
   * Create. Payload fields:
   *   objectiveId, keyResultId?, employeeId, checkInDate, weekNumber,
   *   updateType, summary, details, progressPct, confidenceScore,
   *   healthStatus, wins, blockers, nextSteps, visibility
   */
  create: async (payload) => {
    const res = await apiClient.post(ENDPOINTS.checkIns.create, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.put(ENDPOINTS.checkIns.update(id), payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.checkIns.remove(id));
    return res.data;
  },
};

export default checkInService;
