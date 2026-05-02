// src/components/Sidebar.tsx

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import type { NotificationType } from "../types";
import { TYPE_CONFIG } from "../utils";

const FILTERS: { key: NotificationType | "all"; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "🔔" },
  { key: "placement", label: "Placement", icon: "💼" },
  { key: "event", label: "Events", icon: "🎯" },
  { key: "result", label: "Results", icon: "📊" },
  { key: "announcement", label: "Notices", icon: "📢" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, activeFilter, setFilter, liveConnected } = useNotifications();

  function countForType(type: NotificationType | "all") {
    if (type === "all") return notifications.filter((n) => !n.is_read).length;
    return notifications.filter((n) => n.type === type && !n.is_read).length;
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logo}>CN</div>
        <div>
          <div style={styles.brandName}>CampusNotify</div>
          <div style={styles.brandSub}>v1.0</div>
        </div>
      </div>

      <div style={styles.liveStatus}>
        <span style={{ ...styles.liveDot, background: liveConnected ? "#6EE7B7" : "#6B7280" }} />
        <span style={styles.liveText}>
          {liveConnected ? "Live stream active" : "Connecting..."}
        </span>
      </div>

      <nav style={styles.nav}>
        <div style={styles.navLabel}>CHANNELS</div>
        {FILTERS.map((f) => {
          const count = countForType(f.key);
          const isActive = activeFilter === f.key;
          const color = f.key === "all" ? "#6EE7B7" : TYPE_CONFIG[f.key]?.color ?? "#6EE7B7";
          return (
            <button
              key={f.key}
              style={{
                ...styles.navItem,
                background: isActive ? `${color}18` : "transparent",
                color: isActive ? color : "rgba(249,250,251,0.5)",
                borderLeft: isActive ? `2px solid ${color}` : "2px solid transparent",
              }}
              onClick={() => setFilter(f.key)}
            >
              <span style={styles.navIcon}>{f.icon}</span>
              <span style={styles.navItemLabel}>{f.label}</span>
              {count > 0 && (
                <span style={{ ...styles.badge, background: isActive ? color : "rgba(255,255,255,0.1)", color: isActive ? "#0A0A0F" : color }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={styles.statsBox}>
        <div style={styles.statItem}>
          <span style={styles.statNum}>{notifications.length}</span>
          <span style={styles.statLabel}>Total</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={{ ...styles.statNum, color: "#6EE7B7" }}>{unreadCount}</span>
          <span style={styles.statLabel}>Unread</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>{notifications.length - unreadCount}</span>
          <span style={styles.statLabel}>Read</span>
        </div>
      </div>

      <div style={styles.userSection}>
        <div style={styles.userAvatar}>
          {user?.name?.[0] ?? "U"}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user?.name}</div>
          <div style={styles.userDept}>{user?.department} · Year {user?.year}</div>
        </div>
        <button style={styles.logoutBtn} onClick={logout} title="Logout">
          ↗
        </button>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 260,
    background: "#0D1117",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    flexShrink: 0,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 20px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    marginBottom: 8,
  },
  logo: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
    color: "#0A0A0F",
    flexShrink: 0,
  },
  brandName: { fontWeight: 700, fontSize: "0.95rem", color: "#F9FAFB", letterSpacing: "-0.3px" },
  brandSub: { fontSize: "0.7rem", color: "rgba(249,250,251,0.3)", marginTop: 1 },
  liveStatus: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    marginBottom: 8,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: "0 0 6px currentColor",
  },
  liveText: { fontSize: "0.75rem", color: "rgba(249,250,251,0.35)" },
  nav: { flex: 1, padding: "0 12px" },
  navLabel: {
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "rgba(249,250,251,0.25)",
    letterSpacing: "1.5px",
    padding: "4px 8px 10px",
  },
  navItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.88rem",
    fontWeight: 500,
    transition: "all 0.18s ease",
    marginBottom: 2,
    textAlign: "left",
  },
  navIcon: { fontSize: "0.95rem", width: 20, textAlign: "center" },
  navItemLabel: { flex: 1 },
  badge: {
    padding: "2px 7px",
    borderRadius: 10,
    fontSize: "0.7rem",
    fontWeight: 700,
    minWidth: 20,
    textAlign: "center",
  },
  statsBox: {
    display: "flex",
    margin: "20px 16px",
    padding: "14px 0",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  statItem: { flex: 1, textAlign: "center" },
  statNum: { display: "block", fontSize: "1.25rem", fontWeight: 700, color: "#F9FAFB" },
  statLabel: { fontSize: "0.68rem", color: "rgba(249,250,251,0.3)", marginTop: 2 },
  statDivider: { width: 1, background: "rgba(255,255,255,0.06)" },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 16px 0",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    marginTop: "auto",
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "#0A0A0F",
    flexShrink: 0,
  },
  userInfo: { flex: 1, overflow: "hidden" },
  userName: { fontSize: "0.85rem", fontWeight: 600, color: "#F9FAFB", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userDept: { fontSize: "0.72rem", color: "rgba(249,250,251,0.35)", marginTop: 2 },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(249,250,251,0.4)",
    borderRadius: 6,
    width: 28,
    height: 28,
    cursor: "pointer",
    fontSize: "0.8rem",
    flexShrink: 0,
  },
};
