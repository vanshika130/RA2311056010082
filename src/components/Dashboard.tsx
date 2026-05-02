// src/components/Dashboard.tsx

import { useState } from "react";
import Sidebar from "./Sidebar";
import NotificationCard from "./NotificationCard";
import { useNotifications } from "../context/NotificationContext";
import type { NotificationType } from "../types";
import { TYPE_CONFIG } from "../utils";

export default function Dashboard() {
  const {
    notifications,
    activeFilter,
    loading,
    unreadCount,
    markAllRead,
  } = useNotifications();

  const [search, setSearch] = useState("");

  const filtered = notifications.filter((n) => {
    const matchesType = activeFilter === "all" || n.type === activeFilter;
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filterLabel =
    activeFilter === "all"
      ? "All Notifications"
      : TYPE_CONFIG[activeFilter as NotificationType]?.label + " Notifications";

  return (
    <div style={styles.layout}>
      <Sidebar />

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>{filterLabel}</h1>
            <p style={styles.pageSubtitle}>
              {sorted.length} notification{sorted.length !== 1 ? "s" : ""}
              {unreadCount > 0 ? ` · ${unreadCount} unread` : " · all caught up"}
            </p>
          </div>

          <div style={styles.topActions}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {unreadCount > 0 && (
              <button style={styles.markAllBtn} onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div style={styles.content}>
          {loading ? (
            <div style={styles.emptyState}>
              <div style={styles.loadingSpinner} />
              <p style={styles.emptyText}>Fetching notifications...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔔</div>
              <p style={styles.emptyText}>No notifications here yet.</p>
              <p style={styles.emptyHint}>
                {search ? "Try a different search term." : "Check back later for updates."}
              </p>
            </div>
          ) : (
            <div style={styles.cardList}>
              {sorted.map((n) => (
                <NotificationCard key={n.id} notification={n} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    height: "100vh",
    background: "#0A0A0F",
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "28px 32px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexShrink: 0,
    gap: 20,
    flexWrap: "wrap",
  },
  pageTitle: {
    fontSize: "1.45rem",
    fontWeight: 700,
    color: "#F9FAFB",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  pageSubtitle: {
    fontSize: "0.82rem",
    color: "rgba(249,250,251,0.35)",
    marginTop: 5,
    margin: "5px 0 0",
  },
  topActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "8px 14px",
  },
  searchIcon: { fontSize: "0.85rem" },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#F9FAFB",
    fontSize: "0.875rem",
    width: 200,
    fontFamily: "'DM Sans', sans-serif",
  },
  markAllBtn: {
    padding: "9px 16px",
    background: "rgba(110,231,183,0.08)",
    border: "1px solid rgba(110,231,183,0.2)",
    color: "#6EE7B7",
    borderRadius: 8,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 32px 32px",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
    gap: 12,
  },
  emptyIcon: { fontSize: "2.5rem", opacity: 0.3 },
  emptyText: { color: "rgba(249,250,251,0.4)", fontSize: "0.95rem", margin: 0 },
  emptyHint: { color: "rgba(249,250,251,0.2)", fontSize: "0.82rem", margin: 0 },
  loadingSpinner: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "2px solid rgba(110,231,183,0.2)",
    borderTop: "2px solid #6EE7B7",
    animation: "spin 0.7s linear infinite",
  },
};
