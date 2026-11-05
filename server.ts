import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MODULES } from './src/data/modulesData.js';
import { ALL_LESSONS, getLessonById, searchLessons } from './src/data/curriculum/index.js';
import { LABS } from './src/data/labsData.js';
import { CTF_CHALLENGES } from './src/data/ctfData.js';
import { INITIAL_SIEM_LOGS, SIEM_RULES } from './src/data/siemData.js';
import { IOC_DATABASE, MITRE_TECHNIQUES, THREAT_ACTORS } from './src/data/threatIntelData.js';
import { dockerService } from './src/server/dockerService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: configure FRONTEND_URL on Render with your exact Vercel origin.
// Multiple origins may be comma-separated. Local Vite origins are allowed only in development.
const configuredFrontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...configuredFrontendOrigins,
  ...(process.env.NODE_ENV !== 'production'
    ? ['http://localhost:5173', 'http://127.0.0.1:5173']
    : [])
]);

app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(origin && allowedOrigins.has(origin) ? 204 : 403);
  }

  next();
});

// In-memory SIEM logs storage on backend
let backendSiemLogs = [...INITIAL_SIEM_LOGS];

// ==========================================
// BACKEND REST API ENDPOINTS
// ==========================================

// 1. Health & Telemetry
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'CyberNexus Operational Cybersecurity Platform',
    version: '1.0.0',
    curriculum: {
      modulesCount: MODULES.length,
      totalLessons: ALL_LESSONS.length,
      labsCount: LABS.length,
      ctfCount: CTF_CHALLENGES.length
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. Curriculum Modules
app.get('/api/curriculum/modules', (req: Request, res: Response) => {
  res.json(MODULES);
});

// 3. Curriculum Lessons with Query Search & Pagination
app.get('/api/curriculum/lessons', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const modNum = req.query.module ? parseInt(req.query.module as string, 10) : undefined;
  const diff = (req.query.difficulty as string) || undefined;

  const results = searchLessons(query, modNum, diff);
  res.json({
    total: results.length,
    lessons: results
  });
});

// 4. Single Lesson Fetch
app.get('/api/curriculum/lessons/:id', (req: Request, res: Response) => {
  const lesson = getLessonById(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  res.json(lesson);
});

// 5. Cyber Labs Catalogue
app.get('/api/labs', (req: Request, res: Response) => {
  // Strip secret flags from public list
  const safeLabs = LABS.map(l => ({
    id: l.id,
    title: l.title,
    category: l.category,
    difficulty: l.difficulty,
    durationMinutes: l.durationMinutes,
    xpReward: l.xpReward,
    scenario: l.scenario,
    learningObjectives: l.learningObjectives,
    requirements: l.requirements,
    instructions: l.instructions,
    hints: l.hints
  }));
  res.json(safeLabs);
});

// 6. Cyber Lab Flag Verification on Backend
app.post('/api/labs/:id/verify', (req: Request, res: Response) => {
  const lab = LABS.find(l => l.id === req.params.id);
  if (!lab) {
    return res.status(404).json({ error: 'Lab not found' });
  }

  const { flag } = req.body;
  if (!flag) {
    return res.status(400).json({ error: 'Flag parameter required' });
  }

  const isCorrect = flag.trim() === lab.flag;
  if (isCorrect) {
    res.json({
      success: true,
      message: 'Proof flag verified successfully!',
      xpAwarded: lab.xpReward,
      explanation: lab.explanation
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid flag. Inspect terminal logs or check hints.'
    });
  }
});

// ==========================================
// DOCKER CONTAINER ENGINE PRACTICAL LAB API
// ==========================================

// Check Docker daemon availability and version
app.get('/api/docker/status', async (req: Request, res: Response) => {
  try {
    const status = await dockerService.checkStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({
      available: false,
      error: err.message || 'Failed to query Docker Engine status'
    });
  }
});

// Get current active Docker session for a lab
app.get('/api/docker/session/:labId', (req: Request, res: Response) => {
  const session = dockerService.getSession(req.params.labId);
  if (!session) {
    return res.json({ active: false, status: 'stopped' });
  }
  res.json({ active: true, ...session });
});

// Launch an isolated Docker container for a lab
app.post('/api/docker/launch', async (req: Request, res: Response) => {
  const { labId } = req.body;
  if (!labId) {
    return res.status(400).json({ error: 'Lab ID is required to launch container' });
  }

  try {
    const session = await dockerService.launchLab(labId);
    res.status(201).json({
      success: true,
      message: `Docker container started for lab ${labId}`,
      session
    });
  } catch (err: any) {
    res.status(503).json({
      success: false,
      error: err.message || 'Failed to start Docker container. Ensure Docker Desktop is running.'
    });
  }
});

// Stop and cleanly destroy a Docker container
app.post('/api/docker/stop', async (req: Request, res: Response) => {
  const { labId } = req.body;
  if (!labId) {
    return res.status(400).json({ error: 'Lab ID is required' });
  }

  try {
    const result = await dockerService.stopLab(labId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to stop Docker container'
    });
  }
});

// Execute terminal command inside the live Docker container
app.post('/api/docker/exec', async (req: Request, res: Response) => {
  const { labId, command } = req.body;
  if (!labId || typeof command !== 'string') {
    return res.status(400).json({ error: 'labId and command string are required' });
  }

  try {
    const execResult = await dockerService.executeCommand(labId, command);
    res.json(execResult);
  } catch (err: any) {
    res.status(400).json({
      stdout: '',
      stderr: err.message || 'Failed to execute command in Docker container',
      exitCode: 1
    });
  }
});

// 7. CTF Challenges
app.get('/api/ctf', (req: Request, res: Response) => {
  const safeChallenges = CTF_CHALLENGES.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    difficulty: c.difficulty,
    points: c.points,
    description: c.description,
    hints: c.hints,
    solvedCount: c.solvedCount,
    author: c.author
  }));
  res.json(safeChallenges);
});

// 8. CTF Flag Verification on Backend
app.post('/api/ctf/:id/submit', (req: Request, res: Response) => {
  const challenge = CTF_CHALLENGES.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  const { flag } = req.body;
  const isCorrect = flag && flag.trim() === challenge.flag;

  if (isCorrect) {
    res.json({
      success: true,
      message: 'Correct flag captured!',
      points: challenge.points,
      explanation: challenge.explanation
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Incorrect flag submission.'
    });
  }
});

// 9. SIEM Log Stream
app.get('/api/siem/logs', (req: Request, res: Response) => {
  const severity = req.query.severity as string;
  const action = req.query.action as string;

  let logs = backendSiemLogs;
  if (severity && severity !== 'All') {
    logs = logs.filter(l => l.severity === severity);
  }
  if (action && action !== 'All') {
    logs = logs.filter(l => l.action === action);
  }
  res.json(logs);
});

// 10. SIEM Event Ingestion
app.post('/api/siem/logs', (req: Request, res: Response) => {
  const newLog = {
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    sourceIp: req.body.sourceIp || '198.51.100.99',
    destIp: req.body.destIp || '10.0.1.80',
    port: req.body.port || 443,
    protocol: req.body.protocol || 'HTTPS',
    action: req.body.action || 'ALERT',
    severity: req.body.severity || 'High',
    signature: req.body.signature || 'Synthetic Security Alert Ingested',
    category: req.body.category || 'Intrusion',
    rawPayload: req.body.rawPayload || 'Simulated attack payload stream'
  };

  backendSiemLogs.unshift(newLog);
  res.status(201).json(newLog);
});

// 11. Threat Intelligence Lookups
app.get('/api/threat-intel/ioc', (req: Request, res: Response) => {
  const q = (req.query.q as string || '').toLowerCase();
  if (!q) return res.json(IOC_DATABASE);
  const matched = IOC_DATABASE.filter(ioc =>
    ioc.value.toLowerCase().includes(q) ||
    ioc.threatActor.toLowerCase().includes(q)
  );
  res.json(matched);
});

// 12. Direct Download of Full Source Code ZIP
app.get('/api/download/full-code-zip', (req: Request, res: Response) => {
  const zipPath = path.join(__dirname, 'public', 'cybernexus-full-code.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="cybernexus-full-code.zip"');
    const stream = fs.createReadStream(zipPath);
    stream.pipe(res);
  } else {
    res.status(404).json({ error: 'Zip archive not found on disk. Generate it via make-zip.' });
  }
});

// ==========================================
// VITE MIDDLEWARE (DEV) OR STATIC ASSETS (PROD)
// ==========================================
// ==========================================
// VITE MIDDLEWARE (LOCAL DEVELOPMENT ONLY)
// Production on Render runs API routes only.
// React frontend is deployed separately on Vercel.
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[CyberNexus API] Backend running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CyberNexus] Server failed to start:', err);
  process.exit(1);
});
