import { useState } from "react";
import { T } from "./utils/theme";
import Sidebar from "./components/layout/Sidebar";
import { useOkr } from "./context/OkrContext";
import {
  Dashboard,
  Objectives,
  ObjectiveDetail,
  KeyResults,
  InitiativesScreen,
  CheckInsScreen,
  CyclesScreen,
  LoginScreen,
} from "./screens";
import {
  NewObjectiveModal,
  NewKrModal,
  ProgressModal,
  CheckInModal,
  InitiativeModal,
  CycleModal,
} from "./components/modals";

function getStoredUser() {
  try {
    // Moved to sessionStorage since localStorage persists even after logout which can cause issues if multiple users use the same browser. Session storage is cleared when the tab is closed, providing better security for user data.
    return JSON.parse(sessionStorage.getItem("okr_user"));
  } catch {
    return null;
  }
}

export default function App() {
  // Global state and handlers for modals, navigation, and authentication. This keeps the main App component organized and focused on rendering the appropriate screens and modals based on the current state.
  const { refresh } = useOkr();
  const [user, setUser] = useState(getStoredUser);
  const [screen, setScreen] = useState("dashboard");
  const [detailId, setDetailId] = useState(null);
  const [modals, setModals] = useState({
    obj: false,
    kr: false,
    checkin: false,
    progress: false,
    initiative: false,
    cycle: false,
  });
  const [activeKr, setActiveKr] = useState(null);
  const [editObj, setEditObj] = useState(null);
  const [editInit, setEditInit] = useState(null);
  const [editKr, setEditKr] = useState(null);
  const [editCycle, setEditCycle] = useState(null);

  const open = (key) => setModals((m) => ({ ...m, [key]: true }));
  const close = (key) => setModals((m) => ({ ...m, [key]: false }));

  const openEditObj = (obj) => { setEditObj(obj); open("obj"); };
  const closeObj = () => { close("obj"); setEditObj(null); };

  const openEditInit = (ini) => { setEditInit(ini); open("initiative"); };
  const closeInit = () => { close("initiative"); setEditInit(null); };

  const openEditKr = (kr) => { setEditKr(kr); open("kr"); };
  const closeKr = () => { close("kr"); setEditKr(null); };

  const openEditCycle = (c) => { setEditCycle(c); open("cycle"); };
  const closeCycle = () => { close("cycle"); setEditCycle(null); };

  const nav = (next, id = null) => {
    setScreen(next);
    if (id) setDetailId(id);
  };

  const openProgress = (kr) => {
    setActiveKr(kr);
    open("progress");
  };

  function handleLogin(userData) {
    setUser(userData);
    setScreen("dashboard");
    // Refresh data after login to ensure we have the latest information for the authenticated user. This is important in case there were any changes while the user was logged out.
    refresh();
  }

  function handleLogout() {
    // Clear session storage on logout to remove any sensitive information and ensure a clean state for the next login. This also prevents issues with stale data if multiple users use the same browser.
    sessionStorage.removeItem("okr_auth_token");
    sessionStorage.removeItem("okr_user");
    setUser(null);
    setScreen("dashboard");
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <Sidebar active={screen} onNav={nav} user={user} onLogout={handleLogout} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {screen === "dashboard" && (
          <Dashboard onNav={nav} onNewObj={() => { setEditObj(null); open("obj"); }} />
        )}
        {screen === "objectives" && (
          <Objectives onNav={nav} onNew={() => { setEditObj(null); open("obj"); }} onEdit={openEditObj} />
        )}
        {screen === "detail" && (
          <ObjectiveDetail
            objId={detailId}
            onBack={() => nav("objectives")}
            onNewKr={() => { setEditKr(null); open("kr"); }}
            onNewCheckin={() => open("checkin")}
            onNewInitiative={() => { setEditInit(null); open("initiative"); }}
            onUpdateProgress={openProgress}
            onEditObj={openEditObj}
            onEditInitiative={openEditInit}
            onEditKr={openEditKr}
          />
        )}
        {screen === "keyresults" && <KeyResults onUpdateProgress={openProgress} onEdit={openEditKr} />}
        {screen === "initiatives" && (
          <InitiativesScreen onNew={() => { setEditInit(null); open("initiative"); }} onEdit={openEditInit} />
        )}
        {screen === "checkins" && <CheckInsScreen onNew={() => open("checkin")} />}
        {screen === "cycles" && <CyclesScreen onNew={() => { setEditCycle(null); open("cycle"); }} onEdit={openEditCycle} />}
      </div>

      <NewObjectiveModal open={modals.obj} onClose={closeObj} objective={editObj} />
      <NewKrModal
        open={modals.kr}
        onClose={closeKr}
        defaultObjectiveId={screen === "detail" && !editKr ? detailId : null}
        keyResult={editKr}
      />
      <ProgressModal
        open={modals.progress}
        onClose={() => close("progress")}
        kr={activeKr}
      />
      <CheckInModal
        open={modals.checkin}
        onClose={() => close("checkin")}
        defaultObjectiveId={screen === "detail" ? detailId : null}
      />
      <InitiativeModal
        open={modals.initiative}
        onClose={closeInit}
        initiative={editInit}
      />
      <CycleModal open={modals.cycle} onClose={closeCycle} cycle={editCycle} />
    </div>
  );
}
