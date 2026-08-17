import { runIntelligentProjectAnalysis } from '../server/services/projectAnalysisEngine.js';

/**
 * Vercel Serverless Function: /api/project-analysis
 * Executes 9-stage technical evaluation on Vercel serverless environment.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let prompt = '';
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        prompt = parsed.prompt || parsed.userPrompt || '';
      } catch {
        prompt = req.body;
      }
    } else if (req.body && typeof req.body === 'object') {
      prompt = req.body.prompt || req.body.userPrompt || '';
    } else if (req.query && req.query.prompt) {
      prompt = req.query.prompt;
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      prompt = 'AI SaaS Application Platform';
    }

    const report = await runIntelligentProjectAnalysis(prompt);
    return res.status(200).json(report);
  } catch (err) {
    console.error('[Vercel Serverless] Project Analysis error:', err);
    return res.status(500).json({ error: err.message });
  }
}
