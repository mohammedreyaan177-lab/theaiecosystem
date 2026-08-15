import express from 'express';
import cors from 'cors';
import { runNewsIngestion, getArticles, getArticleById } from './services/newsService.js';
import { runIntelligentProjectAnalysis } from './services/projectAnalysisEngine.js';
import { executeTool, TOOL_CAPABILITY_REGISTRY } from './services/toolExecutionEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AIEcosystem Universal Tool Execution & Intelligence API Server' });
});

// 2. Universal Tool Execution Endpoint
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

// 3. Tool Capability Registry API
app.get('/api/tools/registry', (req, res) => {
  res.json({
    tools: Object.values(TOOL_CAPABILITY_REGISTRY),
    totalCount: Object.keys(TOOL_CAPABILITY_REGISTRY).length
  });
});

// 4. Intelligent Project Analysis Endpoint
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

// 5. Fetch paginated / incremental news
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

// 6. Fetch latest single / top articles
app.get('/api/news/latest', (req, res) => {
  try {
    const data = getArticles({ page: 1, limit: 5 });
    res.json(data);
  } catch (err) {
    console.error('[API] GET /api/news/latest error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve latest news' });
  }
});

// 7. Fetch category specific news
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

// 8. Fetch single article by ID
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

// 9. Manual trigger news ingestion endpoint
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
  console.log(`[AIEcosystem Server] Express backend running on http://localhost:${PORT}`);
  
  // Trigger initial news ingestion immediately on backend boot
  triggerIngestion();

  // Schedule background news ingestion every 10 minutes (600,000 ms)
  setInterval(() => {
    triggerIngestion();
  }, 10 * 60 * 1000);
});
