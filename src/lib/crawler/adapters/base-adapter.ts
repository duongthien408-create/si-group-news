// Base adapter class for all news source crawlers
import axios from "axios";
import type { CrawledArticle, SourceConfig } from "../types";
import { delay } from "../rate-limiter";

export abstract class BaseAdapter {
  protected config: SourceConfig;
  protected userAgent = "SINewsHub/1.0 (Immigration News Aggregator)";

  constructor(config: SourceConfig) {
    this.config = config;
  }

  /**
   * Crawl the news source and return articles
   * Must be implemented by each adapter type
   */
  abstract crawl(): Promise<CrawledArticle[]>;

  /**
   * Fetch URL content with rate limiting and proper headers
   */
  protected async fetch(url: string): Promise<string> {
    await delay(1000); // 1s between requests to be respectful
    const response = await axios.get(url, {
      headers: {
        "User-Agent": this.userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 30000,
    });
    return response.data;
  }

  /**
   * Extract domain from URL
   */
  protected extractDomain(url: string): string {
    return new URL(url).hostname;
  }

  /**
   * Resolve relative URL to absolute URL
   */
  protected resolveUrl(path: string, base: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return new URL(path, base).href;
  }
}
