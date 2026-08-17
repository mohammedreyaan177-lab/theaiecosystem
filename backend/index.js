import express from 'express';
import cors from 'cors';
import { runNewsIngestion, getArticles, getArticleById } from './services/newsService.js';
import { runIntelligentProjectAnalysis } from './services/projectAnalysisEngine.js';
import { executeTool, TOOL_CAPABILITY_REGISTRY } from './services/toolExecutionEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend web clients
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'] : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Simple In-Memory Cache for Project Analysis Queries
const analysisCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

// Ingestion Lock to prevent concurrent execution runs
let isIngesting = false;

async function triggerIngestion() {
  if (isIngesting) {
    console.log('[NEWS] Ingestion already in progress, skipping trigger.');
    return;
  }
  isIngesting = true;
  try {
    await runNewsIngestion();
  } catch (err) {
    console.error('[NEWS] Scheduled ingestion error:', err.message);
  } finally {
    isIngesting = false;
  }
}

// REST API Endpoints

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    service: 'AIEcosystem Universal Tool Execution & Intelligence API Server',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      news: '/api/news',
      projectAnalysis: '/api/project-analysis',
      toolExecution: '/api/tools/execute',
      toolRegistry: '/api/tools/registry'
    }
  });
});

// Health check endpoint (for Render automated monitoring & uptime)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AIEcosystem API Server',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Universal Tool Execution Endpoint
app.post('/api/tools/execute', async (req, res) => {
  try {
    const { toolId, input, options } = req.body;
    if (!toolId || !input) {
      return res.status(400).json({ error: 'toolId and input parameters are required' });
    }

    console.log(`[TOOL EXECUTION] Executing Tool "${toolId}" with input: "${typeof input === 'string' ? input.slice(0, 40) : JSON.stringify(input).slice(0, 40)}..."`);
    const result = await executeTool(toolId, input, options);

    res.json(result);
  } catch (err) {
    console.error(`[API] POST /api/tools/execute error:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tool Capability Registry API
app.get('/api/tools/registry', (req, res) => {
  res.json({
    tools: Object.values(TOOL_CAPABILITY_REGISTRY),
    totalCount: Object.keys(TOOL_CAPABILITY_REGISTRY).length
  });
});

// Intelligent Project Analysis Endpoint
app.post('/api/project-analysis', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cleanPrompt = prompt.trim();
    const cacheKey = cleanPrompt.toLowerCase();

    // Check cache
    const cached = analysisCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      console.log(`[PROJECT ANALYSIS] Serving cached result for: "${cleanPrompt.slice(0, 40)}..."`);
      return res.json(cached.data);
    }

    console.log(`[PROJECT ANALYSIS] Analyzing prompt: "${cleanPrompt.slice(0, 50)}..."`);
    const report = await runIntelligentProjectAnalysis(cleanPrompt);

    // Save in cache
    analysisCache.set(cacheKey, { timestamp: Date.now(), data: report });

    res.json(report);
  } catch (err) {
    console.error('[API] POST /api/project-analysis error:', err.message);
    res.status(500).json({ error: 'Failed to complete project analysis', details: err.message });
  }
});

// Fetch paginated / incremental news
app.get('/api/news', (req, res) => {
  try {
    const { page = 1, limit = 20, category = 'all', after = null } = req.query;
    const data = getArticles({ page, limit, category, after });
    res.json(data);
  } catch (err) {
    console.error('[API] GET /api/news error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve news articles' });
  }
});

// Fetch latest single / top articles
app.get('/api/news/latest', (req, res) => {
  try {
    const data = getArticles({ page: 1, limit: 5 });
    res.json(data);
  } catch (err) {
    console.error('[API] GET /api/news/latest error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve latest news' });
  }
});

// Fetch category specific news
app.get('/api/news/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const data = getArticles({ page, limit, category });
    res.json(data);
  } catch (err) {
    console.error(`[API] GET /api/news/category/${req.params.category} error:`, err.message);
    res.status(500).json({ error: 'Failed to retrieve category news' });
  }
});

// Fetch single article by ID
app.get('/api/news/:id', (req, res) => {
  try {
    const article = getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error(`[API] GET /api/news/${req.params.id} error:`, err.message);
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
});

// Manual trigger news ingestion endpoint
app.post('/api/news/ingest', async (req, res) => {
  try {
    const result = await triggerIngestion();
    res.json({ message: 'Ingestion completed', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`[AIEcosystem Server] Express backend listening on port ${PORT}`);
  
  // Trigger initial news ingestion immediately on boot
  triggerIngestion();

  // Schedule background news ingestion every 10 minutes
  setInterval(() => {
    triggerIngestion();
  }, 10 * 60 * 1000);
});
