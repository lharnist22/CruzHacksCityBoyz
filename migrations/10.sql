
-- Seed historical raid reports data (only insert if not already present)
INSERT OR IGNORE INTO raid_reports (
  id, user_id, location, latitude, longitude, county, state, date, time,
  description, image_keys, validation_status, validation_reason, report_count,
  created_at, updated_at
)
SELECT 1, 'historical_import', '1919 E Old Shakopee Rd, Bloomington, MN 55425, USA', 44.8401492, -93.24511729999999, 'Bloomington', 'MN', '2026-01-13', '13:48', 'I was driving and was not able to get a photo but there were ICE trucks on the bridge going south', '["https://firebasestorage.googleapis.com/v0/b/iceinmyarea.firebasestorage.app/o/reports%2Fverified%2F1919_e_old_shakopee_rd_bloomington_mn_55425_usa%2F1768312122808.jpg?alt=media&token=43d93900-c87c-4b4c-8bb3-e110dc97d8b9"]', 'verified', 'Historical import from verified reports', 2, '2026-01-13T13:48:46.104Z', '2026-01-13T13:48:46.104Z'
WHERE NOT EXISTS (SELECT 1 FROM raid_reports WHERE id = 1);
