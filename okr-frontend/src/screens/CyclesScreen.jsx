import { T, s } from "../utils/theme";
import { useOkr } from "../context/OkrContext";
import Topbar from "../components/layout/Topbar";
import { Btn, Badge } from "../components/common";

export default function CyclesScreen({ onNew }) {
  const { cycles, objectives, lockCycle } = useOkr();

  const handleLock = async (id) => {
    try {
      await lockCycle(id);
    } catch (e) {
      console.error("Lock cycle failed", e);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Cycles">
        <Btn variant="primary" onClick={onNew}>
          + New Cycle
        </Btn>
      </Topbar>
      <div style={{ padding: "28px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: T.text }}>
          OKR Cycles
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cycles.map((c) => (
            <div key={c.id} style={{ ...s.card(), padding: "20px 24px" }}>
              <div style={{ ...s.flex("flex-start", "space-between", 12), marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>
                    {c.code} · {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                  </div>
                </div>
                <Badge type={c.active ? "active" : "draft"}>
                  {c.active ? "Active" : "Draft"}
                </Badge>
              </div>
              <div
                style={{
                  ...s.flex("center", "space-between"),
                  fontSize: 12,
                  color: T.textMuted,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <span>
                    📅 {c.start} → {c.end}
                  </span>
                  <span>
                    {objectives.filter((o) => o.cycleId === c.id).length} objectives
                  </span>
                  <span style={{ color: c.locked ? T.danger : T.green }}>
                    {c.locked ? "🔒 Locked" : "🔓 Unlocked"}
                  </span>
                </div>
                {!c.locked && (
                  <Btn
                    onClick={() => handleLock(c.id)}
                    style={{ padding: "4px 12px", fontSize: 11 }}
                  >
                    Lock cycle
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
