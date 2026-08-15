import { runNewsIngestion, getArticles } from '../services/newsService.js';

async function testLiveIngestion() {
  console.log('Testing live news ingestion from external RSS feeds & HackerNews API...');
  const result = await runNewsIngestion();
  console.log('Ingestion result:', result);

  const { articles, total } = getArticles({ page: 1, limit: 5 });
  console.log(`\nTotal articles in database: ${total}`);
  console.log('Sample top 5 articles stored in DB:');
  articles.forEach((a, i) => {
    console.log(`\n[${i + 1}] ${a.title}`);
    console.log(`    Source: ${a.source} | Published: ${a.publishedAt}`);
    console.log(`    Category: ${a.category} | URL: ${a.canonicalUrl}`);
  });
}

testLiveIngestion().catch(console.error);
