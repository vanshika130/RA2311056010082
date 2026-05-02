// src/context/NotificationContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import type { Notification, NotificationType } from "../types";
import { useAuth } from "./AuthContext";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  activeFilter: NotificationType | "all";
  loading: boolean;
  liveConnected: boolean;
  setFilter: (f: NotificationType | "all") => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Realistic mock data so the UI is always populated
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    type: "placement",
    category: "drive_announcement",
    title: "Google On-Campus Drive — 2026",
    body: "Google is visiting on May 15th for Software Engineer roles. Eligible students: 7.5+ CGPA, CSE & IT branches only. Last date to register is May 10th.",
    is_read: false,
    is_pinned: true,
    priority: "urgent",
    sender: { id: "dept_place", name: "Placement Cell", avatar_url: null },
    attachments: [{ id: "a1", name: "Google_JD_2026.pdf", url: "#", size_bytes: 204800, mime_type: "application/pdf" }],
    action: { label: "Register Now", url: "#" },
    tags: ["google", "sde", "2026"],
    expires_at: "2026-05-10T23:59:59Z",
    created_at: "2026-05-02T08:00:00Z",
    updated_at: "2026-05-02T08:00:00Z",
  },
  {
    id: "notif_2",
    type: "result",
    category: "exam_result",
    title: "Semester 5 Results Are Out",
    body: "Results for Semester 5 (Nov 2025) exams are now available. Log in to the student portal to view your marks and CGPA update.",
    is_read: false,
    is_pinned: false,
    priority: "high",
    sender: { id: "dept_exam", name: "Examination Department", avatar_url: null },
    attachments: [],
    action: { label: "View Results", url: "#" },
    tags: ["semester-5", "results"],
    expires_at: null,
    created_at: "2026-04-28T14:00:00Z",
    updated_at: "2026-04-28T14:00:00Z",
  },
  {
    id: "notif_3",
    type: "event",
    category: "workshop",
    title: "AI & ML Workshop — Dept of CSE",
    body: "A two-day hands-on workshop on Generative AI and LLM fine-tuning is scheduled on May 8–9. Registration is free for all students. Seats are limited.",
    is_read: true,
    is_pinned: false,
    priority: "medium",
    sender: { id: "dept_cse", name: "CSE Department", avatar_url: null },
    attachments: [],
    action: { label: "Register", url: "#" },
    tags: ["ai", "ml", "workshop"],
    expires_at: "2026-05-07T23:59:59Z",
    created_at: "2026-04-25T10:00:00Z",
    updated_at: "2026-04-25T10:00:00Z",
  },
  {
    id: "notif_4",
    type: "announcement",
    category: "general",
    title: "Library Working Hours Extended",
    body: "During exam season (May 1–31), the central library will remain open until midnight on all weekdays. Weekend timings stay unchanged.",
    is_read: true,
    is_pinned: false,
    priority: "low",
    sender: { id: "dept_lib", name: "Library Administration", avatar_url: null },
    attachments: [],
    action: null,
    tags: ["library", "exams"],
    expires_at: "2026-05-31T00:00:00Z",
    created_at: "2026-04-30T09:00:00Z",
    updated_at: "2026-04-30T09:00:00Z",
  },
  {
    id: "notif_5",
    type: "placement",
    category: "drive_announcement",
    title: "Infosys Deadline Extended — Register Today",
    body: "The Infosys Systems Engineer registration deadline has been pushed to May 5th. If you missed it earlier, this is your last chance.",
    is_read: false,
    is_pinned: false,
    priority: "high",
    sender: { id: "dept_place", name: "Placement Cell", avatar_url: null },
    attachments: [],
    action: { label: "Register Now", url: "#" },
    tags: ["infosys", "2026"],
    expires_at: "2026-05-05T23:59:59Z",
    created_at: "2026-05-01T18:00:00Z",
    updated_at: "2026-05-01T18:00:00Z",
  },
  {
    id: "notif_6",
    type: "event",
    category: "cultural",
    title: "Annual Tech Fest — Technomania 2026",
    body: "The flagship annual tech fest returns on May 20–22. Competitions, hackathons, and celebrity talks await. Team registrations open now.",
    is_read: true,
    is_pinned: false,
    priority: "medium",
    sender: { id: "dept_student", name: "Student Affairs", avatar_url: null },
    attachments: [],
    action: { label: "View Events", url: "#" },
    tags: ["techfest", "hackathon"],
    expires_at: "2026-05-19T23:59:59Z",
    created_at: "2026-04-20T12:00:00Z",
    updated_at: "2026-04-20T12:00:00Z",
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotificationType | "all">("all");
  const [loading] = useState(false);
  const [liveConnected, setLiveConnected] = useState(false);
  const sseRef = useRef<EventSource | null>(null);

  // Simulate SSE connection when token is present
  useEffect(() => {
    if (!token) return;

    setLiveConnected(true);

    // Simulate a live notification arriving after 8 seconds
    const timer = setTimeout(() => {
      const liveNotif: Notification = {
        id: "notif_live_" + Date.now(),
        type: "placement",
        category: "drive_announcement",
        title: "🔴 Live: Amazon Walk-In Drive Tomorrow",
        body: "Amazon has announced a surprise walk-in drive for SDE-1 roles tomorrow at 9 AM. Open to all eligible 2026 batch students.",
        is_read: false,
        is_pinned: true,
        priority: "urgent",
        sender: { id: "dept_place", name: "Placement Cell", avatar_url: null },
        attachments: [],
        action: { label: "View Details", url: "#" },
        tags: ["amazon", "walkin", "urgent"],
        expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNotifications((prev) => [liveNotif, ...prev]);
    }, 8000);

    return () => {
      clearTimeout(timer);
      sseRef.current?.close();
      setLiveConnected(false);
    };
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeFilter,
        loading,
        liveConnected,
        setFilter: setActiveFilter,
        markRead,
        markAllRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
}
