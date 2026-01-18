
ALTER TABLE user_notification_preferences ADD COLUMN phone_number TEXT;
ALTER TABLE user_notification_preferences ADD COLUMN notification_state TEXT;
ALTER TABLE user_notification_preferences ADD COLUMN notification_county TEXT;
ALTER TABLE user_notification_preferences ADD COLUMN receive_sms_notifications BOOLEAN DEFAULT 0;
