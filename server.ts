import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent data directory
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'cyber_safety.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data for demonstration
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

function getInitialDB(): DatabaseSchema {
  return {
    users: [
      {
        id: 1,
        google_id: 'google-109482736152431',
        name: 'Aman Yadav',
        email: 'amanyadavabhay@gmail.com',
        profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        created_at: '2026-10-01T10:00:00.000Z',
      },
      {
        id: 2,
        google_id: 'google-109482736152432',
        name: 'Pooja Sharma',
        email: 'pooja.sharma@community.org',
        profile_picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
        created_at: '2026-10-02T11:30:00.000Z',
      },
    ],
    questions: [
      {
        id: 'CSH-2026-1042',
        user_id: 1,
        category: 'UPI & Payment Safety',
        question: 'Someone claiming to be a courier delivery executive called and sent me a QR code on WhatsApp, asking me to scan it and enter my UPI PIN to receive a parcel refund of ₹350. Is this safe?',
        status: 'Answered',
        response: '⚠️ NEVER scan a QR code or enter your UPI PIN to receive money! A UPI PIN is ONLY entered when paying/deducting money from your account, never to receive refunds. Block that phone number immediately and report it to the National Cyber Helpline (1930) or your bank if any deductions occurred.',
        created_at: '2026-10-02T14:15:00.000Z',
        updated_at: '2026-10-02T15:45:00.000Z',
      },
      {
        id: 'CSH-2026-1088',
        user_id: 1,
        category: 'Phishing',
        question: 'I received a message saying "Dear Customer, your electricity bill is unpaid. Electricity will be disconnected tonight. Call officer at 98xxxxxx or download VidyutBill.apk". Should I open it?',
        status: 'Answered',
        response: '⚠️ DO NOT download the .apk file or call that number. This is a very common electricity disconnection phishing scam. Fraudsters use APK files to install malware that reads your OTPs and steals banking credentials. Official power distribution companies never distribute APK links over SMS. Always pay through your official power utility portal or verified banking app.',
        created_at: '2026-10-03T09:20:00.000Z',
        updated_at: '2026-10-03T11:00:00.000Z',
      },
      {
        id: 'CSH-2026-1124',
        user_id: 1,
        category: 'Social Media Safety',
        question: 'My friend\'s Instagram account messaged me asking for an emergency loan via UPI, but the tone sounds completely different from how they usually talk. How can I verify before sending money?',
        status: 'Pending',
        response: null,
        created_at: '2026-10-05T16:40:00.000Z',
        updated_at: '2026-10-05T16:40:00.000Z',
      },
    ],
  };
}

function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  const initial = getInitialDB();
  saveDB(initial);
  return initial;
}

function saveDB(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// In-memory or cookie-based active session helper
function getUserFromToken(req: express.Request, db: DatabaseSchema): DBUser | null {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.query.token) {
    token = String(req.query.token);
  }

  if (!token) return null;

  try {
    // Basic decode of simulated or real token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const user = db.users.find(u => u.id === decoded.sub || u.email === decoded.email);
    return user || null;
  } catch {
    // If not base64 json, check if token matches user email or id
    const user = db.users.find(u => String(u.id) === token || u.email === token);
    return user || db.users[0] || null;
  }
}

function generateToken(user: DBUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + 7 * 24 * 3600 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Authentication Endpoints
app.get('/auth/google/login', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (googleClientId && process.env.GOOGLE_CLIENT_SECRET) {
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: googleClientId,
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: redirectUri,
      access_type: 'offline',
      prompt: 'select_account',
    });
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }
  // If not configured, redirect back with error parameter
  res.redirect('/?auth_error=google_credentials_not_configured');
});

app.get('/auth/google/callback', (req, res) => {
  const { code, error } = req.query;
  if (error || !code) {
    return res.redirect(`/?auth_error=${encodeURIComponent(String(error || 'Cancelled by user'))}`);
  }
  // In real deployment with keys, exchanges code here
  res.redirect('/dashboard');
});

// Demo Google Login endpoint for preview/testing
app.post('/auth/demo-login', (req, res) => {
  const { email, name, picture } = req.body;
  const userEmail = email || 'amanyadavabhay@gmail.com';
  const userName = name || 'Aman Yadav';
  const userPicture = picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80';

  const db = loadDB();
  let user = db.users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());

  if (!user) {
    user = {
      id: db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      google_id: `google-${Date.now()}`,
      name: userName,
      email: userEmail,
      profile_picture: userPicture,
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    saveDB(db);
  } else {
    user.name = userName;
    if (userPicture) user.profile_picture = userPicture;
    saveDB(db);
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_picture: user.profile_picture,
      created_at: user.created_at,
    },
  });
});

app.get('/auth/me', (req, res) => {
  const db = loadDB();
  const user = getUserFromToken(req, db);
  if (!user) {
    return res.status(401).json({ detail: 'Not authenticated. Please sign in.' });
  }
  res.json(user);
});

app.post('/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// Question API Endpoints
app.post('/api/questions', (req, res) => {
  const db = loadDB();
  const user = getUserFromToken(req, db);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required. Please sign in.' });
  }

  const { category, question } = req.body;
  if (!category || !question || question.trim().length < 5) {
    return res.status(400).json({ detail: 'Category and a detailed question are required.' });
  }

  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const refId = `CSH-${year}-${randomSuffix}`;

  const newQuestion: DBQuestion = {
    id: refId,
    user_id: user.id,
    category,
    question: question.trim(),
    status: 'Pending',
    response: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.questions.unshift(newQuestion);
  saveDB(db);

  res.status(201).json(newQuestion);
});

app.get('/api/questions', (req, res) => {
  const db = loadDB();
  const user = getUserFromToken(req, db);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required.' });
  }

  const myQuestions = db.questions.filter(q => q.user_id === user.id);
  res.json(myQuestions);
});

app.get('/api/questions/:id', (req, res) => {
  const db = loadDB();
  const user = getUserFromToken(req, db);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required.' });
  }

  const question = db.questions.find(q => q.id === req.params.id && q.user_id === user.id);
  if (!question) {
    return res.status(404).json({ detail: 'Question not found or you do not have permission to view it.' });
  }

  res.json(question);
});

app.get('/api/dashboard/stats', (req, res) => {
  const db = loadDB();
  const user = getUserFromToken(req, db);
  if (!user) {
    return res.status(401).json({ detail: 'Authentication required.' });
  }

  const myQuestions = db.questions.filter(q => q.user_id === user.id);
  const total = myQuestions.length;
  const pending = myQuestions.filter(q => q.status === 'Pending').length;
  const answered = myQuestions.filter(q => q.status === 'Answered').length;

  res.json({
    user,
    total_questions: total,
    pending_questions: pending,
    answered_questions: answered,
    recent_questions: myQuestions.slice(0, 5),
  });
});

// Volunteer / presentation answering endpoint
app.post('/api/questions/:id/respond', (req, res) => {
  const db = loadDB();
  const { response } = req.body;
  if (!response || response.trim().length < 3) {
    return res.status(400).json({ detail: 'Response text is required.' });
  }

  const question = db.questions.find(q => q.id === req.params.id);
  if (!question) {
    return res.status(404).json({ detail: 'Question not found.' });
  }

  question.response = response.trim();
  question.status = 'Answered';
  question.updated_at = new Date().toISOString();
  saveDB(db);

  res.json(question);
});

// Start Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Community Cyber Safety Helpdesk running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
