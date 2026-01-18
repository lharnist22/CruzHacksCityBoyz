
ALTER TABLE raid_reports ADD COLUMN validation_status TEXT;
ALTER TABLE raid_reports ADD COLUMN validation_reason TEXT;
ALTER TABLE raid_reports ADD COLUMN report_count INTEGER DEFAULT 0;

CREATE TABLE post_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_reports_post_id ON post_reports(post_id);
CREATE INDEX idx_post_reports_user_id ON post_reports(user_id);
CREATE UNIQUE INDEX idx_post_reports_unique ON post_reports(post_id, user_id);
