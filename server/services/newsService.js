import crypto from 'crypto';
import Parser from 'rss-parser';
import db from '../db.js';

const parser = new Parser({
  headers: {
    'User-Agent': 'AIEcosystemNewsBot/1.0 (+https://aiecosystem.io)'
  },
  timeout: 10000
});

/**
 * Level 2 Deduplication: Canonicalize URL by stripping tracking params
 */
export function getCanonicalUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl);
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'fbclid', 'gclid', 'ref', 's', 'source', 'feature', 'ncid', 'mkt_tok'
    ];
    
    trackingParams.forEach(param => parsed.searchParams.delete(param));
    
    // Sort remaining parameters for strict equivalence
    parsed.searchParams.sort();
    
    // Remove trailing slash from pathname if present
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${parsed.port ? ':' + parsed.port : ''}${pathname}${parsed.search}`;
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}

/**
 * Level 3 Deduplication: Normalize Title
 */
export function getNormalizedTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    // Strip common publication suffixes
    .replace(/\s*([|:\-–—]\s*(techcrunch|venturebeat|hacker news|google ai|openai|anthropic|hugging face|youtube|wired|the verge|mit technology review)).*$/gi, '')
    // Replace punctuation with space
    .replace(/[^\w\s]/gi, ' ')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Level 4 Deduplication: Generate stable Content Hash
 */
export function getContentHash(normalizedTitle, description = '') {
  const normDesc = (description || '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
    
  return crypto
    .createHash('sha256')
    .update(`${normalizedTitle}|${normDesc}`)
    .digest('hex');
}

/**
 * Level 5 Deduplication: Headline Token Jaccard Similarity Detection
 */
export function isSimilarStory(normalizedTitle, existingTitles, threshold = 0.72) {
  const getTokens = (t) => new Set(t.split(' ').filter(word => word.length > 3));
  const tokensA = getTokens(normalizedTitle);
  
  if (tokensA.size === 0) return false;

  for (const existing of existingTitles) {
    const tokensB = getTokens(existing);
    if (tokensB.size === 0) continue;

    let intersection = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) intersection++;
    }

    const union = new Set([...tokensA, ...tokensB]).size;
    const similarity = intersection / union;

    if (similarity >= threshold) {
      return true;
    }
  }
  return false;
}

/**
 * Maps raw article metadata to AI Ecosystem Categories
 */
function detectCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('agent') || text.includes('autonomous') || text.includes('crewai') || text.includes('autogen')) return 'AI Agents';
  if (text.includes('open source') || text.includes('weights') || text.includes('github') || text.includes('hugging face')) return 'Open Source';
  if (text.includes('model') || text.includes('deepseek') || text.includes('claude') || text.includes('gemini') || text.includes('gpt-4') || text.includes('llama') || text.includes('mistral')) return 'Models';
  if (text.includes('chip') || text.includes('nvidia') || text.includes('gpu') || text.includes('groq') || text.includes('tpu') || text.includes('semiconductor')) return 'Hardware';
  if (text.includes('funding') || text.includes('raised') || text.includes('series a') || text.includes('valuation') || text.includes('billion')) return 'Funding';
  if (text.includes('research') || text.includes('paper') || text.includes('arxiv') || text.includes('benchmark') || text.includes('reasoning')) return 'Research';
  if (text.includes('sdk') || text.includes('api') || text.includes('code') || text.includes('developer') || text.includes('compiler') || text.includes('cursor')) return 'Developer Tools';
  if (text.includes('regulation') || text.includes('policy') || text.includes('law') || text.includes('copyright') || text.includes('safety')) return 'Regulation';
  if (text.includes('startup') || text.includes('launch') || text.includes('stealth')) return 'Startups';
  
  return 'Companies';
}

/**
 * Fetch articles from real external sources (HackerNews Algolia API + RSS feeds)
 */
async function fetchExternalArticles() {
  const rawArticles = [];

  // 1. Fetch from HackerNews Algolia Real-time AI Search API
  try {
    const hnRes = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&query=AI%20OR%20LLM%20OR%20OpenAI%20OR%20Claude%20OR%20DeepSeek%20OR%20Gemini&hitsPerPage=25');
    if (hnRes.ok) {
      const hnData = await hnRes.json();
      if (Array.isArray(hnData.hits)) {
        hnData.hits.forEach(hit => {
          if (hit.title && (hit.url || hit.objectID)) {
            rawArticles.push({
              title: hit.title,
              url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
              description: hit.comment_text || `HackerNews discussion with ${hit.points || 0} points and ${hit.num_comments || 0} comments.`,
              source: 'HackerNews AI',
              author: hit.author || 'HackerNews',
              publishedAt: hit.created_at ? new Date(hit.created_at).toISOString() : new Date().toISOString()
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn('[NEWS] HackerNews Algolia fetch warning:', err.message);
  }

  // 2. Fetch from curated RSS Feeds
  const rssFeeds = [
    { url: 'https://news.google.com/rss/search?q=Artificial+Intelligence+OR+OpenAI+OR+Gemini+OR+Claude+OR+DeepSeek&hl=en-US&gl=US&ceid=US:en', name: 'Google News AI' },
    { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch AI' },
    { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat AI' },
    { url: 'https://huggingface.co/blog/feed.xml', name: 'Hugging Face Blog' },
    { url: 'https://blog.google/technology/ai/rss/', name: 'Google AI Blog' },
    { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', name: 'The Verge AI' },
    { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/', name: 'MIT Tech Review AI' }
  ];

  for (const feed of rssFeeds) {
    try {
      const feedData = await parser.parseURL(feed.url);
      if (Array.isArray(feedData.items)) {
        feedData.items.forEach(item => {
          if (item.title && (item.link || item.guid)) {
            rawArticles.push({
              title: item.title,
              url: item.link || item.guid,
              description: item.contentSnippet || item.summary || item.title,
              source: feed.name,
              author: item.creator || item.author || feed.name,
              publishedAt: item.isoDate || item.pubDate ? new Date(item.isoDate || item.pubDate).toISOString() : new Date().toISOString()
            });
          }
        });
      }
    } catch (err) {
      console.warn(`[NEWS] RSS fetch warning for ${feed.name}:`, err.message);
    }
  }

  return rawArticles;
}

/**
 * Execute the complete Ingestion Pipeline:
 * Fetch -> Validate -> Normalize -> Deduplicate (5 levels) -> Store (Database)
 */
export async function runNewsIngestion() {
  console.log('[NEWS] Fetching latest articles from external sources...');
  const fetchedAt = new Date().toISOString();
  
  let rawArticles = [];
  try {
    rawArticles = await fetchExternalArticles();
    console.log(`[NEWS] Provider returned ${rawArticles.length} raw articles`);
  } catch (err) {
    console.error('[NEWS] Provider request failed:', err.message);
    return { storedCount: 0, skippedDuplicatesCount: 0, error: err.message };
  }

  if (rawArticles.length === 0) {
    console.log('[NEWS] 0 articles returned from external sources');
    return { storedCount: 0, skippedDuplicatesCount: 0 };
  }

  // Fetch recent normalized titles for Level 5 Similar Story Detection
  const recentRows = db.prepare(`
    SELECT normalizedTitle FROM articles 
    WHERE createdAt >= ?
  `).all(Date.now() - 48 * 60 * 60 * 1000);
  
  const existingRecentTitles = recentRows.map(r => r.normalizedTitle);

  let storedCount = 0;
  let skippedDuplicatesCount = 0;

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO articles (
      id, title, normalizedTitle, description, url, canonicalUrl, 
      source, author, imageUrl, category, publishedAt, fetchedAt, contentHash, createdAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const checkExactCanonical = db.prepare(`SELECT id FROM articles WHERE canonicalUrl = ? OR url = ?`);
  const checkExactNormalizedTitle = db.prepare(`SELECT id FROM articles WHERE normalizedTitle = ?`);
  const checkExactContentHash = db.prepare(`SELECT id FROM articles WHERE contentHash = ?`);

  const transaction = db.transaction((articlesToProcess) => {
    for (const raw of articlesToProcess) {
      if (!raw.title || !raw.url) {
        skippedDuplicatesCount++;
        continue;
      }

      const canonicalUrl = getCanonicalUrl(raw.url);
      const normalizedTitle = getNormalizedTitle(raw.title);

      if (!canonicalUrl || !normalizedTitle) {
        skippedDuplicatesCount++;
        continue;
      }

      const contentHash = getContentHash(normalizedTitle, raw.description);

      // Level 1 & Level 2 Deduplication Check
      const existingCanonical = checkExactCanonical.get(canonicalUrl, raw.url);
      if (existingCanonical) {
        skippedDuplicatesCount++;
        continue;
      }

      // Level 3 Deduplication Check
      const existingTitle = checkExactNormalizedTitle.get(normalizedTitle);
      if (existingTitle) {
        skippedDuplicatesCount++;
        continue;
      }

      // Level 4 Deduplication Check
      const existingHash = checkExactContentHash.get(contentHash);
      if (existingHash) {
        skippedDuplicatesCount++;
        continue;
      }

      // Level 5 Similar Story Detection Check
      if (isSimilarStory(normalizedTitle, existingRecentTitles)) {
        skippedDuplicatesCount++;
        continue;
      }

      const articleId = `art_${crypto.randomBytes(8).toString('hex')}`;
      const category = detectCategory(raw.title, raw.description);
      const createdAt = Date.now();

      const safeTitle = String(raw.title || '').trim();
      const safeUrl = String(raw.url || '').trim();
      const safeDesc = String(raw.description || raw.title || '').slice(0, 500).trim();
      const safeSource = String(typeof raw.source === 'string' ? raw.source : raw.source?.name || 'AI News Source').trim();
      const safeAuthor = String(typeof raw.author === 'string' ? raw.author : raw.author?.name || 'Staff').trim();
      const safeImageUrl = typeof raw.imageUrl === 'string' ? raw.imageUrl : null;
      const safePublishedAt = typeof raw.publishedAt === 'string' ? raw.publishedAt : fetchedAt;

      const result = insertStmt.run(
        articleId,
        safeTitle,
        normalizedTitle,
        safeDesc,
        safeUrl,
        canonicalUrl,
        safeSource,
        safeAuthor,
        safeImageUrl,
        category,
        safePublishedAt,
        fetchedAt,
        contentHash,
        createdAt
      );

      if (result.changes > 0) {
        storedCount++;
        existingRecentTitles.push(normalizedTitle);
      } else {
        skippedDuplicatesCount++;
      }
    }
  });

  try {
    transaction(rawArticles);
    console.log(`[NEWS] ${storedCount} new articles stored | ${skippedDuplicatesCount} duplicates skipped`);
    return { storedCount, skippedDuplicatesCount };
  } catch (err) {
    console.error('[NEWS] Database insertion transaction failed:', err.message);
    return { storedCount, skippedDuplicatesCount, error: err.message };
  }
}

/**
 * Retrieve paginated, sorted, filtered articles from Database
 */
export function getArticles({ page = 1, limit = 20, category = 'all', after = null }) {
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));

  let whereClauses = [];
  let params = [];

  if (category && category !== 'all') {
    whereClauses.push('category = ?');
    params.push(category);
  }

  if (after) {
    whereClauses.push('publishedAt > ?');
    params.push(after);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const totalStmt = db.prepare(`SELECT COUNT(*) as count FROM articles ${whereSql}`);
  const total = totalStmt.get(...params).count;

  const querySql = `
    SELECT * FROM articles 
    ${whereSql} 
    ORDER BY publishedAt DESC, createdAt DESC 
    LIMIT ? OFFSET ?
  `;

  const articles = db.prepare(querySql).all(...params, parsedLimit, offset);

  const latestRow = db.prepare(`SELECT publishedAt FROM articles ORDER BY publishedAt DESC LIMIT 1`).get();
  const latestPublishedAt = latestRow ? latestRow.publishedAt : null;

  return {
    articles,
    total,
    page: parseInt(page, 10),
    limit: parsedLimit,
    hasMore: offset + articles.length < total,
    latestPublishedAt
  };
}

/**
 * Retrieve single article by ID
 */
export function getArticleById(id) {
  return db.prepare(`SELECT * FROM articles WHERE id = ?`).get(id) || null;
}
