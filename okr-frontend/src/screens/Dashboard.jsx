import { T, s } from "../utils/theme";
import { useOkr } from "../context/OkrContext";
import Topbar from "../components/layout/Topbar";
import { Btn, Badge, Avatar, ProgressBar } from "../components/common";

export default function Dashboard({ onNav, onNewObj }) {
  const { objectives, keyResults, loading, usingFallback } = useOkr();
  const active = objectives.filter((o) => o.status === "active");
  const avgPct = objectives.length
    ? Math.round(objectives.reduce((s, o) => s + (o.progress || 0), 0) / objectives.length)
    : 0;
  const atRisk = objectives.filter((o) => (o.progress || 0) < 10).length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Dashboard">
        <Btn variant="primary" onClick={onNewObj}>
          + New Objective
        </Btn>
      </Topbar>
      <div style={{ padding: "28px 28px", flex: 1 }}>
        <div style={{ ...s.flex("center", "space-between"), marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Dashboard Overview</div>
          {usingFallback && (
            <span
              style={{
                fontSize: 11,
                color: T.amber,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                padding: "4px 10px",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              ⚠ Offline — showing demo data
            </span>
          )}
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            { label: "TOTAL OBJECTIVES", value: objectives.length, sub: `${active.length} active`, accent: T.navy },
            { label: "KEY RESULTS", value: keyResults.length, sub: "Across all objectives", accent: T.green },
            { label: "AVG PROGRESS", value: `${avgPct}%`, sub: "Week 19 of Q1", accent: T.amber },
            { label: "AT RISK", value: atRisk, sub: "Needs attention", accent: T.danger },
          ].map((c, i) => (
            <div key={i} style={{ ...s.card(c.accent), padding: "18px 20px" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.textMuted,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {c.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.accent, lineHeight: 1 }}>
                {c.value}
              </div>
              <div style={{ fontSize: 11, color: T.textLight, marginTop: 6 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Active objectives */}
        <div style={{ ...s.flex("center", "space-between"), marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Active Objectives</span>
          <Btn onClick={() => onNav("objectives")}>View all →</Btn>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading && objectives.length === 0 ? (
            <div
              style={{
                ...s.card(),
                textAlign: "center",
                color: T.textMuted,
                fontSize: 13,
              }}
            >
              Loading objectives…
            </div>
          ) : (
            objectives.map((obj) => (
              <div
                key={obj.id}
                onClick={() => onNav("detail", obj.id)}
                style={{ ...s.card(), cursor: "pointer", transition: "box-shadow .15s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 16px rgba(61,90,153,.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.07)")
                }
              >
                <div style={{ ...s.flex("flex-start", "space-between", 12), marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.text,
                        lineHeight: 1.4,
                        marginBottom: 6,
                      }}
                    >
                      {obj.title}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Badge type="active">Active</Badge>
                      <Badge type={obj.scope}>
                        {obj.scope.charAt(0).toUpperCase() + obj.scope.slice(1)}
                      </Badge>
                      <Badge type={obj.type}>
                        {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color:
                          obj.progress >= 50
                            ? T.green
                            : obj.progress > 0
                            ? T.amber
                            : T.textMuted,
                      }}
                    >
                      {obj.progress}%
                    </div>
                    <div style={{ fontSize: 11, color: T.textLight }}>
                      Confidence {obj.confidence}/10
                    </div>
                  </div>
                </div>
                <div style={{ ...s.flex("center", "flex-start", 10) }}>
                  <ProgressBar pct={obj.progress} />
                  <span style={{ fontSize: 11, color: T.textMuted, whiteSpace: "nowrap" }}>
                    Due {obj.due}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: T.textMuted,
                      whiteSpace: "nowrap",
                      borderLeft: `1px solid ${T.border}`,
                      paddingLeft: 10,
                    }}
                  >
                    {keyResults.filter((k) => k.objId === obj.id).length} KRs
                  </span>
                </div>
                <div style={{ ...s.flex("center", "flex-start", 6), marginTop: 10 }}>
                  <Avatar initials={obj.ownerInitials} size={22} bg={T.navyDark} />
                  <span style={{ fontSize: 12, color: T.textMuted }}>{obj.owner}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
