import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cycleService,
  objectiveService,
  keyResultService,
  initiativeService,
  checkInService,
  teamService,
} from "../services";
import {
  mapCycle,
  mapObjective,
  mapKeyResult,
  mapInitiative,
  mapCheckIn,
  mapTeam,
  toCyclePayload,
  toObjectivePayload,
  toKeyResultPayload,
  toInitiativePayload,
  toCheckInPayload,
  toProgressPayload,
  toTeamPayload,
} from "../utils/mappers";
import {
  CYCLES as SEED_CYCLES,
  OBJECTIVES as SEED_OBJECTIVES,
  KEY_RESULTS as SEED_KRS,
  INITIATIVES as SEED_INITS,
  CHECKINS as SEED_CHECKINS,
} from "../data/seedData";

const OkrContext = createContext(null);

export function OkrProvider({ children }) {
  const [cycles, setCycles] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [keyResults, setKeyResults] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // ─── Initial load ─────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cyclesData, objectivesData, teamsData] = await Promise.all([
        cycleService.getAll(),
        objectiveService.getAll(),
        teamService.getAll(),
      ]);

      const mappedCycles = (cyclesData || []).map(mapCycle);
      const mappedObjectives = (objectivesData || []).map(mapObjective);
      const mappedTeams = (teamsData || []).map(mapTeam);

      setCycles(mappedCycles);
      setObjectives(mappedObjectives);
      setTeams(mappedTeams);

      // For each objective, fetch its KRs and check-ins
      const krLists = await Promise.all(
        mappedObjectives.map((o) =>
          keyResultService.getByObjective(o.id).catch(() => [])
        )
      );
      const checkInLists = await Promise.all(
        mappedObjectives.map((o) =>
          checkInService.getByObjective(o.id).catch(() => [])
        )
      );

      const allKrs = krLists.flat().map(mapKeyResult);
      const allCheckIns = checkInLists.flat().map(mapCheckIn);
      setKeyResults(allKrs);
      setCheckIns(allCheckIns);

      // For each KR, fetch initiatives
      const initLists = await Promise.all(
        allKrs.map((k) =>
          initiativeService.getByKeyResult(k.id).catch(() => [])
        )
      );
      setInitiatives(initLists.flat().map(mapInitiative));

      setUsingFallback(false);
    } catch (e) {
      console.warn("[OKR] API load failed, using seed data fallback.", e);
      setError(e);
      setUsingFallback(true);
      setCycles(SEED_CYCLES);
      setObjectives(SEED_OBJECTIVES);
      setKeyResults(SEED_KRS);
      setInitiatives(SEED_INITS);
      setCheckIns(SEED_CHECKINS);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ─── Cycle mutations ──────────────────────────────────────────
  const createCycle = useCallback(async (form) => {
    const created = await cycleService.create(toCyclePayload(form));
    const mapped = mapCycle(created);
    setCycles((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const updateCycle = useCallback(async (id, form) => {
    const updated = await cycleService.update(id, toCyclePayload(form));
    const mapped = mapCycle(updated);
    setCycles((prev) => prev.map((c) => (c.id === id ? mapped : c)));
    return mapped;
  }, []);

  const lockCycle = useCallback(async (id) => {
    await cycleService.lock(id);
    setCycles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, locked: true } : c))
    );
  }, []);

  const deleteCycle = useCallback(async (id) => {
    await cycleService.remove(id);
    setCycles((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ─── Objective mutations ──────────────────────────────────────
  const createObjective = useCallback(async (form) => {
    const created = await objectiveService.create(toObjectivePayload(form));
    const mapped = mapObjective(created);
    setObjectives((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const updateObjective = useCallback(async (id, form) => {
    const updated = await objectiveService.update(id, toObjectivePayload(form));
    const mapped = mapObjective(updated);
    setObjectives((prev) => prev.map((o) => (o.id === id ? mapped : o)));
    return mapped;
  }, []);

  const updateObjectiveStatus = useCallback(async (id, status) => {
    const updated = await objectiveService.updateStatus(id, status);
    const mapped = mapObjective(updated);
    setObjectives((prev) => prev.map((o) => (o.id === id ? mapped : o)));
    return mapped;
  }, []);

  const updateObjectiveProgress = useCallback(
    async (id, progressPct, confidenceScore) => {
      const updated = await objectiveService.updateProgress(id, {
        progressPct,
        confidenceScore,
      });
      const mapped = mapObjective(updated);
      setObjectives((prev) => prev.map((o) => (o.id === id ? mapped : o)));
      return mapped;
    },
    []
  );

  const deleteObjective = useCallback(async (id) => {
    await objectiveService.softDelete(id);
    setObjectives((prev) => prev.filter((o) => o.id !== id));
  }, []);

  // ─── Key Result mutations ─────────────────────────────────────
  const createKeyResult = useCallback(async (form) => {
    const created = await keyResultService.create(toKeyResultPayload(form));
    const mapped = mapKeyResult(created);
    setKeyResults((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const updateKeyResult = useCallback(async (id, form) => {
    const updated = await keyResultService.update(id, toKeyResultPayload(form));
    const mapped = mapKeyResult(updated);
    setKeyResults((prev) => prev.map((k) => (k.id === id ? mapped : k)));
    return mapped;
  }, []);

  /**
   * Update KR progress. Backend rolls progress up to the parent
   * objective automatically — we refresh the objective here so the
   * UI stays in sync.
   */
  const updateKeyResultProgress = useCallback(
    async (id, form) => {
      const updated = await keyResultService.updateProgress(
        id,
        toProgressPayload(form)
      );
      const mapped = mapKeyResult(updated);
      setKeyResults((prev) => prev.map((k) => (k.id === id ? mapped : k)));

      // Re-fetch parent objective for rolled-up progress
      if (mapped.objId) {
        try {
          const obj = await objectiveService.getById(mapped.objId);
          const mappedObj = mapObjective(obj);
          setObjectives((prev) =>
            prev.map((o) => (o.id === mapped.objId ? mappedObj : o))
          );
        } catch (e) {
          console.warn("Could not refresh parent objective", e);
        }
      }
      return mapped;
    },
    []
  );

  const deleteKeyResult = useCallback(async (id) => {
    await keyResultService.remove(id);
    setKeyResults((prev) => prev.filter((k) => k.id !== id));
  }, []);

  // ─── Initiative mutations ─────────────────────────────────────
  const createInitiative = useCallback(async (form) => {
    const created = await initiativeService.create(toInitiativePayload(form));
    const mapped = mapInitiative(created);
    setInitiatives((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const updateInitiative = useCallback(async (id, form) => {
    const updated = await initiativeService.update(id, toInitiativePayload(form));
    const mapped = mapInitiative(updated);
    setInitiatives((prev) => prev.map((i) => (i.id === id ? mapped : i)));
    return mapped;
  }, []);

  const deleteInitiative = useCallback(async (id) => {
    await initiativeService.remove(id);
    setInitiatives((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // ─── Check-in mutations ───────────────────────────────────────
  const createCheckIn = useCallback(async (form) => {
    const created = await checkInService.create(toCheckInPayload(form));
    const mapped = mapCheckIn(created);
    setCheckIns((prev) => [mapped, ...prev]);
    return mapped;
  }, []);

  const updateCheckIn = useCallback(async (id, form) => {
    const updated = await checkInService.update(id, toCheckInPayload(form));
    const mapped = mapCheckIn(updated);
    setCheckIns((prev) => prev.map((c) => (c.id === id ? mapped : c)));
    return mapped;
  }, []);

  const deleteCheckIn = useCallback(async (id) => {
    await checkInService.remove(id);
    setCheckIns((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ─── Team mutations ───────────────────────────────────────────
  const createTeam = useCallback(async (form) => {
    const created = await teamService.create(toTeamPayload(form));
    const mapped = mapTeam(created);
    setTeams((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const value = useMemo(
    () => ({
      // state
      cycles,
      objectives,
      keyResults,
      initiatives,
      checkIns,
      teams,
      loading,
      error,
      usingFallback,

      // re-fetch
      refresh: loadAll,

      // mutations
      createCycle,
      updateCycle,
      lockCycle,
      deleteCycle,

      createObjective,
      updateObjective,
      updateObjectiveStatus,
      updateObjectiveProgress,
      deleteObjective,

      createKeyResult,
      updateKeyResult,
      updateKeyResultProgress,
      deleteKeyResult,

      createInitiative,
      updateInitiative,
      deleteInitiative,

      createCheckIn,
      updateCheckIn,
      deleteCheckIn,

      createTeam,
    }),
    [
      cycles,
      objectives,
      keyResults,
      initiatives,
      checkIns,
      teams,
      loading,
      error,
      usingFallback,
      loadAll,
      createCycle,
      updateCycle,
      lockCycle,
      deleteCycle,
      createObjective,
      updateObjective,
      updateObjectiveStatus,
      updateObjectiveProgress,
      deleteObjective,
      createKeyResult,
      updateKeyResult,
      updateKeyResultProgress,
      deleteKeyResult,
      createInitiative,
      updateInitiative,
      deleteInitiative,
      createCheckIn,
      updateCheckIn,
      deleteCheckIn,
      createTeam,
    ]
  );

  return <OkrContext.Provider value={value}>{children}</OkrContext.Provider>;
}

export function useOkr() {
  const ctx = useContext(OkrContext);
  if (!ctx) throw new Error("useOkr must be used inside <OkrProvider>");
  return ctx;
}
