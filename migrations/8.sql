
CREATE TABLE user_notification_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT 1,
  push_notifications BOOLEAN DEFAULT 1,
  sms_notifications BOOLEAN DEFAULT 0,
  notification_radius INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
