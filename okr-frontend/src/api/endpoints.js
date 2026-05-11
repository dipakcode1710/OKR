// Centralized endpoint registry — keep all URL paths in one place.
// All paths are relative to /api/v1 (added by axios client).

export const ENDPOINTS = {
  // ─── Cycles ────────────────────────────────────
  cycles: {
    list: "/cycles",
    active: "/cycles/active",
    byId: (id) => `/cycles/${id}`,
    create: "/cycles",
    update: (id) => `/cycles/${id}`,
    lock: (id) => `/cycles/${id}/lock`,
    remove: (id) => `/cycles/${id}`,
  },

  // ─── Objectives ────────────────────────────────
  objectives: {
    list: "/objectives", // supports ?cycleId, ?employeeId, ?teamId, ?status
    byId: (id) => `/objectives/${id}`,
    byPublicId: (pid) => `/objectives/public/${pid}`,
    children: (id) => `/objectives/${id}/children`,
    aligned: (id) => `/objectives/${id}/aligned`,
    create: "/objectives",
    update: (id) => `/objectives/${id}`,
    updateStatus: (id) => `/objectives/${id}/status`,
    updateProgress: (id) => `/objectives/${id}/progress`,
    softDelete: (id) => `/objectives/${id}`,
    hardDelete: (id) => `/objectives/${id}/hard`,
    restore: (id) => `/objectives/${id}/restore`,
  },

  // ─── Key Results ───────────────────────────────
  keyResults: {
    byObjective: (objectiveId) => `/objectives/${objectiveId}/key-results`,
    byId: (id) => `/key-results/${id}`,
    create: "/key-results",
    update: (id) => `/key-results/${id}`,
    updateProgress: (id) => `/key-results/${id}/progress`,
    remove: (id) => `/key-results/${id}`,
  },

  // ─── Initiatives ───────────────────────────────
  initiatives: {
    byKeyResult: (keyResultId) => `/key-results/${keyResultId}/initiatives`,
    byId: (id) => `/initiatives/${id}`,
    create: "/initiatives",
    update: (id) => `/initiatives/${id}`,
    remove: (id) => `/initiatives/${id}`,
  },

  // ─── Check-ins ─────────────────────────────────
  checkIns: {
    byObjective: (objectiveId) => `/objectives/${objectiveId}/check-ins`,
    byKeyResult: (keyResultId) => `/key-results/${keyResultId}/check-ins`,
    byId: (id) => `/check-ins/${id}`,
    create: "/check-ins",
    update: (id) => `/check-ins/${id}`,
    remove: (id) => `/check-ins/${id}`,
  },

  // ─── Teams ─────────────────────────────────────
  teams: {
    list: "/teams", // supports ?search=
    byId: (id) => `/teams/${id}`,
    create: "/teams",
    update: (id) => `/teams/${id}`,
    remove: (id) => `/teams/${id}`,
  },
};
