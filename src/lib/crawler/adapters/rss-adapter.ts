// RSS feed adapter for news sources with RSS/Atom feeds
import Parser from "rss-parser";
import { BaseAdapter } from "./base-adapter";
import type { CrawledArticle } from "../types";

// Extended item type with media namespace support
interface MediaItem extends Parser.Item {
  "media:content"?: { $?: { url?: string } };
  "media:thumbnail"?: { $?: { url?: string } };
}

export class RSSAdapter extends BaseAdapter {
  private parser = new Parser<Record<string, unknown>, MediaItem>({
    customFields: {
      item: [
        ["media:content", "media:content"],
        ["media:thumbnail", "media:thumbnail"],
      ],
    },
  });

  async crawl(): Promise<CrawledArticle[]> {
    const feedUrl = this.config.rssUrl || this.config.url;
    const feed = await this.parser.parseURL(feedUrl);
    const maxArticles = this.config.maxArticles || 20;

    const articles: CrawledArticle[] = [];

    for (const item of feed.items.slice(0, maxArticles)) {
      let imageUrl = this.extractImage(item);

      // If no image found in RSS, try to fetch og:image from article page
      if (!imageUrl && item.link && this.config.fetchOgImage !== false) {
        imageUrl = await this.fetchOgImage(item.link);
      }

      articles.push({
        externalUrl: item.link || "",
        title: item.title || "Untitled",
        content: item.content || item.contentSnippet,
        summary: item.contentSnippet,
        imageUrl,
        author: item.creator,
        publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
      });
    }

    return articles;
  }

  /**
   * Extract image URL from RSS item
   * Checks media:content, media:thumbnail, enclosure, then content HTML
   */
  private extractImage(item: MediaItem): string | undefined {
    // Check media:content (common in WordPress feeds)
    const mediaContent = item["media:content"];
    if (mediaContent?.$?.url) return mediaContent.$.url;

    // Check media:thumbnail
    const mediaThumbnail = item["media:thumbnail"];
    if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;

    // Check enclosure (common in podcasts and media feeds)
    if (item.enclosure?.url) return item.enclosure.url;

    // Try to extract from content HTML
    const imgMatch = item.content?.match(/<img[^>]+src="([^"]+)"/);
    return imgMatch?.[1];
  }

  /**
   * Fetch og:image from article page
   */
  private async fetchOgImage(url: string): Promise<string | undefined> {
    try {
      const html = await this.fetch(url);
      // Try og:image
      const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
      if (ogMatch?.[1]) return ogMatch[1];
      // Try twitter:image
      const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
      return twitterMatch?.[1];
    } catch {
      return undefined;
    }
  }
}
