
DROP INDEX idx_post_reports_unique;
DROP INDEX idx_post_reports_user_id;
DROP INDEX idx_post_reports_post_id;
DROP TABLE post_reports;

ALTER TABLE raid_reports DROP COLUMN report_count;
ALTER TABLE raid_reports DROP COLUMN validation_reason;
ALTER TABLE raid_reports DROP COLUMN validation_status;
