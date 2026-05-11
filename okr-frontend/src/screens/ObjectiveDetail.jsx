import { useState } from "react";
import { T, s } from "../utils/theme";
import { useOkr } from "../context/OkrContext";
import Topbar from "../components/layout/Topbar";
import { Btn, Badge, HealthDot, ProgressBar } from "../components/common";

export default function ObjectiveDetail({
  objId,
  onBack,
  onNewKr,
  onNewCheckin,
  onNewInitiative,
  onUpdateProgress,
}) {
  const { objectives, keyResults, initiatives, checkIns } = useOkr();
  const [tab, setTab] = useState("kr");

  const obj = objectives.find((o) => o.id === objId);
  if (!obj) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title="Objective Detail" />
        <div style={{ padding: 28, color: T.textMuted }}>Objective not found.</div>
      </div>
    );
  }

  const krs = keyResults.filter((k) => k.objId === objId);
  const krIds = krs.map((k) => k.id);
  const inits = initiatives.filter((i) => krIds.includes(i.krId));
  const cins = checkIns.filter((c) => c.objId === objId);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Objective Detail">
        <Btn onClick={onNewCheckin}>+ Check-in</Btn>
        <Btn variant="primary" onClick={onNewKr}>
          + Key Result
        </Btn>
      </Topbar>
      <div style={{ padding: "28px" }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: T.textMuted,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 0,
          }}
        >
          ← Back to Objectives
        </button>

        {/* Hero card */}
        <div style={{ ...s.card(), marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <Badge type="active">Active</Badge>
            <Badge type={obj.scope}>{obj.scope.charAt(0).toUpperCase() + obj.scope.slice(1)}</Badge>
            <Badge type={obj.type}>{obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}</Badge>
            <Badge type="committed">Weekly check-in</Badge>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.text, lineHeight: 1.4, marginBottom: 8 }}>
            {obj.title}
          </div>
          <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, marginBottom: 18 }}>
            {obj.desc}
          </div>

          <div style={{ ...s.flex("center", "space-between"), marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>Overall progress</span>
            <div style={{ ...s.flex("center", "flex-start", 10) }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Confidence</span>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 6,
                      borderRadius: 3,
                      background: i < obj.confidence ? T.navy : T.border,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 12, color: T.textMuted }}>{obj.confidence}/10</span>
            </div>
          </div>
          <div style={{ ...s.flex("center", "flex-start", 14) }}>
            <ProgressBar pct={obj.progress} height={10} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color:
                  obj.progress >= 50 ? T.green : obj.progress > 0 ? T.amber : T.textMuted,
                whiteSpace: "nowrap",
              }}
            >
              {obj.progress}%
            </span>
          </div>
          <div style={{ fontSize: 12, color: T.textLight, marginTop: 6 }}>
            Due {obj.due} · {obj.owner}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `2px solid ${T.border}`, marginBottom: 20, gap: 0 }}>
          {[["kr", "Key Results"], ["initiatives", "Initiatives"], ["checkins", "Check-ins"]].map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: tab === id ? 700 : 400,
                  color: tab === id ? T.navy : T.textMuted,
                  borderBottom: tab === id ? `2px solid ${T.navy}` : "2px solid transparent",
                  marginBottom: -2,
                  transition: "all .15s",
                }}
              >
                {label}{" "}
                <span
                  style={{
                    fontSize: 11,
                    background: T.navyLight,
                    color: T.navy,
                    borderRadius: 10,
                    padding: "1px 7px",
                    marginLeft: 4,
                    fontWeight: 600,
                  }}
                >
                  {id === "kr" ? krs.length : id === "initiatives" ? inits.length : cins.length}
                </span>
              </button>
            )
          )}
        </div>

        {/* KR tab */}
        {tab === "kr" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {krs.map((kr) => (
              <div
                key={kr.id}
                style={{
                  ...s.card(kr.progress >= 50 ? T.green : kr.progress > 0 ? T.amber : T.border),
                  padding: "16px 20px",
                }}
              >
                <div style={{ ...s.flex("flex-start", "space-between", 12), marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: T.text,
                        lineHeight: 1.4,
                        marginBottom: 4,
                      }}
                    >
                      {kr.title}
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>
                      {kr.metric} · Weight: {kr.weight}%
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color:
                          kr.progress >= 50 ? T.green : kr.progress > 0 ? T.amber : T.textMuted,
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
                <div style={{ ...s.flex("center", "flex-start", 10), marginBottom: 8 }}>
                  <ProgressBar pct={kr.progress} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, minWidth: 36 }}>
                    {kr.progress}%
                  </span>
                  <Btn onClick={() => onUpdateProgress(kr)} style={{ padding: "4px 12px", fontSize: 11 }}>
                    Update
                  </Btn>
                </div>
                <div style={{ fontSize: 11, color: T.textLight }}>
                  Baseline {kr.baseline}
                  {kr.unit === "%" ? "%" : " " + kr.unit} → Target {kr.target}
                  {kr.unit === "%" ? "%" : " " + kr.unit} · {kr.trend}
                </div>
              </div>
            ))}
            <Btn onClick={onNewKr} style={{ alignSelf: "flex-start" }}>
              + Add Key Result
            </Btn>
          </div>
        )}

        {/* Initiatives tab */}
        {tab === "initiatives" && (
          <div>
            <div style={{ ...s.flex("center", "flex-end"), marginBottom: 14 }}>
              <Btn onClick={onNewInitiative}>+ Add Initiative</Btn>
            </div>
            <div style={{ ...s.card(), padding: "4px 0" }}>
              {inits.length === 0 && (
                <div
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: T.textLight,
                    fontSize: 13,
                  }}
                >
                  No initiatives yet. Add one to get started.
                </div>
              )}
              {inits.map((ini, idx) => (
                <div
                  key={ini.id}
                  style={{
                    padding: "14px 20px",
                    borderBottom: idx < inits.length - 1 ? `1px solid ${T.border}` : "none",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `2px solid ${T.border}`,
                      flexShrink: 0,
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: ini.completion === 100 ? T.green : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {ini.completion === 100 && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>
                      {ini.title}
                    </div>
                    <div style={{ ...s.flex("center", "flex-start", 12), fontSize: 11, color: T.textMuted }}>
                      <Badge type={ini.priority}>
                        {ini.priority.charAt(0).toUpperCase() + ini.priority.slice(1)}
                      </Badge>
                      <span>{ini.owner}</span>
                      <span>Due {ini.due}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div
                          style={{
                            width: 48,
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
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 11,
                          color: T.danger,
                          background: "#fee2e2",
                          padding: "4px 8px",
                          borderRadius: 5,
                          display: "inline-block",
                        }}
                      >
                        ⚠ {ini.blocker}
                      </div>
                    )}
                  </div>
                  <Badge type={ini.status}>
                    {ini.status.charAt(0).toUpperCase() + ini.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Check-ins tab */}
        {tab === "checkins" && (
          <div>
            <div style={{ ...s.flex("center", "flex-end"), marginBottom: 14 }}>
              <Btn variant="primary" onClick={onNewCheckin}>
                + New Check-in
              </Btn>
            </div>
            <div style={{ ...s.card(), padding: "4px 0" }}>
              {cins.map((c, idx) => (
                <div
                  key={c.id}
                  style={{
                    padding: "16px 20px",
                    borderBottom: idx < cins.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <div style={{ ...s.flex("center", "flex-start", 8), marginBottom: 6 }}>
                    <HealthDot status={c.health} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text, flex: 1 }}>
                      {c.summary}
                    </span>
                    <span style={{ fontSize: 11, color: T.textLight }}>
                      {c.date} · Wk {c.week}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.textMuted,
                      lineHeight: 1.5,
                      marginBottom: 8,
                      paddingLeft: 17,
                    }}
                  >
                    {c.details}
                  </div>
                  <div style={{ ...s.flex("center", "flex-start", 6), paddingLeft: 17, flexWrap: "wrap" }}>
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
                      Progress {c.progress}%
                    </span>
                    <Badge type={c.health}>
                      {c.health.charAt(0).toUpperCase() + c.health.slice(1)}
                    </Badge>
                    <Badge type="default">{c.type.replace("_", " ")}</Badge>
                  </div>
                  {(c.wins || c.blockers) && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginTop: 10,
                        paddingLeft: 17,
                      }}
                    >
                      {c.wins && (
                        <div
                          style={{
                            fontSize: 11,
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: 6,
                            padding: "6px 10px",
                          }}
                        >
                          <span style={{ color: T.green, fontWeight: 700 }}>✓ Wins: </span>
                          <span style={{ color: T.textMuted }}>{c.wins}</span>
                        </div>
                      )}
                      {c.blockers && (
                        <div
                          style={{
                            fontSize: 11,
                            background: "#fff7ed",
                            border: "1px solid #fed7aa",
                            borderRadius: 6,
                            padding: "6px 10px",
                          }}
                        >
                          <span style={{ color: T.amber, fontWeight: 700 }}>⚠ Blockers: </span>
                          <span style={{ color: T.textMuted }}>{c.blockers}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
