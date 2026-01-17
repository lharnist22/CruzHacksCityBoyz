
CREATE TABLE user_notification_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  notification_state TEXT,
  notification_county TEXT,
  receive_sms_notifications BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_notifications_user_id ON user_notification_preferences(user_id);
CREATE INDEX idx_user_notifications_state ON user_notification_preferences(notification_state);
CREATE INDEX idx_user_notifications_county ON user_notification_preferences(notification_county);
