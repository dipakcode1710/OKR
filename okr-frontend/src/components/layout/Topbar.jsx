import { T } from "../../utils/theme";
import Avatar from "../common/Avatar";

export default function Topbar({ title, children }) {
  return (
    <div
      style={{
        background: T.topbar,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 28px",
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: T.text }}>
          Vivekanand Technologies
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            borderLeft: `1px solid ${T.border}`,
            paddingLeft: 14,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {children}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingLeft: 12,
            borderLeft: `1px solid ${T.border}`,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Atul Jadhav</div>
            <div
              style={{
                fontSize: 10,
                color: T.textMuted,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Lead Developer
            </div>
          </div>
          <Avatar initials="AJ" size={36} />
        </div>
      </div>
    </div>
  );
}
