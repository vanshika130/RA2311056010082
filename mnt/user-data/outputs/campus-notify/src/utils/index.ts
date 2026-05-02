// src/utils/index.ts

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const TYPE_CONFIG = {
  placement: {
    label: "Placement",
    color: "#6EE7B7",
    bg: "rgba(110,231,183,0.12)",
    icon: "💼",
  },
  event: {
    label: "Event",
    color: "#93C5FD",
    bg: "rgba(147,197,253,0.12)",
    icon: "🎯",
  },
  result: {
    label: "Result",
    color: "#FCA5A5",
    bg: "rgba(252,165,165,0.12)",
    icon: "📊",
  },
  announcement: {
    label: "Notice",
    color: "#FCD34D",
    bg: "rgba(252,211,77,0.12)",
    icon: "📢",
  },
} as const;

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#EF4444",
  high: "#F97316",
  medium: "#EAB308",
  low: "#6B7280",
};
