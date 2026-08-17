import { runIntelligentProjectAnalysis } from '../server/services/projectAnalysisEngine.js';

/**
 * Vercel Serverless Function: /api/project-analysis
 * Executes 9-stage technical evaluation on Vercel serverless environment.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Valid project prompt is required' });
    }

    const report = await runIntelligentProjectAnalysis(prompt);
    return res.status(200).json(report);
  } catch (err) {
    console.error('[Vercel Serverless] Project Analysis error:', err);
    return res.status(500).json({ error: err.message });
  }
}
