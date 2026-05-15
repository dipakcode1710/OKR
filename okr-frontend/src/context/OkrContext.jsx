import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  cycleService,
  objectiveService,
  keyResultService,
  initiativeService,
  checkInService,
  teamService,
  employeeService,
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
  initials,
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

  // Ref-based employee name map so mutations (create/update) can resolve names
  // without needing employees in their dependency arrays.
  const employeeMapRef = useRef({});

  // Resolves any entity's owner name from the employee map using the given ID.
  const resolveOwner = (mapped, employeeId) => {
    const name = employeeMapRef.current[employeeId];
    if (!name) return mapped;
    return { ...mapped, owner: name, ownerInitials: initials(name) };
  };

  // ─── Initial load ─────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cyclesData, objectivesData, teamsData, employeesData] = await Promise.all([
        cycleService.getAll(),
        objectiveService.getAll(),
        teamService.getAll(),
        employeeService.getAll().catch(() => []),
      ]);

      // Build employee ID → name lookup used by withOwner()
      employeeMapRef.current = Object.fromEntries(
        (employeesData || []).map((e) => [e.id, e.name])
      );

      const mappedCycles = (cyclesData || []).map(mapCycle);
      const mappedObjectives = (objectivesData || []).map((o) =>
        resolveOwner(mapObjective(o), o.ownerEmployeeId)
      );
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

      const allKrs = krLists.flat().map((k) =>
        resolveOwner(mapKeyResult(k), k.createdBy)
      );
      const allCheckIns = checkInLists.flat().map(mapCheckIn);
      setKeyResults(allKrs);
      setCheckIns(allCheckIns);

      // For each KR, fetch initiatives
      const initLists = await Promise.all(
        allKrs.map((k) =>
          initiativeService.getByKeyResult(k.id).catch(() => [])
        )
      );
      setInitiatives(
        initLists.flat().map((i) => resolveOwner(mapInitiative(i), i.ownerEmployeeId))
      );

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
    const mapped = resolveOwner(mapObjective(created), created.ownerEmployeeId);
    setObjectives((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const updateObjective = useCallback(async (id, form) => {
    const updated = await objectiveService.update(id, toObjectivePayload(form));
    const mapped = resolveOwner(mapObjective(updated), updated.ownerEmployeeId);
    setObjectives((prev) => prev.map((o) => (o.id === id ? mapped : o)));
    return mapped;
  }, []);

  const updateObjectiveStatus = useCallback(async (id, status) => {
    const updated = await objectiveService.updateStatus(id, status);
    const mapped = resolveOwner(mapObjective(updated), updated.ownerEmployeeId);
    setObjectives((prev) => prev.map((o) => (o.id === id ? mapped : o)));
    return mapped;
  }, []);

  const updateObjectiveProgress = useCallback(
    async (id, progressPct, confidenceScore) => {
      const updated = await objectiveService.updateProgress(id, {
        progressPct,
        confidenceScore,
      });
      const mapped = resolveOwner(mapObjective(updated), updated.ownerEmployeeId);
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
    const mapped = resolveOwner(mapKeyResult(created), created.createdBy);
    setKeyResults((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const updateKeyResult = useCallback(async (id, form) => {
    const updated = await keyResultService.update(id, toKeyResultPayload(form));
    const mapped = resolveOwner(mapKeyResult(updated), updated.createdBy);
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
      const mapped = resolveOwner(mapKeyResult(updated), updated.createdBy);
      setKeyResults((prev) => prev.map((k) => (k.id === id ? mapped : k)));

      // Re-fetch parent objective for rolled-up progress
      if (mapped.objId) {
        try {
          const obj = await objectiveService.getById(mapped.objId);
          const mappedObj = resolveOwner(mapObjective(obj), obj.ownerEmployeeId);
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
    const mapped = resolveOwner(mapInitiative(created), created.ownerEmployeeId);
    setInitiatives((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const updateInitiative = useCallback(async (id, form) => {
    const updated = await initiativeService.update(id, toInitiativePayload(form));
    const mapped = resolveOwner(mapInitiative(updated), updated.ownerEmployeeId);
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
