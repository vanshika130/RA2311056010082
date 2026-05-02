// src/components/NotificationCard.tsx

import { useState } from "react";
import type { Notification } from "../types";
import { timeAgo, formatBytes, TYPE_CONFIG, PRIORITY_COLORS } from "../utils";
import { useNotifications } from "../context/NotificationContext";

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification: notif }: Props) {
  const { markRead, removeNotification } = useNotifications();
  const [expanded, setExpanded] = useState(false);
  const [removing, setRemoving] = useState(false);

  const config = TYPE_CONFIG[notif.type];
  const priorityColor = PRIORITY_COLORS[notif.priority];

  function handleClick() {
    if (!notif.is_read) markRead(notif.id);
    setExpanded((v) => !v);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setRemoving(true);
    setTimeout(() => removeNotification(notif.id), 300);
  }

  return (
    <div
      style={{
        ...styles.card,
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(40px)" : "none",
        background: notif.is_read ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
        borderLeft: `3px solid ${notif.is_read ? "transparent" : config.color}`,
      }}
      onClick={handleClick}
    >
      {notif.is_pinned && (
        <div style={styles.pinnedBadge}>📌 Pinned</div>
      )}

      <div style={styles.header}>
        <div style={styles.typeRow}>
          <span style={{ ...styles.typePill, background: config.bg, color: config.color }}>
            {config.icon} {config.label}
          </span>
          <span style={{ ...styles.priorityDot, background: priorityColor }} title={notif.priority} />
          {!notif.is_read && <span style={styles.unreadDot} />}
        </div>
        <div style={styles.headerRight}>
          <span style={styles.time}>{timeAgo(notif.created_at)}</span>
          <button
            style={styles.closeBtn}
            onClick={handleRemove}
            title="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

      <h3 style={{ ...styles.title, color: notif.is_read ? "rgba(249,250,251,0.65)" : "#F9FAFB" }}>
        {notif.title}
      </h3>

      <p style={{ ...styles.body, WebkitLineClamp: expanded ? undefined : 2 }}>
        {notif.body}
      </p>

      {expanded && (
        <div style={styles.expandedArea}>
          {notif.attachments.length > 0 && (
            <div style={styles.attachments}>
              {notif.attachments.map((att) => (
                <a key={att.id} href={att.url} style={styles.attachment} onClick={(e) => e.stopPropagation()}>
                  <span style={styles.attachIcon}>📄</span>
                  <div>
                    <div style={styles.attName}>{att.name}</div>
                    <div style={styles.attSize}>{formatBytes(att.size_bytes)}</div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {notif.tags.length > 0 && (
            <div style={styles.tags}>
              {notif.tags.map((tag) => (
                <span key={tag} style={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}

          <div style={styles.senderRow}>
            <span style={styles.senderAvatar}>
              {notif.sender.name[0]}
            </span>
            <span style={styles.senderName}>{notif.sender.name}</span>
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <button style={styles.expandBtn}>
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
        {notif.action && (
          <a
            href={notif.action.url}
            style={{ ...styles.actionBtn, background: config.bg, color: config.color }}
            onClick={(e) => e.stopPropagation()}
          >
            {notif.action.label} →
          </a>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.07)",
    padding: "18px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  pinnedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    background: "rgba(252,211,77,0.1)",
    color: "#FCD34D",
    fontSize: "0.7rem",
    fontWeight: 600,
    padding: "4px 10px",
    borderBottomLeftRadius: 8,
    letterSpacing: "0.3px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeRow: { display: "flex", alignItems: "center", gap: 8 },
  typePill: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#6EE7B7",
    boxShadow: "0 0 6px #6EE7B7",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  time: { fontSize: "0.78rem", color: "rgba(249,250,251,0.35)" },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(249,250,251,0.3)",
    fontSize: "1.1rem",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 4px",
    transition: "color 0.2s",
  },
  title: {
    fontSize: "0.97rem",
    fontWeight: 600,
    margin: "0 0 8px 0",
    letterSpacing: "-0.2px",
    lineHeight: 1.4,
  },
  body: {
    fontSize: "0.875rem",
    color: "rgba(249,250,251,0.5)",
    lineHeight: 1.65,
    margin: 0,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  expandedArea: { marginTop: 16, display: "flex", flexDirection: "column", gap: 14 },
  attachments: { display: "flex", flexDirection: "column", gap: 8 },
  attachment: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "8px 12px",
    textDecoration: "none",
    color: "inherit",
  },
  attachIcon: { fontSize: "1.2rem" },
  attName: { fontSize: "0.82rem", color: "rgba(249,250,251,0.8)", fontWeight: 500 },
  attSize: { fontSize: "0.73rem", color: "rgba(249,250,251,0.35)", marginTop: 2 },
  tags: { display: "flex", flexWrap: "wrap", gap: 6 },
  tag: {
    padding: "3px 8px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 4,
    fontSize: "0.73rem",
    color: "rgba(249,250,251,0.35)",
  },
  senderRow: { display: "flex", alignItems: "center", gap: 8 },
  senderAvatar: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "rgba(110,231,183,0.15)",
    color: "#6EE7B7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.72rem",
    fontWeight: 700,
  },
  senderName: { fontSize: "0.78rem", color: "rgba(249,250,251,0.4)" },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  expandBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(249,250,251,0.3)",
    fontSize: "0.78rem",
    cursor: "pointer",
    padding: 0,
    transition: "color 0.2s",
  },
  actionBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: "0.8rem",
    fontWeight: 600,
    textDecoration: "none",
    transition: "opacity 0.2s",
  },
};
