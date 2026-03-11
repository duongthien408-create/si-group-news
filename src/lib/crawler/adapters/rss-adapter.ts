// RSS feed adapter for news sources with RSS/Atom feeds
import Parser from "rss-parser";
import { BaseAdapter } from "./base-adapter";
import type { CrawledArticle } from "../types";

export class RSSAdapter extends BaseAdapter {
  private parser = new Parser();

  async crawl(): Promise<CrawledArticle[]> {
    const feedUrl = this.config.rssUrl || this.config.url;
    const feed = await this.parser.parseURL(feedUrl);
    const maxArticles = this.config.maxArticles || 20;

    return feed.items.slice(0, maxArticles).map((item) => ({
      externalUrl: item.link || "",
      title: item.title || "Untitled",
      content: item.content || item.contentSnippet,
      summary: item.contentSnippet,
      imageUrl: this.extractImage(item),
      author: item.creator || item.author,
      publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
    }));
  }

  /**
   * Extract image URL from RSS item
   * Checks enclosure first, then tries to parse from content
   */
  private extractImage(item: Parser.Item): string | undefined {
    // Check enclosure (common in podcasts and media feeds)
    if (item.enclosure?.url) return item.enclosure.url;

    // Try to extract from content HTML
    const imgMatch = item.content?.match(/<img[^>]+src="([^"]+)"/);
    return imgMatch?.[1];
  }
}
