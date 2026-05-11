import { T, s } from "../utils/theme";
import { useOkr } from "../context/OkrContext";
import Topbar from "../components/layout/Topbar";
import { Btn, Badge, HealthDot } from "../components/common";

export default function CheckInsScreen({ onNew }) {
  const { checkIns, objectives } = useOkr();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Check-ins">
        <Btn variant="primary" onClick={onNew}>
          + New Check-in
        </Btn>
      </Topbar>
      <div style={{ padding: "28px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: T.text }}>
          Check-in History
        </div>
        <div style={{ ...s.card(), padding: "4px 0" }}>
          {checkIns.length === 0 && (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                color: T.textLight,
                fontSize: 13,
              }}
            >
              No check-ins yet.
            </div>
          )}
          {checkIns.map((c, idx) => {
            const obj = objectives.find((o) => o.id === c.objId);
            return (
              <div
                key={c.id}
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    idx < checkIns.length - 1 ? `1px solid ${T.border}` : "none",
                }}
              >
                <div style={{ ...s.flex("center", "flex-start", 8), marginBottom: 6 }}>
                  <HealthDot status={c.health} />
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: T.text }}>
                    {c.summary}
                  </span>
                  <span style={{ fontSize: 11, color: T.textLight, whiteSpace: "nowrap" }}>
                    {c.date} · Wk {c.week}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: T.textMuted,
                    marginBottom: 6,
                    paddingLeft: 17,
                  }}
                >
                  {obj?.title?.slice(0, 60)}
                  {obj?.title?.length > 60 ? "…" : ""}
                </div>
                <div style={{ ...s.flex("center", "flex-start", 6), paddingLeft: 17 }}>
                  <span
                    style={{
                      fontSize: 11,
                      background: T.navyLight,
                      color: T.navy,
                      borderRadius: 10,
                      padding: "2px 10px",
                      fontWeight: 600,
                    }}
                  >
                    {c.progress}%
                  </span>
                  <Badge type={c.health}>{c.health}</Badge>
                  <Badge type="default">{c.type.replace("_", " ")}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
