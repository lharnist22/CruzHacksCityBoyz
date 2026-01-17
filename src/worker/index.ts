import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { v4 as uuidv4 } from "uuid";

const app = new Hono<{ Bindings: Env }>();

// Obtain redirect URL from the Mocha Users Service
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Exchange the code for a session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

// Get the current user object for the frontend
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Logout endpoint
app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Raid Reports API

// Create a new raid report
app.post(
  "/api/raid-reports",
  authMiddleware,
  async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    
    const location = formData.get("location") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const county = formData.get("county") as string | null;
    const state = formData.get("state") as string | null;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const description = formData.get("description") as string | null;
    
    if (!location || isNaN(latitude) || isNaN(longitude) || !date || !time) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    const imageKeys: string[] = [];
    
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const allowedTypes = ['image/heic', 'image/jpeg', 'image/png'];
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        
        // Validate file type
        const isValidType = allowedTypes.includes(fileType) || 
                           fileName.endsWith('.heic') || 
                           fileName.endsWith('.jpeg') || 
                           fileName.endsWith('.jpg') || 
                           fileName.endsWith('.png');
        
        if (!isValidType) {
          continue; // Skip invalid files
        }
        
        const fileExtension = file.name.split('.').pop();
        const key = `raid-reports/${uuidv4()}.${fileExtension}`;
        
        await c.env.R2_BUCKET.put(key, file.stream(), {
          httpMetadata: {
            contentType: file.type || 'application/octet-stream',
          },
        });
        
        imageKeys.push(key);
      }
    }

    const result = await c.env.DB.prepare(
      "INSERT INTO raid_reports (user_id, location, latitude, longitude, county, state, date, time, description, image_keys) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        user.id, 
        location, 
        latitude, 
        longitude, 
        county, 
        state, 
        date, 
        time, 
        description, 
        imageKeys.length > 0 ? JSON.stringify(imageKeys) : null
      )
      .run();

    const report = await c.env.DB.prepare(
      "SELECT * FROM raid_reports WHERE id = ?"
    )
      .bind(result.meta.last_row_id)
      .first();

    return c.json(report, 201);
  }
);

// Get all raid reports (most recent first)
app.get("/api/raid-reports", authMiddleware, async (c) => {
  const state = c.req.query("state");
  const county = c.req.query("county");
  
  let query = "SELECT * FROM raid_reports WHERE 1=1";
  const params: string[] = [];
  
  if (state) {
    query += " AND state = ?";
    params.push(state);
  }
  
  if (county) {
    query += " AND county = ?";
    params.push(county);
  }
  
  query += " ORDER BY created_at DESC LIMIT 100";
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json(results);
});

// Report a post for misinformation
app.post("/api/raid-reports/:id/report", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const postId = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const reason = body.reason || "misinformation";

  // Check if user already reported this post
  const existingReport = await c.env.DB.prepare(
    "SELECT id FROM post_reports WHERE post_id = ? AND user_id = ?"
  )
    .bind(postId, user.id)
    .first();

  if (existingReport) {
    return c.json({ error: "Already reported" }, 409);
  }

  // Insert the report
  await c.env.DB.prepare(
    "INSERT INTO post_reports (post_id, user_id, reason) VALUES (?, ?, ?)"
  )
    .bind(postId, user.id, reason)
    .run();

  // Update report count on the raid report
  await c.env.DB.prepare(
    "UPDATE raid_reports SET report_count = report_count + 1 WHERE id = ?"
  )
    .bind(postId)
    .run();

  // Get the updated report
  const report = await c.env.DB.prepare(
    "SELECT * FROM raid_reports WHERE id = ?"
  )
    .bind(postId)
    .first();

  return c.json({ success: true, report }, 200);
});

// Get image from R2
app.get("/api/images/:key{.+}", async (c) => {
  const key = c.req.param("key");
  
  const object = await c.env.R2_BUCKET.get(key);
  
  if (!object) {
    return c.json({ error: "Image not found" }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  
  return c.body(object.body, { headers });
});

export default app;
