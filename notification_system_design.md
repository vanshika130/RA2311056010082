# CampusNotify — System Design Documentation
stage 1 

## Core Frontend Actions
1. Authentication: Secure Login, Logout, and Token management
2.Notification Feed: Paginated list fetching with type-based filtering.
3. Read Status Tracking: Real-time sync of read/unread states.
4. Real-Time Sync: Using Server-Sent Events (SSE) for instant alerts.
5. Preferences: Managing user-specific notification settings.
6. Device Registration: Handling push tokens for browser notifications.

---
stage 2 
## Database tabbles 

-- Simple User Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT
);

-- Simple Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title TEXT,
    body TEXT,
    is_read BOOLEAN DEFAULT FALSE
);

Which database is recommended and how does it handle scale?
We recommend using SQL (PostgreSQL) for its reliable relational structure. As data volume grows, potential performance lags are solved by implementing Table Partitioning (splitting data by month), Composite Indexing to ensure the dashboard remains lightning-fast.

stage 3 

1. The query is accurate but the slowness is due to a sequential scan because the the database is reading all 500,000 rows one by one 

2. To fix this we can use a composite index on (user_id,is_read,created_at_DESC)

3. Indexing makes the read operations faster it is safe for this use case and also add some extra cost . 

## find all students who received a placement notification in the last 7 days
SELECT DISTINCT u.name, u.email
FROM users u
JOIN notifications n ON u.id = n.user_id
WHERE n.type = 'placement'
  AND n.created_at >= NOW() - INTERVAL '7 days';

```

stage 4

## databse getting overwhelmed solution
read replies  to offload  traffic 
connection pooling to maintain the thousand of users
caching to store frequently accessed data .

stage 5 

 using batch sql insert you can insert many recors in single database command .

stage 6
 SELECT * FROM notifications 
    WHERE user_id = 'your-id' 
    ORDER BY is_read ASC, 
             FIELD(priority, 'urgent', 'high', 'medium', 'low'), 
             created_at DESC;
succesfully added in github .


