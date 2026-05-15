import { T, s } from "../utils/theme";
import { useOkr } from "../context/OkrContext";
import Topbar from "../components/layout/Topbar";
import { Btn, Badge } from "../components/common";

export default function InitiativesScreen({ onNew, onEdit }) {
  const { initiatives, keyResults, deleteInitiative } = useOkr();

  const handleDelete = async (ini) => {
    if (!window.confirm(`Delete initiative "${ini.title}"? This can be restored from the database.`)) return;
    try {
      await deleteInitiative(ini.id);
    } catch (err) {
      console.error("Delete initiative failed", err);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Initiatives">
        <Btn variant="primary" onClick={onNew}>
          + New Initiative
        </Btn>
      </Topbar>
      <div style={{ padding: "28px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: T.text }}>
          All Initiatives
        </div>
        <div style={{ ...s.card(), padding: "4px 0" }}>
          {initiatives.length === 0 && (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                color: T.textLight,
                fontSize: 13,
              }}
            >
              No initiatives yet. Click “+ New Initiative” to add one.
            </div>
          )}
          {initiatives.map((ini, idx) => {
            const kr = keyResults.find((k) => k.id === ini.krId);
            return (
              <div
                key={ini.id}
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    idx < initiatives.length - 1 ? `1px solid ${T.border}` : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    border: `2px solid ${T.border}`,
                    flexShrink: 0,
                    marginTop: 2,
                    background: ini.status === "completed" ? T.green : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>
                    {ini.title}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>
                    KR: {kr?.metric ?? "—"}
                  </div>
                  <div style={{ ...s.flex("center", "flex-start", 10) }}>
                    <Badge type={ini.priority}>{ini.priority}</Badge>
                    <span style={{ fontSize: 11, color: T.textMuted }}>
                      Owner: {ini.owner}
                    </span>
                    <span style={{ fontSize: 11, color: T.textMuted }}>Due {ini.due}</span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: T.textMuted,
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 4,
                          borderRadius: 2,
                          background: "#e9ecef",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${ini.completion}%`,
                            background: T.navy,
                          }}
                        />
                      </div>
                      {ini.completion}%
                    </span>
                  </div>
                  {ini.blocker && (
                    <div style={{ marginTop: 6, fontSize: 11, color: T.danger }}>
                      ⚠ Blocked: {ini.blocker}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <Badge type={ini.status}>{ini.status}</Badge>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(ini)}
                      style={{
                        fontSize: 11,
                        color: T.navy,
                        background: "none",
                        border: `1px solid ${T.border}`,
                        borderRadius: 5,
                        padding: "3px 10px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(ini)}
                    style={{
                      fontSize: 11,
                      color: T.danger,
                      background: "none",
                      border: `1px solid ${T.danger}`,
                      borderRadius: 5,
                      padding: "3px 10px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
