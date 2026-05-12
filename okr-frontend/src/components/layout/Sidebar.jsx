import { T } from "../../utils/theme";

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    id: "objectives",
    label: "Objectives",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "keyresults",
    label: "Key Results",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    id: "initiatives",
    label: "Initiatives",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    id: "checkins",
    label: "Check-ins",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    id: "cycles",
    label: "Cycles",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

export default function Sidebar({ active, onNav, user, onLogout }) {
  return (
    <aside
      style={{
        width: 245,
        background: T.sidebar,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#ffffff", letterSpacing: 0.5 }}>
          OKR Manager
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>
          Vivekanand Technologies
        </div>
      </div>

      {/* Cycle pill */}
      <div style={{ padding: "12px 16px 4px" }}>
        <div
          style={{
            background: "rgba(61,90,153,.35)",
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 11,
            color: "#94b4f0",
            fontWeight: 600,
          }}
        >
          📅 Q1 FY 2026–27
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map((item) => {
          const isActive =
            active === item.id || (active === "detail" && item.id === "objectives");
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#ffffff" : T.sidebarText,
                background: isActive ? T.sidebarActive : "transparent",
                textAlign: "left",
                transition: "all .15s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = T.sidebarHover;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
        {user && (
          <div style={{ marginBottom: 10, padding: "8px 12px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4 }}>
              {user.role}
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: 8,
            background: "rgba(224,49,49,.15)",
            color: "#ff8787",
            border: "1px solid rgba(224,49,49,.25)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
