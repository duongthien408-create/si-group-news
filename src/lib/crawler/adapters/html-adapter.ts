// HTML scraping adapter for news sources without RSS feeds
import * as cheerio from "cheerio";
import { BaseAdapter } from "./base-adapter";
import type { CrawledArticle } from "../types";

type CheerioRoot = ReturnType<typeof cheerio.load>;
type CheerioSelection = ReturnType<CheerioRoot>;

export class HTMLAdapter extends BaseAdapter {
  async crawl(): Promise<CrawledArticle[]> {
    const html = await this.fetch(this.config.url);
    const $ = cheerio.load(html);
    const articles: CrawledArticle[] = [];
    const maxArticles = this.config.maxArticles || 20;
    const selectors = this.config.selectors!;

    // Find article elements on the page
    const articleElements = $(selectors.articleList || "article").slice(
      0,
      maxArticles * 2 // Get more to filter out bad ones
    );

    for (const el of articleElements.toArray()) {
      if (articles.length >= maxArticles) break;

      const $article = $(el);

      // Try multiple strategies to find the link
      let href: string | undefined;
      let linkEl = $article.find(selectors.articleLink || "a").first();
      href = linkEl.attr("href");

      // Fallback: find any link in the article
      if (!href) {
        linkEl = $article.find("a[href]").first();
        href = linkEl.attr("href");
      }

      if (!href || href === "#" || href === "/") continue;

      const externalUrl = this.resolveUrl(href, this.config.url);

      // Skip if URL is the same as source (homepage link)
      if (externalUrl === this.config.url) continue;

      // Extract title using multiple strategies
      const title = this.extractTitle($article, selectors, linkEl);

      // Skip if no valid title found
      if (!title || title === "Untitled" || title.length < 5) continue;

      // Extract summary
      const summary = this.extractSummary($article, selectors);

      // Extract image
      const imageUrl = this.extractImage($article, selectors);

      const article: CrawledArticle = {
        externalUrl,
        title,
        summary,
        imageUrl: imageUrl ? this.resolveUrl(imageUrl, this.config.url) : undefined,
      };

      articles.push(article);
    }

    return articles;
  }

  /**
   * Extract title using multiple fallback strategies
   */
  private extractTitle(
    $article: CheerioSelection,
    selectors: NonNullable<typeof this.config.selectors>,
    linkEl: CheerioSelection
  ): string {
    // Strategy 1: Use title selector
    if (selectors.title) {
      const titleEl = $article.find(selectors.title).first();
      const text = titleEl.text().trim();
      if (text && text.length > 3) return text;
    }

    // Strategy 2: Get text from the link element itself
    const linkText = linkEl.text().trim();
    if (linkText && linkText.length > 3) return linkText;

    // Strategy 3: Find any heading in the article
    const headings = ["h1", "h2", "h3", "h4"];
    for (const h of headings) {
      const heading = $article.find(h).first().text().trim();
      if (heading && heading.length > 3) return heading;
    }

    // Strategy 4: Use link title attribute
    const titleAttr = linkEl.attr("title");
    if (titleAttr && titleAttr.length > 3) return titleAttr;

    // Strategy 5: Use aria-label
    const ariaLabel = linkEl.attr("aria-label");
    if (ariaLabel && ariaLabel.length > 3) return ariaLabel;

    return "Untitled";
  }

  /**
   * Extract summary/excerpt
   */
  private extractSummary(
    $article: CheerioSelection,
    selectors: NonNullable<typeof this.config.selectors>
  ): string | undefined {
    if (selectors.summary) {
      const summary = $article.find(selectors.summary).first().text().trim();
      if (summary && summary.length > 10) {
        // Limit summary length
        return summary.substring(0, 300);
      }
    }

    // Fallback: find first paragraph
    const p = $article.find("p").first().text().trim();
    if (p && p.length > 10) {
      return p.substring(0, 300);
    }

    return undefined;
  }

  /**
   * Extract image URL
   */
  private extractImage(
    $article: CheerioSelection,
    selectors: NonNullable<typeof this.config.selectors>
  ): string | undefined {
    // Try selector first
    if (selectors.image) {
      const img = $article.find(selectors.image).first();
      const src = img.attr("src") || img.attr("data-src") || img.attr("data-lazy-src");
      if (src && !src.includes("placeholder") && !src.includes("data:image")) {
        return src;
      }
    }

    // Fallback: find any image
    const img = $article.find("img").first();
    const src = img.attr("src") || img.attr("data-src");
    if (src && !src.includes("placeholder") && !src.includes("data:image") && !src.includes("avatar")) {
      return src;
    }

    return undefined;
  }
}
