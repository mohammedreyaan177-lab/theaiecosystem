import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'news.db');
const db = new Database(dbPath);

// Enable WAL mode for optimum performance and concurrency
db.pragma('journal_mode = WAL');

// Initialize schema with strict uniqueness constraints and indexes
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    normalizedTitle TEXT NOT NULL UNIQUE,
    description TEXT,
    url TEXT NOT NULL,
    canonicalUrl TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL,
    author TEXT,
    imageUrl TEXT,
    category TEXT NOT NULL DEFAULT 'all',
    publishedAt TEXT NOT NULL,
    fetchedAt TEXT NOT NULL,
    contentHash TEXT NOT NULL UNIQUE,
    createdAt INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_articles_publishedAt ON articles (publishedAt DESC);
  CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
  CREATE INDEX IF NOT EXISTS idx_articles_canonicalUrl ON articles (canonicalUrl);
  CREATE INDEX IF NOT EXISTS idx_articles_normalizedTitle ON articles (normalizedTitle);
  CREATE INDEX IF NOT EXISTS idx_articles_contentHash ON articles (contentHash);
`);

export default db;
