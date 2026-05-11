import { useState } from "react";
import { T } from "./utils/theme";
import Sidebar from "./components/layout/Sidebar";
import {
  Dashboard,
  Objectives,
  ObjectiveDetail,
  KeyResults,
  InitiativesScreen,
  CheckInsScreen,
  CyclesScreen,
} from "./screens";
import {
  NewObjectiveModal,
  NewKrModal,
  ProgressModal,
  CheckInModal,
  InitiativeModal,
  CycleModal,
} from "./components/modals";

export default function App() {
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

  const open = (key) => setModals((m) => ({ ...m, [key]: true }));
  const close = (key) => setModals((m) => ({ ...m, [key]: false }));

  const nav = (next, id = null) => {
    setScreen(next);
    if (id) setDetailId(id);
  };

  const openProgress = (kr) => {
    setActiveKr(kr);
    open("progress");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <Sidebar active={screen} onNav={nav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {screen === "dashboard" && (
          <Dashboard onNav={nav} onNewObj={() => open("obj")} />
        )}
        {screen === "objectives" && (
          <Objectives onNav={nav} onNew={() => open("obj")} />
        )}
        {screen === "detail" && (
          <ObjectiveDetail
            objId={detailId}
            onBack={() => nav("objectives")}
            onNewKr={() => open("kr")}
            onNewCheckin={() => open("checkin")}
            onNewInitiative={() => open("initiative")}
            onUpdateProgress={openProgress}
          />
        )}
        {screen === "keyresults" && <KeyResults onUpdateProgress={openProgress} />}
        {screen === "initiatives" && (
          <InitiativesScreen onNew={() => open("initiative")} />
        )}
        {screen === "checkins" && <CheckInsScreen onNew={() => open("checkin")} />}
        {screen === "cycles" && <CyclesScreen onNew={() => open("cycle")} />}
      </div>

      <NewObjectiveModal open={modals.obj} onClose={() => close("obj")} />
      <NewKrModal
        open={modals.kr}
        onClose={() => close("kr")}
        defaultObjectiveId={screen === "detail" ? detailId : null}
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
        onClose={() => close("initiative")}
      />
      <CycleModal open={modals.cycle} onClose={() => close("cycle")} />
    </div>
  );
}
