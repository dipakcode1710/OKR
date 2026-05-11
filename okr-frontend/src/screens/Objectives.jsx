import { useState } from "react";
import { T, s } from "../utils/theme";
import { useOkr } from "../context/OkrContext";
import Topbar from "../components/layout/Topbar";
import { Btn, Badge, Avatar, ProgressBar } from "../components/common";

export default function Objectives({ onNav, onNew }) {
  const { objectives, keyResults, initiatives } = useOkr();
  const [scope, setScope] = useState("all");
  const filtered =
    scope === "all" ? objectives : objectives.filter((o) => o.scope === scope);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar title="Objectives">
        <select
          style={{ ...s.input, width: "auto", padding: "7px 12px", fontSize: 12 }}
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="all">All scopes</option>
          <option value="personal">Personal</option>
          <option value="team">Team</option>
          <option value="company">Company</option>
        </select>
        <Btn variant="primary" onClick={onNew}>
          + New Objective
        </Btn>
      </Topbar>
      <div style={{ padding: "28px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: T.text }}>
          Objectives
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((obj) => {
            const krsForObj = keyResults.filter((k) => k.objId === obj.id);
            const krIds = krsForObj.map((k) => k.id);
            const initsCount = initiatives.filter((i) => krIds.includes(i.krId)).length;
            return (
              <div
                key={obj.id}
                onClick={() => onNav("detail", obj.id)}
                style={{ ...s.card(), cursor: "pointer" }}
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
                        marginBottom: 4,
                      }}
                    >
                      {obj.title}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 8 }}>
                      {obj.desc}
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
                        fontSize: 26,
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
                </div>
                <div style={{ ...s.flex("center", "space-between"), marginTop: 10 }}>
                  <div style={{ ...s.flex("center", "flex-start", 6) }}>
                    <Avatar initials={obj.ownerInitials} size={22} bg={T.navyDark} />
                    <span style={{ fontSize: 12, color: T.textMuted }}>{obj.owner}</span>
                  </div>
                  <span style={{ fontSize: 11, color: T.textMuted }}>
                    {krsForObj.length} key results · {initsCount} initiatives
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
