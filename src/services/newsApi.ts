export interface NewsArticle {
  id: string;
  title: string;
  normalizedTitle: string;
  description: string;
  url: string;
  canonicalUrl: string;
  source: string;
  author?: string;
  imageUrl?: string;
  category: string;
  publishedAt: string;
  fetchedAt: string;
  contentHash: string;
  createdAt: number;
}

export interface NewsResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  latestPublishedAt: string | null;
}

const API_BASE = import.meta.env.VITE_AI_NEWS_API_URL || '/api/news';

/**
 * Live Browser Fallback for Vercel Static Hosting & Client-Only Environments
 */
async function fetchLiveNewsFallback(category = 'all'): Promise<NewsResponse> {
  console.log('[News Client Fallback] Querying live HackerNews Algolia Search API directly...');
  const res = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&query=AI%20OR%20LLM%20OR%20OpenAI%20OR%20Claude%20OR%20DeepSeek%20OR%20Gemini&hitsPerPage=30');
  
  if (!res.ok) {
    throw new Error(`Live search API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  let articles: NewsArticle[] = (data.hits || [])
    .filter((h: any) => h.title)
    .map((hit: any, idx: number) => {
      const text = (hit.title + ' ' + (hit.comment_text || '')).toLowerCase();
      let cat = 'Companies';
      if (text.includes('agent') || text.includes('autonomous')) cat = 'AI Agents';
      else if (text.includes('open source') || text.includes('weights') || text.includes('github')) cat = 'Open Source';
      else if (text.includes('model') || text.includes('deepseek') || text.includes('claude') || text.includes('gemini') || text.includes('gpt-4')) cat = 'Models';
      else if (text.includes('chip') || text.includes('nvidia') || text.includes('gpu')) cat = 'Hardware';
      else if (text.includes('funding') || text.includes('raised') || text.includes('billion')) cat = 'Funding';
      else if (text.includes('research') || text.includes('paper') || text.includes('arxiv')) cat = 'Research';
      else if (text.includes('sdk') || text.includes('api') || text.includes('code') || text.includes('cursor')) cat = 'Developer Tools';

      return {
        id: `hn_live_${hit.objectID || idx}`,
        title: hit.title,
        normalizedTitle: hit.title.toLowerCase(),
        description: hit.comment_text ? hit.comment_text.slice(0, 300) : `HackerNews live AI discussion with ${hit.points || 0} points.`,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        canonicalUrl: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        source: 'HackerNews AI',
        author: hit.author || 'HackerNews',
        category: cat,
        publishedAt: hit.created_at || new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        contentHash: `hash_${hit.objectID || idx}`,
        createdAt: Date.now()
      };
    });

  if (category && category !== 'all') {
    const c = category.toLowerCase();
    articles = articles.filter(a => a.category.toLowerCase().includes(c) || c.includes(a.category.toLowerCase()));
  }

  return {
    articles,
    total: articles.length,
    page: 1,
    limit: 30,
    hasMore: false,
    latestPublishedAt: articles.length > 0 ? articles[0].publishedAt : new Date().toISOString()
  };
}

export async function fetchNewsArticles(params: {
  page?: number;
  limit?: number;
  category?: string;
  after?: string | null;
} = {}): Promise<NewsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.after) query.append('after', params.after);

  const url = `${API_BASE}?${query.toString()}`;
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    
    // Check if response is valid JSON (if response is HTML from Vercel fallback rewrite, throw to hit fallback)
    if (!response.ok || !contentType.includes('application/json')) {
      throw new Error(`API endpoint unavailable or returned HTML fallback`);
    }

    return await response.json();
  } catch (err) {
    console.warn('[News API] Server API unavailable, executing live browser fallback:', err);
    return await fetchLiveNewsFallback(params.category);
  }
}

export async function triggerNewsIngestion(): Promise<void> {
  try {
    await fetch(`${API_BASE}/ingest`, { method: 'POST' });
  } catch {
    // Ignore error, fallback to read query
  }
}

export async function fetchLatestNews(): Promise<NewsArticle[]> {
  try {
    const data = await fetchNewsArticles();
    return data.articles || [];
  } catch {
    return [];
  }
}
