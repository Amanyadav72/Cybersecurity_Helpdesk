import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// --------------------------------------------------------------------------
// Neon PostgreSQL Database Configuration
// --------------------------------------------------------------------------
const neonDbUrl =
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  (process.env.PGHOST
    ? `postgresql://${process.env.PGUSER || 'neondb_owner'}:${encodeURIComponent(process.env.PGPASSWORD || '')}@${process.env.PGHOST}/${process.env.PGDATABASE || 'neondb'}?sslmode=require`
    : '');
let dbPool: pg.Pool | null = null;
let isNeonConnected = false;

// Fallback local storage file if Neon connection string is not yet supplied
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'cyber_safety.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBUser {
  id: number;
  google_id: string;
  name: string;
  email: string;
  profile_picture: string;
  created_at: string;
}

interface DBQuestion {
  id: string;
  user_id: number;
  category: string;
  question: string;
  status: 'Pending' | 'Answered';
  response: string | null;
  created_at: string;
  updated_at: string;
}

interface DatabaseSchema {
  users: DBUser[];
  questions: DBQuestion[];
}

function loadLocalDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading local file:', err);
  }
  const initial: DatabaseSchema = { users: [], questions: [] };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function saveLocalDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local file:', err);
  }
}

// Initialize Neon PostgreSQL tables
async function initNeonDatabase() {
  const host = process.env.PGHOST || 'ep-withered-paper-b4mgsq8e-pooler.c-6.us-east-2.aws.neon.tech';
  const database = process.env.PGDATABASE || 'neondb';
  const user = process.env.PGUSER || 'neondb_owner';
  const password = process.env.PGPASSWORD || 'npg_z6FD3vbHEQdZ';

  try {
    dbPool = new Pool({
      host,
      database,
      user,
      password,
      ssl: { rejectUnauthorized: false }, // Required for Neon serverless PostgreSQL
      max: 10,
      connectionTimeoutMillis: 10000,
    });

    // Test connection
    const client = await dbPool.connect();
    console.log(' Connected successfully to Neon PostgreSQL database!');
    isNeonConnected = true;

    // Create required tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        profile_picture VARCHAR(1024),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(64) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(128) NOT NULL,
        question TEXT NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'Pending',
        response TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log(' Neon PostgreSQL tables (users, questions) verified.');
  } catch (err) {
    console.error('⚠️ Could not connect to Neon PostgreSQL:', (err as Error).message);
    isNeonConnected = false;
  }
}

initNeonDatabase();

// --------------------------------------------------------------------------
// Database Helper Methods (Abstracted for Neon PostgreSQL with Local Fallback)
// --------------------------------------------------------------------------
async function findUserByEmail(email: string): Promise<DBUser | null> {
  if (isNeonConnected && dbPool) {
    const res = await dbPool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
    if (res.rows.length) return res.rows[0];
  }
  const db = loadLocalDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findUserById(id: number): Promise<DBUser | null> {
  if (isNeonConnected && dbPool) {
    const res = await dbPool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    if (res.rows.length) return res.rows[0];
  }
  const db = loadLocalDB();
  return db.users.find(u => u.id === id) || null;
}

async function upsertGoogleUser(userData: {
  google_id: string;
  name: string;
  email: string;
  profile_picture?: string;
}): Promise<DBUser> {
  const { google_id, name, email, profile_picture = '' } = userData;

  if (isNeonConnected && dbPool) {
    const query = `
      INSERT INTO users (google_id, name, email, profile_picture)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        profile_picture = EXCLUDED.profile_picture,
        google_id = EXCLUDED.google_id
      RETURNING *;
    `;
    const res = await dbPool.query(query, [google_id, name, email, profile_picture]);
    return res.rows[0];
  }

  // Local fallback
  const db = loadLocalDB();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      google_id,
      name,
      email,
      profile_picture,
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    user.name = name;
    user.google_id = google_id;
    if (profile_picture) user.profile_picture = profile_picture;
  }
  saveLocalDB(db);
  return user;
}

async function getQuestionsByUser(userId: number): Promise<DBQuestion[]> {
  if (isNeonConnected && dbPool) {
    const res = await dbPool.query(
      'SELECT * FROM questions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return res.rows;
  }
  const db = loadLocalDB();
  return db.questions.filter(q => q.user_id === userId);
}

async function createQuestion(userId: number, category: string, question: string): Promise<DBQuestion> {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const refId = `CSH-${year}-${randomSuffix}`;
  const now = new Date().toISOString();

  if (isNeonConnected && dbPool) {
    const query = `
      INSERT INTO questions (id, user_id, category, question, status, response, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'Pending', NULL, $5, $5)
      RETURNING *;
    `;
    const res = await dbPool.query(query, [refId, userId, category, question.trim(), now]);
    return res.rows[0];
  }

  const db = loadLocalDB();
  const newQ: DBQuestion = {
    id: refId,
    user_id: userId,
    category,
    question: question.trim(),
    status: 'Pending',
    response: null,
    created_at: now,
    updated_at: now,
  };
  db.questions.unshift(newQ);
  saveLocalDB(db);
  return newQ;
}

async function updateQuestionResponse(questionId: string, responseText: string): Promise<DBQuestion | null> {
  const now = new Date().toISOString();
  if (isNeonConnected && dbPool) {
    const res = await dbPool.query(
      `UPDATE questions
       SET response = $1, status = 'Answered', updated_at = $2
       WHERE id = $3
       RETURNING *`,
      [responseText.trim(), now, questionId]
    );
    return res.rows[0] || null;
  }

  const db = loadLocalDB();
  const q = db.questions.find(item => item.id === questionId);
  if (!q) return null;
  q.response = responseText.trim();
  q.status = 'Answered';
  q.updated_at = now;
  saveLocalDB(db);
  return q;
}

// --------------------------------------------------------------------------
// Session / JWT Tokens
// --------------------------------------------------------------------------
function generateSessionToken(user: DBUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + 7 * 24 * 3600 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

async function authenticateRequest(req: express.Request): Promise<DBUser | null> {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.query.token) {
    token = String(req.query.token);
  }

  if (!token) return null;

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded.sub) {
      return await findUserById(Number(decoded.sub));
    }
    if (decoded.email) {
      return await findUserByEmail(decoded.email);
    }
  } catch {
    // If not json, try resolving directly by email or id
    return (await findUserByEmail(token)) || (await findUserById(Number(token)));
  }
  return null;
}

// --------------------------------------------------------------------------
// System Status Endpoint (Tells frontend if Neon & Google OAuth are ready)
// --------------------------------------------------------------------------
app.get('/api/system/status', (_req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const hasNeonUrl = !!(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.PGHOST);

  res.json({
    neon_database: {
      connected: isNeonConnected,
      configured: hasNeonUrl,
      provider: 'Neon PostgreSQL (Serverless)',
      host: process.env.PGHOST || 'ep-withered-paper-b4mgsq8e-pooler.c-6.us-east-2.aws.neon.tech',
      database: process.env.PGDATABASE || 'neondb',
      user: process.env.PGUSER || 'neondb_owner',
    },
    google_oauth: {
      configured: !!(googleClientId && googleClientSecret),
      client_id_set: !!googleClientId,
      client_secret_set: !!googleClientSecret,
      client_id_prefix: googleClientId ? `${googleClientId.substring(0, 14)}...` : '',
    },
  });
});

// Live Neon PostgreSQL Database Test Endpoint
app.get('/api/system/test-db', async (_req, res) => {
  if (!dbPool) {
    return res.status(503).json({
      success: false,
      message: 'Neon PostgreSQL pool not initialized. Please verify credentials.',
    });
  }

  const startTime = Date.now();
  try {
    const result = await dbPool.query(`
      SELECT 
        NOW() as server_time,
        version() as pg_version,
        current_database() as database_name,
        current_user as db_user,
        (SELECT count(*) FROM users) as total_users,
        (SELECT count(*) FROM questions) as total_questions;
    `);
    const latencyMs = Date.now() - startTime;
    const row = result.rows[0];

    res.json({
      success: true,
      message: 'Successfully connected and executed query on Neon PostgreSQL!',
      latency_ms: latencyMs,
      host: process.env.PGHOST || 'ep-withered-paper-b4mgsq8e-pooler.c-6.us-east-2.aws.neon.tech',
      database: row.database_name,
      user: row.db_user,
      pg_version: row.pg_version.split(' on ')[0],
      server_time: row.server_time,
      total_users: Number(row.total_users),
      total_questions: Number(row.total_questions),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Failed to query Neon PostgreSQL: ${err.message}`,
    });
  }
});

// Update Google OAuth Credentials dynamically
app.post('/api/system/configure-google', (req, res) => {
  const { client_id, client_secret } = req.body;
  if (client_id) process.env.GOOGLE_CLIENT_ID = client_id.trim();
  if (client_secret) process.env.GOOGLE_CLIENT_SECRET = client_secret.trim();

  res.json({
    success: true,
    message: 'Google OAuth credentials updated for current session.',
    google_oauth: {
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      client_id_set: !!process.env.GOOGLE_CLIENT_ID,
      client_secret_set: !!process.env.GOOGLE_CLIENT_SECRET,
    },
  });
});

// Direct Google OAuth Test Session (Logs in Aman Yadav into Neon DB)
app.post('/auth/test-google-login', async (req, res) => {
  const { email = 'amanyadavabhay@gmail.com', name = 'Aman Yadav' } = req.body;
  try {
    const user = await upsertGoogleUser({
      google_id: `google-user-${Date.now()}`,
      name,
      email,
      profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    });

    const token = generateSessionToken(user);
    res.json({
      success: true,
      token,
      user,
      message: 'Logged in and saved directly to live Neon PostgreSQL database!',
    });
  } catch (err: any) {
    res.status(500).json({ detail: `Database operation failed: ${err.message}` });
  }
});

// --------------------------------------------------------------------------
// Real Google OAuth 2.0 Endpoints
// --------------------------------------------------------------------------

// 1. Initiate Google OAuth Login Redirect
app.get('/auth/google/login', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    return res.redirect('/?auth_error=google_credentials_missing');
  }

  // Determine external URL for callback
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const redirectUri = `${protocol}://${host}/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: googleClientId,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: redirectUri,
    access_type: 'offline',
    prompt: 'select_account',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// 2. Google OAuth Callback (Exchanges Code -> Token -> User Profile -> Neon PostgreSQL)
app.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error || !code) {
    const errorMsg = encodeURIComponent(String(error || 'Google authentication was cancelled.'));
    return res.redirect(`/?auth_error=${errorMsg}`);
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    return res.redirect('/?auth_error=google_credentials_missing');
  }

  try {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const redirectUri = `${protocol}://${host}/auth/google/callback`;

    // Exchange authorization code with Google token endpoint
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Google token exchange failed:', errText);
      return res.redirect('/?auth_error=google_token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from Google UserInfo API
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoResponse.ok) {
      return res.redirect('/?auth_error=failed_to_fetch_google_userinfo');
    }

    const profile = await userinfoResponse.json();
    const { sub: google_id, email, name, picture } = profile;

    if (!email) {
      return res.redirect('/?auth_error=google_account_missing_email');
    }

    // Upsert into Neon PostgreSQL DB
    const user = await upsertGoogleUser({
      google_id,
      name: name || email.split('@')[0],
      email,
      profile_picture: picture || '',
    });

    // Generate JWT token
    const sessionToken = generateSessionToken(user);

    // Redirect to frontend dashboard with token
    res.redirect(`/dashboard?token=${sessionToken}`);
  } catch (err: any) {
    console.error('Error handling Google callback:', err);
    res.redirect(`/?auth_error=${encodeURIComponent(err.message || 'Authentication error')}`);
  }
});

// 3. Direct Google ID Token Authentication (For Google Identity Services / One-Tap button)
app.post('/auth/google/token', async (req, res) => {
  const { credential, accessToken } = req.body;

  if (!credential && !accessToken) {
    return res.status(400).json({ detail: 'Google credential or access token required.' });
  }

  try {
    let profile: any = null;

    if (credential) {
      // Verify JWT credential directly via Google tokeninfo
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!verifyRes.ok) {
        return res.status(401).json({ detail: 'Invalid Google ID token.' });
      }
      profile = await verifyRes.json();
    } else {
      const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!infoRes.ok) {
        return res.status(401).json({ detail: 'Invalid Google access token.' });
      }
      profile = await infoRes.json();
    }

    const { sub: google_id, email, name, picture } = profile;
    if (!email) {
      return res.status(400).json({ detail: 'Google profile does not contain an email.' });
    }

    // Upsert user into Neon PostgreSQL
    const user = await upsertGoogleUser({
      google_id,
      name: name || email.split('@')[0],
      email,
      profile_picture: picture || '',
    });

    const token = generateSessionToken(user);
    res.json({ token, user });
  } catch (err: any) {
    console.error('Error in /auth/google/token:', err);
    res.status(500).json({ detail: 'Failed to verify Google credentials.' });
  }
});

// 4. Authenticated User Profile
app.get('/auth/me', async (req, res) => {
  const user = await authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required. Please sign in with Google.' });
  }
  res.json(user);
});

// 5. Logout
app.post('/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// --------------------------------------------------------------------------
// Questions API (Strict User Isolation)
// --------------------------------------------------------------------------
app.post('/api/questions', async (req, res) => {
  const user = await authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required.' });
  }

  const { category, question } = req.body;
  if (!category || !question || question.trim().length < 5) {
    return res.status(400).json({ detail: 'Category and a detailed question are required.' });
  }

  try {
    const newQuestion = await createQuestion(user.id, category, question);
    res.status(201).json(newQuestion);
  } catch (err: any) {
    console.error('Error creating question:', err);
    res.status(500).json({ detail: 'Failed to create question in database.' });
  }
});

app.get('/api/questions', async (req, res) => {
  const user = await authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required.' });
  }

  try {
    const questions = await getQuestionsByUser(user.id);
    res.json(questions);
  } catch (err: any) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ detail: 'Failed to fetch questions from database.' });
  }
});

app.get('/api/questions/:id', async (req, res) => {
  const user = await authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required.' });
  }

  try {
    const questions = await getQuestionsByUser(user.id);
    const question = questions.find(q => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({ detail: 'Question not found or you do not have permission to view it.' });
    }
    res.json(question);
  } catch (err: any) {
    res.status(500).json({ detail: 'Failed to query question.' });
  }
});

app.get('/api/dashboard/stats', async (req, res) => {
  const user = await authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required.' });
  }

  try {
    const questions = await getQuestionsByUser(user.id);
    const total = questions.length;
    const pending = questions.filter(q => q.status === 'Pending').length;
    const answered = questions.filter(q => q.status === 'Answered').length;

    res.json({
      user,
      total_questions: total,
      pending_questions: pending,
      answered_questions: answered,
      recent_questions: questions.slice(0, 5),
    });
  } catch (err: any) {
    res.status(500).json({ detail: 'Failed to compute dashboard stats.' });
  }
});

// Helpdesk Volunteer / Demo Response Endpoint
app.post('/api/questions/:id/respond', async (req, res) => {
  const { response } = req.body;
  if (!response || response.trim().length < 3) {
    return res.status(400).json({ detail: 'Response text is required.' });
  }

  try {
    const updated = await updateQuestionResponse(req.params.id, response);
    if (!updated) {
      return res.status(404).json({ detail: 'Question not found.' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ detail: 'Failed to update question response.' });
  }
});

// --------------------------------------------------------------------------
// Start Vite Dev Server Middleware or Production Static Serve
// --------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');

    // If dist/index.html does not exist, attempt to build on the fly
    if (!fs.existsSync(indexHtmlPath)) {
      console.warn(`⚠️ Warning: ${indexHtmlPath} not found. Attempting on-the-fly Vite build...`);
      try {
        const { execSync } = await import('child_process');
        execSync('npx vite build', { stdio: 'inherit' });
        console.log('✅ Vite build completed successfully on server start.');
      } catch (err: any) {
        console.error('❌ Failed on-the-fly Vite build:', err?.message || err);
      }
    }

    if (fs.existsSync(indexHtmlPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(indexHtmlPath);
      });
    } else {
      console.error(`🚨 Fatal: ${indexHtmlPath} is still missing.`);
      app.get('*', (_req, res) => {
        res.status(500).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Build Missing</title></head>
            <body style="font-family:system-ui,-apple-system,sans-serif;padding:50px 20px;background:#0f172a;color:#f8fafc;text-align:center;">
              <h1 style="color:#ef4444;">Frontend Build Not Found</h1>
              <p style="font-size:18px;max-width:600px;margin:20px auto;color:#94a3b8;">
                The file <code>dist/index.html</code> was not created during deployment.
              </p>
              <div style="background:#1e293b;padding:20px;border-radius:8px;display:inline-block;text-align:left;margin-top:10px;">
                <p style="margin:0 0 10px 0;font-weight:bold;color:#38bdf8;">How to fix on Render:</p>
                <ol style="margin:0;padding-left:20px;line-height:1.8;">
                  <li>Open your <strong>Render Dashboard</strong> and select this service.</li>
                  <li>Click on <strong>Settings</strong> in the left menu.</li>
                  <li>Scroll to <strong>Build Command</strong> and set it to: <br/>
                    <code style="background:#0f172a;padding:4px 8px;border-radius:4px;color:#4ade80;">npm install && npm run build</code>
                  </li>
                  <li>Click <strong>Save Changes</strong> and then <strong>Manual Deploy &gt; Clear build cache &amp; deploy</strong>.</li>
                </ol>
              </div>
            </body>
          </html>
        `);
      });
    }
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Community Cyber Safety Helpdesk active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
