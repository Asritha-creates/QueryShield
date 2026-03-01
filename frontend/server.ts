import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite for session history
const db = new Database(':memory:');
db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY,
    question TEXT,
    query_plan TEXT,
    timestamp INTEGER
  )
`);

// Mock connection state
let currentConnection = {
  isConnected: false,
  databaseName: null as string | null,
};

// API Routes
app.post('/api/create-connection', (req, res) => {
  const { uri, dbName } = req.body;
  if (!uri || !dbName) {
    return res.status(400).json({ success: false, message: 'URI and Database Name are required' });
  }

  // In a real app, you'd validate the connection here
  currentConnection = { isConnected: true, databaseName: dbName };
  res.json({ success: true, message: 'Connected successfully' });
});

app.post('/api/ai-query', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ success: false, message: 'Question is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a MongoDB expert. Generate a MongoDB query for the following natural language question: "${question}". 
      Return ONLY the query as a string that can be used in a Mongo shell or driver. 
      Assume a collection named 'data'. 
      Format: db.collection('data').find(...) or similar.`,
    });

    const queryPlan = response.text || 'db.data.find({})';
    
    // Mock data generation based on the query
    const mockData = [
      { _id: '1', name: 'Sample Item 1', status: 'active', value: 100 },
      { _id: '2', name: 'Sample Item 2', status: 'pending', value: 200 },
      { _id: '3', name: 'Sample Item 3', status: 'active', value: 150 },
    ];

    const id = Date.now().toString();
    db.prepare('INSERT INTO history (id, question, query_plan, timestamp) VALUES (?, ?, ?, ?)').run(
      id, question, queryPlan, Date.now()
    );

    res.json({
      success: true,
      queryPlan,
      data: mockData,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/history', (req, res) => {
  const history = db.prepare('SELECT * FROM history ORDER BY timestamp DESC').all();
  res.json({ history });
});

app.get('/api/download/csv', (req, res) => {
  const history = db.prepare('SELECT * FROM history ORDER BY timestamp DESC').all();
  const csv = [
    ['ID', 'Question', 'Query Plan', 'Timestamp'],
    ...history.map((h: any) => [h.id, h.question, h.query_plan, new Date(h.timestamp).toISOString()])
  ].map(row => row.join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=query_report.csv');
  res.send(csv);
});

app.post('/api/logout', (req, res) => {
  currentConnection = { isConnected: false, databaseName: null };
  res.json({ success: true });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
