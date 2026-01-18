
CREATE TABLE raid_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_raid_reports_user_id ON raid_reports(user_id);
CREATE INDEX idx_raid_reports_date ON raid_reports(date);
CREATE INDEX idx_raid_reports_created_at ON raid_reports(created_at);
