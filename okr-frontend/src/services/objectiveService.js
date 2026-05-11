import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const objectiveService = {
  /**
   * List objectives. Optional filters:
   * { cycleId, employeeId, teamId, status }
   */
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.cycleId != null) params.cycleId = filters.cycleId;
    if (filters.employeeId != null) params.employeeId = filters.employeeId;
    if (filters.teamId != null) params.teamId = filters.teamId;
    if (filters.status) params.status = filters.status;

    const res = await apiClient.get(ENDPOINTS.objectives.list, { params });
    return res.data;
  },

  getByCycle: async (cycleId) =>
    objectiveService.getAll({ cycleId }),

  getByEmployee: async (employeeId) =>
    objectiveService.getAll({ employeeId }),

  getByTeam: async (teamId) =>
    objectiveService.getAll({ teamId }),

  getByStatus: async (status) =>
    objectiveService.getAll({ status }),

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.objectives.byId(id));
    return res.data;
  },

  getByPublicId: async (publicId) => {
    const res = await apiClient.get(ENDPOINTS.objectives.byPublicId(publicId));
    return res.data;
  },

  getChildren: async (id) => {
    const res = await apiClient.get(ENDPOINTS.objectives.children(id));
    return res.data;
  },

  getAligned: async (id) => {
    const res = await apiClient.get(ENDPOINTS.objectives.aligned(id));
    return res.data;
  },

  /**
   * Create. Payload fields:
   *   cycleId, ownerEmployeeId, ownerTeamId, parentObjectiveId,
   *   alignedObjectiveId, objectiveTitle, objectiveDescription,
   *   objectiveScope, objectiveType, goalCategory, successCriteria,
   *   status, progressPct, confidenceScore, scoringMethod,
   *   checkInFrequency, startDate, dueDate
   */
  create: async (payload) => {
    const res = await apiClient.post(ENDPOINTS.objectives.create, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.put(ENDPOINTS.objectives.update(id), payload);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await apiClient.patch(
      ENDPOINTS.objectives.updateStatus(id),
      { status }
    );
    return res.data;
  },

  updateProgress: async (id, { progressPct, confidenceScore }) => {
    const res = await apiClient.patch(
      ENDPOINTS.objectives.updateProgress(id),
      { progressPct, confidenceScore }
    );
    return res.data;
  },

  softDelete: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.objectives.softDelete(id));
    return res.data;
  },

  hardDelete: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.objectives.hardDelete(id));
    return res.data;
  },

  restore: async (id) => {
    const res = await apiClient.patch(ENDPOINTS.objectives.restore(id));
    return res.data;
  },
};

export default objectiveService;
