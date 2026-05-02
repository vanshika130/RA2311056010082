# Campus Notification Platform — REST API Contract

## Base URL
```
https://api.campusnotify.edu/v1
```

## Authentication
All protected routes require a Bearer token in the Authorization header.

---

## Global Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>
X-Client-Version: 1.0.0
X-Request-ID: <uuid-v4>
```

## Global Response Headers

```http
Content-Type: application/json
X-Request-ID: <uuid-v4>
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1714820400
```

---

## 1. AUTH ENDPOINTS

### POST /auth/login
Login with credentials and receive tokens.

**Request:**
```http
POST /v1/auth/login
Content-Type: application/json
```
```json
{
  "email": "student@campus.edu",
  "password": "SecurePass@123",
  "device_id": "web-browser-abc123"
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "usr_9f3k2m",
      "name": "Arjun Mehta",
      "email": "student@campus.edu",
      "role": "student",
      "department": "Computer Science",
      "year": 3,
      "avatar_url": "https://cdn.campusnotify.edu/avatars/usr_9f3k2m.jpg",
      "notification_preferences": {
        "placement": true,
        "events": true,
        "results": true,
        "announcements": true
      }
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "dGhpcyBpcyBhIHNhbXBsZSByZWZyZXNo...",
      "expires_in": 3600,
      "token_type": "Bearer"
    }
  },
  "meta": {
    "timestamp": "2026-05-02T10:30:00Z",
    "request_id": "req_a1b2c3d4"
  }
}
```

**Response 401:**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect.",
    "details": null
  },
  "meta": {
    "timestamp": "2026-05-02T10:30:00Z",
    "request_id": "req_a1b2c3d4"
  }
}
```

---

### POST /auth/refresh
Refresh the access token using refresh token.

**Request:**
```json
{
  "refresh_token": "dGhpcyBpcyBhIHNhbXBsZSByZWZyZXNo..."
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

### POST /auth/logout
Invalidate the current session.

**Request Headers Only** (no body required)

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "message": "Logged out successfully."
  }
}
```

---

## 2. NOTIFICATIONS ENDPOINTS

### GET /notifications
Fetch paginated list of notifications for the authenticated user.

**Query Parameters:**
| Param       | Type    | Default | Description                                  |
|-------------|---------|---------|----------------------------------------------|
| page        | integer | 1       | Page number                                  |
| limit       | integer | 20      | Items per page (max: 50)                    |
| type        | string  | all     | Filter: placement, event, result, announcement |
| is_read     | boolean | —       | Filter by read status                        |
| sort        | string  | desc    | Sort direction by created_at: asc or desc   |

**Request:**
```http
GET /v1/notifications?page=1&limit=20&type=placement&is_read=false
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": "notif_7x9k2p",
        "type": "placement",
        "category": "drive_announcement",
        "title": "Google On-Campus Drive — 2026",
        "body": "Google is visiting on May 15th for Software Engineer roles. Eligible: 7.5+ CGPA, CSE & IT branches.",
        "is_read": false,
        "is_pinned": true,
        "priority": "high",
        "sender": {
          "id": "dept_placement",
          "name": "Placement Cell",
          "avatar_url": "https://cdn.campusnotify.edu/avatars/placement-cell.png"
        },
        "attachments": [
          {
            "id": "att_1a2b3c",
            "name": "Google_JD_2026.pdf",
            "url": "https://cdn.campusnotify.edu/docs/att_1a2b3c.pdf",
            "size_bytes": 204800,
            "mime_type": "application/pdf"
          }
        ],
        "action": {
          "label": "Register Now",
          "url": "https://placements.campus.edu/register/google-2026"
        },
        "tags": ["google", "sde", "2026-batch"],
        "expires_at": "2026-05-10T23:59:59Z",
        "created_at": "2026-05-02T08:00:00Z",
        "updated_at": "2026-05-02T08:00:00Z"
      },
      {
        "id": "notif_3m1n5q",
        "type": "result",
        "category": "exam_result",
        "title": "Semester 5 Results Published",
        "body": "Results for Semester 5 (Nov 2025) are now available on the student portal.",
        "is_read": true,
        "is_pinned": false,
        "priority": "medium",
        "sender": {
          "id": "dept_exam",
          "name": "Examination Department",
          "avatar_url": "https://cdn.campusnotify.edu/avatars/exam-dept.png"
        },
        "attachments": [],
        "action": {
          "label": "View Result",
          "url": "https://results.campus.edu/sem5"
        },
        "tags": ["semester-5", "results"],
        "expires_at": null,
        "created_at": "2026-04-28T14:00:00Z",
        "updated_at": "2026-04-28T14:00:00Z"
      }
    ],
    "unread_count": 5
  },
  "meta": {
    "timestamp": "2026-05-02T10:30:00Z",
    "request_id": "req_b2c3d4e5",
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 47,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### GET /notifications/:id
Fetch a single notification by ID.

**Request:**
```http
GET /v1/notifications/notif_7x9k2p
Authorization: Bearer <access_token>
```

**Response 200:** Same schema as single notification object above.

**Response 404:**
```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "Notification not found or access denied.",
    "details": null
  }
}
```

---

### PATCH /notifications/:id/read
Mark a single notification as read.

**Request:**
```http
PATCH /v1/notifications/notif_7x9k2p/read
Authorization: Bearer <access_token>
```
*(No request body required)*

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "id": "notif_7x9k2p",
    "is_read": true,
    "read_at": "2026-05-02T10:35:00Z"
  }
}
```

---

### PATCH /notifications/read-all
Mark all notifications as read (optionally filtered by type).

**Request:**
```json
{
  "type": "placement"
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "updated_count": 12,
    "message": "12 placement notifications marked as read."
  }
}
```

---

### DELETE /notifications/:id
Delete a notification for the user.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "message": "Notification deleted successfully."
  }
}
```

---

## 3. USER PREFERENCES ENDPOINTS

### GET /users/me/preferences
Fetch notification preferences for the logged-in user.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "user_id": "usr_9f3k2m",
    "preferences": {
      "placement": true,
      "events": true,
      "results": true,
      "announcements": false
    },
    "push_enabled": true,
    "email_enabled": true,
    "quiet_hours": {
      "enabled": true,
      "start": "22:00",
      "end": "07:00",
      "timezone": "Asia/Kolkata"
    }
  }
}
```

---

### PUT /users/me/preferences
Update notification preferences.

**Request:**
```json
{
  "placement": true,
  "events": false,
  "results": true,
  "announcements": true,
  "push_enabled": true,
  "email_enabled": false
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "message": "Preferences updated successfully.",
    "preferences": {
      "placement": true,
      "events": false,
      "results": true,
      "announcements": true
    }
  }
}
```

---

## 4. REAL-TIME ENDPOINT

### GET /notifications/stream (SSE)
Server-Sent Events stream for real-time push notifications.

```http
GET /v1/notifications/stream
Authorization: Bearer <access_token>
Accept: text/event-stream
Cache-Control: no-cache
```

**Event Stream Format:**

```
id: evt_001
event: notification
data: {"id":"notif_newxyz","type":"placement","title":"Infosys Drive Update","body":"Registration deadline extended to May 5th.","priority":"high","created_at":"2026-05-02T10:40:00Z"}

id: evt_002
event: ping
data: {"timestamp":"2026-05-02T10:40:30Z"}

id: evt_003
event: read_ack
data: {"notification_id":"notif_7x9k2p","is_read":true}
```

**Event Types:**
| Event Type    | Description                             |
|---------------|-----------------------------------------|
| notification  | New notification pushed to user         |
| ping          | Heartbeat every 30s to keep alive       |
| read_ack      | Acknowledge read update from another tab|
| delete_ack    | Acknowledge delete from another session |

---

### POST /notifications/device-token
Register a device push token (FCM/APNS).

**Request:**
```json
{
  "token": "fcm_token_xyz...",
  "platform": "web",
  "device_id": "web-browser-abc123"
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "message": "Device token registered."
  }
}
```

---

## Notification JSON Schema (Canonical)

```json
{
  "id": "string (notif_xxxxx)",
  "type": "enum: placement | event | result | announcement",
  "category": "string (drive_announcement | exam_result | workshop | etc.)",
  "title": "string",
  "body": "string",
  "is_read": "boolean",
  "is_pinned": "boolean",
  "priority": "enum: low | medium | high | urgent",
  "sender": {
    "id": "string",
    "name": "string",
    "avatar_url": "string | null"
  },
  "attachments": [
    {
      "id": "string",
      "name": "string",
      "url": "string",
      "size_bytes": "integer",
      "mime_type": "string"
    }
  ],
  "action": {
    "label": "string",
    "url": "string"
  },
  "tags": ["string"],
  "expires_at": "ISO8601 | null",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

---

## Error Codes Reference

| Code                  | HTTP Status | Meaning                           |
|-----------------------|-------------|-----------------------------------|
| INVALID_CREDENTIALS   | 401         | Wrong email/password              |
| TOKEN_EXPIRED         | 401         | Access token has expired          |
| FORBIDDEN             | 403         | No permission for this resource   |
| NOT_FOUND             | 404         | Resource does not exist           |
| VALIDATION_ERROR      | 422         | Request body failed validation    |
| RATE_LIMITED          | 429         | Too many requests                 |
| SERVER_ERROR          | 500         | Internal server error             |
