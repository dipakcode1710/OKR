import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const keyResultService = {
  getByObjective: async (objectiveId) => {
    const res = await apiClient.get(ENDPOINTS.keyResults.byObjective(objectiveId));
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.keyResults.byId(id));
    return res.data;
  },

  /**
   * Create. Payload fields:
   *   objectiveId, keyResultTitle, keyResultDescription, metricName,
   *   baselineValue, targetValue, stretchTargetValue, currentValue,
   *   measurementUnit, measurementType, calculationMethod,
   *   weightPct, confidenceLevel, reviewStatus
   */
  create: async (payload) => {
    const res = await apiClient.post(ENDPOINTS.keyResults.create, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.put(ENDPOINTS.keyResults.update(id), payload);
    return res.data;
  },

  /**
   * Update progress. Recalculates KR progress and rolls up to objective.
   * payload: { currentValue, confidenceLevel?, trendDirection? }
   */
  updateProgress: async (id, payload) => {
    const res = await apiClient.patch(
      ENDPOINTS.keyResults.updateProgress(id),
      payload
    );
    return res.data;
  },

  remove: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.keyResults.remove(id));
    return res.data;
  },
};

export default keyResultService;
