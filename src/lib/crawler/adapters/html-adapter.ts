// HTML scraping adapter for news sources without RSS feeds
import * as cheerio from "cheerio";
import { BaseAdapter } from "./base-adapter";
import type { CrawledArticle } from "../types";

export class HTMLAdapter extends BaseAdapter {
  async crawl(): Promise<CrawledArticle[]> {
    const html = await this.fetch(this.config.url);
    const $ = cheerio.load(html);
    const articles: CrawledArticle[] = [];
    const maxArticles = this.config.maxArticles || 20;
    const selectors = this.config.selectors!;

    // Find article elements on the page
    const articleElements = $(
      selectors.articleList || "article"
    ).slice(0, maxArticles);

    for (const el of articleElements.toArray()) {
      const $article = $(el);
      const linkEl = $article.find(selectors.articleLink || "a").first();
      const href = linkEl.attr("href");

      if (!href) continue;

      const externalUrl = this.resolveUrl(href, this.config.url);

      // Extract basic info from list page
      const article: CrawledArticle = {
        externalUrl,
        title:
          $article
            .find(selectors.title || "h2, h3")
            .first()
            .text()
            .trim() || "Untitled",
        summary: $article
          .find(selectors.summary || "p")
          .first()
          .text()
          .trim(),
        imageUrl: this.resolveUrl(
          $article.find(selectors.image || "img").first().attr("src") || "",
          this.config.url
        ),
      };

      // Optionally fetch full article content
      if (selectors.content) {
        try {
          const detailHtml = await this.fetch(externalUrl);
          const $detail = cheerio.load(detailHtml);
          article.content = $detail(selectors.content).text().trim();
          article.author = $detail(selectors.author || ".author")
            .text()
            .trim();

          const dateText =
            $detail(selectors.date || "time").attr("datetime") ||
            $detail(selectors.date || "time").text();
          if (dateText) {
            article.publishedAt = new Date(dateText);
          }
        } catch (err) {
          console.error(`Failed to fetch article detail: ${externalUrl}`, err);
        }
      }

      articles.push(article);
    }

    return articles;
  }
}
