// Script to import historical raid reports from JSON
import { drizzle } from 'drizzle-orm/d1';

const historicalData = {
  "1000_bass_pro_dr_nw_altoona_ia_50009_usa": {
    "addedAt": "2026-01-16T22:50:37.627Z",
    "additionalInfo": "ICE agents checked in at a motel near the Bass Pro Shops/outlet malls. Guessing on car but couldnt get a pic of individual.",
    "address": "1000 Bass Pro Dr NW, Altoona, IA 50009, USA",
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/iceinmyarea.firebasestorage.app/o/reports%2Fverified%2F1000_bass_pro_dr_nw_altoona_ia_50009_usa%2F1768603836690.jpg?alt=media&token=2b8d3750-56ab-44df-b8b2-2480fff824f1",
    "lat": 41.659455,
    "lng": -93.5146969,
    "reported": 2,
    "verifiedAt": "2026-01-17T00:05:15.418Z"
  }
  // ... more entries would be here in the actual file
};

export async function importHistoricalRaids(db: any) {
  const reports = [];
  
  for (const [key, report] of Object.entries(historicalData)) {
    const addedAt = new Date(report.addedAt);
    const date = addedAt.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = addedAt.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    
    // Extract state and county from address if possible
    const addressParts = report.address.split(',').map(p => p.trim());
    const state = addressParts[addressParts.length - 2] || null;
    const county = addressParts.length > 3 ? addressParts[addressParts.length - 3] : null;
    
    reports.push({
      user_id: 'historical_import',
      location: report.address,
      latitude: report.lat,
      longitude: report.lng,
      date: date,
      time: time,
      description: report.additionalInfo,
      image_keys: report.imageUrl ? JSON.stringify([report.imageUrl]) : null,
      validation_status: 'verified',
      validation_reason: 'Historical import from verified reports',
      report_count: report.reported || 0,
      state: state,
      county: county,
      created_at: report.addedAt,
      updated_at: report.addedAt
    });
  }
  
  // Insert all reports
  for (const report of reports) {
    await db.execute(
      `INSERT INTO raid_reports (
        user_id, location, latitude, longitude, date, time, 
        description, image_keys, validation_status, validation_reason,
        report_count, state, county, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        report.user_id,
        report.location,
        report.latitude,
        report.longitude,
        report.date,
        report.time,
        report.description,
        report.image_keys,
        report.validation_status,
        report.validation_reason,
        report.report_count,
        report.state,
        report.county,
        report.created_at,
        report.updated_at
      ]
    );
  }
  
  console.log(`Imported ${reports.length} historical raid reports`);
}
