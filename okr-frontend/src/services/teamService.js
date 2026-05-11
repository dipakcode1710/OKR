import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const teamService = {
  getAll: async (search) => {
    const params = search ? { search } : {};
    const res = await apiClient.get(ENDPOINTS.teams.list, { params });
    return res.data;
  },

  searchByName: async (search) => teamService.getAll(search),

  getById: async (id) => {
    const res = await apiClient.get(ENDPOINTS.teams.byId(id));
    return res.data;
  },

  create: async (payload) => {
    // payload: { name, description }
    const res = await apiClient.post(ENDPOINTS.teams.create, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.put(ENDPOINTS.teams.update(id), payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await apiClient.delete(ENDPOINTS.teams.remove(id));
    return res.data;
  },
};

export default teamService;
