// Historical raid reports from parsed JSON
export const HISTORICAL_REPORTS = [
  {
    id: "hist_1",
    user_id: "historical_import",
    location: "535 S Alma School Rd #60, Mesa, AZ 85210, USA",
    latitude: 33.4056762,
    longitude: -111.8552693,
    county: "Mesa",
    state: "AZ",
    date: "2026-01-17",
    time: "06:21",
    description: "1/13/26 9:30am landscapers pulled out of trucks and handcuffed",
    image_keys: "[\"https://firebasestorage.googleapis.com/v0/b/iceinmyarea.firebasestorage.app/o/reports%2Fverified%2F535_s_alma_school_rd_60_mesa_az_85210_usa%2F1768630909939.jpg?alt=media&token=ff0a83a9-bae2-405f-8e1a-7b1e6b7eab9a\"]",
    validation_status: "verified",
    validation_reason: "Historical import from verified reports",
    report_count: 2,
    created_at: "2026-01-17T06:21:50.862Z",
    updated_at: "2026-01-17T06:21:50.862Z"
  },
  {
    id: "hist_2",
    user_id: "historical_import",
    location: "1816 Fremont Ave N, Minneapolis, MN 55411, USA",
    latitude: 44.9980424,
    longitude: -93.295328,
    county: "Minneapolis",
    state: "MN",
    date: "2026-01-17",
    time: "05:59",
    description: "Bunch of white ICE agents posted, looking like they was setting something up or blocking the street. Had like four cars minimum.",
    image_keys: "[\"https://firebasestorage.googleapis.com/v0/b/iceinmyarea.firebasestorage.app/o/reports%2Fverified%2F1816_fremont_ave_n_minneapolis_mn_55411_usa%2F1768629541767.png?alt=media&token=3796490f-12de-41b3-8e1e-47fbaa04a9a2\"]",
    validation_status: "verified",
    validation_reason: "Historical import from verified reports",
    report_count: 2,
    created_at: "2026-01-17T05:59:03.150Z",
    updated_at: "2026-01-17T05:59:03.150Z"
  }
  // Additional historical reports would go here...
] as const;
