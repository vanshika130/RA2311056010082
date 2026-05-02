// src/types/index.ts

export type NotificationType = "placement" | "event" | "result" | "announcement";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Sender {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size_bytes: number;
  mime_type: string;
}

export interface NotificationAction {
  label: string;
  url: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  category: string;
  title: string;
  body: string;
  is_read: boolean;
  is_pinned: boolean;
  priority: NotificationPriority;
  sender: Sender;
  attachments: Attachment[];
  action: NotificationAction | null;
  tags: string[];
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  year: number;
  avatar_url: string;
  notification_preferences: Record<NotificationType, boolean>;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  meta?: {
    timestamp: string;
    request_id: string;
    pagination?: PaginationMeta;
  };
  error?: {
    code: string;
    message: string;
    details: unknown;
  };
}
