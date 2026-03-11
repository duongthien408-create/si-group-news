// Crawler type definitions for SI News Hub

export interface CrawledArticle {
  externalUrl: string;
  title: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: Date;
}

export interface SourceConfig {
  id: string;
  url: string;
  type: "rss" | "html" | "api";
  selectors?: {
    articleList?: string;
    articleLink?: string;
    title?: string;
    content?: string;
    summary?: string;
    image?: string;
    author?: string;
    date?: string;
  };
  rssUrl?: string;
  maxArticles?: number;
}

export interface CrawlResult {
  sourceId: string;
  articlesFound: number;
  articlesNew: number;
  status: "completed" | "failed";
  error?: string;
  duration: number;
}
