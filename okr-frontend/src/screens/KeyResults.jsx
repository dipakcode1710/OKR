import { T, s } from "../utils/theme";
import { useOkr } from "../context/OkrContext";
import Topbar from "../components/layout/Topbar";
import { Btn, ProgressBar } from "../components/common";

export default function KeyResults({ onUpdateProgress, onEdit }) {
  const { objectives, keyResults, deleteKeyResult } = useOkr();

  const handleDelete = async (kr) => {
    if (!window.confirm(`Delete key result "${kr.title}"? This can be restored from the database.`)) return;
    try {
      await deleteKeyResult(kr.id);
    } catch (err) {
      console.error("Delete key result failed", err);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Key Results" />
      <div style={{ padding: "28px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: T.text }}>
          All Key Results
        </div>
        {objectives.map((obj) => {
          const krs = keyResults.filter((k) => k.objId === obj.id);
          if (krs.length === 0) return null;
          return (
            <div key={obj.id} style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.navy,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ width: 4, height: 18, background: T.navy, borderRadius: 2 }} />
                {obj.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {krs.map((kr) => (
                  <div
                    key={kr.id}
                    style={{
                      ...s.card(
                        kr.progress >= 50 ? T.green : kr.progress > 0 ? T.amber : T.border
                      ),
                      padding: "14px 18px",
                    }}
                  >
                    <div style={{ ...s.flex("flex-start", "space-between", 12), marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>
                          {kr.title}
                        </div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>
                          {kr.metric} · Weight {kr.weight}% · {kr.owner}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color:
                              kr.progress >= 50
                                ? T.green
                                : kr.progress > 0
                                ? T.amber
                                : T.textMuted,
                          }}
                        >
                          {kr.current}
                          {kr.unit === "%" ? "%" : ""}
                        </div>
                        <div style={{ fontSize: 11, color: T.textLight }}>
                          / {kr.target}
                          {kr.unit === "%" ? "%" : " " + kr.unit}
                        </div>
                      </div>
                    </div>
                    <div style={{ ...s.flex("center", "flex-start", 10) }}>
                      <ProgressBar pct={kr.progress} />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.textMuted,
                          minWidth: 36,
                        }}
                      >
                        {kr.progress}%
                      </span>
                      <Btn
                        onClick={() => onUpdateProgress(kr)}
                        style={{ padding: "4px 12px", fontSize: 11 }}
                      >
                        Update
                      </Btn>
                      {onEdit && (
                        <Btn
                          onClick={() => onEdit(kr)}
                          style={{ padding: "4px 12px", fontSize: 11 }}
                        >
                          Edit
                        </Btn>
                      )}
                      <Btn
                        onClick={() => handleDelete(kr)}
                        style={{ padding: "4px 12px", fontSize: 11, color: T.danger, borderColor: T.danger }}
                      >
                        Delete
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
