import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const app = express();
const PORT = 8055; // Matching Celesta Directus Backend Port!

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read database disk file
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db file", err);
    return { orgs: {}, users: [], session: null, docs: {}, versions: {}, analytics: {} };
  }
}

// Helper to write database disk file permanently
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing db file", err);
  }
}

// Healthcheck route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'DocuSphere Enterprise API Backend',
    port: PORT,
    database: 'Local File Persistence (server/database.json)',
    timestamp: new Date().toISOString()
  });
});

// Session routes
app.get('/api/session', (req, res) => {
  const db = readDB();
  res.json(db.session);
});

app.post('/api/session', (req, res) => {
  const { user, org } = req.body;
  const db = readDB();
  db.session = { user, org };
  writeDB(db);
  res.json(db.session);
});

// Organization routes
app.get('/api/orgs', (req, res) => {
  const db = readDB();
  res.json(Object.values(db.orgs));
});

app.post('/api/orgs', (req, res) => {
  const { user, org } = req.body;
  const db = readDB();
  
  db.orgs[org.id] = org;
  db.users.push(user);
  db.session = { user, org };
  if (!db.docs[org.id]) {
    db.docs[org.id] = [];
  }
  
  writeDB(db);
  res.json({ user, org });
});

// Document routes with strict multi-tenant org isolation
app.get('/api/orgs/:orgId/docs', (req, res) => {
  const { orgId } = req.params;
  const db = readDB();
  const docs = db.docs[orgId] || [];
  res.json(docs);
});

app.post('/api/orgs/:orgId/docs', (req, res) => {
  const { orgId } = req.params;
  const newDoc = req.body;
  const db = readDB();

  if (!db.docs[orgId]) {
    db.docs[orgId] = [];
  }

  const existingIndex = db.docs[orgId].findIndex(d => d.id === newDoc.id);
  if (existingIndex >= 0) {
    db.docs[orgId][existingIndex] = newDoc;
  } else {
    db.docs[orgId].unshift(newDoc);
  }

  writeDB(db);
  res.json(db.docs[orgId]);
});

app.delete('/api/orgs/:orgId/docs/:docId', (req, res) => {
  const { orgId, docId } = req.params;
  const db = readDB();

  if (db.docs[orgId]) {
    db.docs[orgId] = db.docs[orgId].filter(d => d.id !== docId);
    writeDB(db);
  }

  res.json({ success: true, docId });
});

// Version history routes
app.get('/api/docs/:docId/versions', (req, res) => {
  const { docId } = req.params;
  const db = readDB();
  res.json(db.versions[docId] || []);
});

app.post('/api/docs/:docId/versions', (req, res) => {
  const { docId } = req.params;
  const { title, content, updatedBy } = req.body;
  const db = readDB();

  if (!db.versions[docId]) {
    db.versions[docId] = [];
  }

  const newVer = {
    versionId: `v_${Date.now()}`,
    timestamp: new Date().toISOString(),
    updatedBy: updatedBy || 'System User',
    title,
    content
  };

  db.versions[docId].unshift(newVer);
  db.versions[docId] = db.versions[docId].slice(0, 10);
  writeDB(db);

  res.json(db.versions[docId]);
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 DocuSphere Backend API running on port ${PORT}`);
  console.log(`💾 Database file: ${DB_FILE}`);
  console.log(`====================================================`);
});
