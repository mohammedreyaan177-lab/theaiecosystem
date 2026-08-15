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
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  return response.json();
}

export async function triggerNewsIngestion(): Promise<void> {
  try {
    await fetch(`${API_BASE}/ingest`, { method: 'POST' });
  } catch {
    // Ignore error, fallback to read query
  }
}

export async function fetchLatestNews(): Promise<NewsArticle[]> {
  const response = await fetch(`${API_BASE}/latest`);
  if (!response.ok) {
    throw new Error(`Failed to fetch latest news: ${response.statusText}`);
  }
  const data: NewsResponse = await response.json();
  return data.articles || [];
}
