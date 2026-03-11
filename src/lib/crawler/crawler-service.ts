// Main crawler service - orchestrates crawling across all sources
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { RSSAdapter, HTMLAdapter } from "./adapters";
import { sourceConfigs } from "./source-configs";
import type { CrawledArticle, CrawlResult, SourceConfig } from "./types";

export class CrawlerService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Crawl a single news source
   */
  async crawlSource(sourceId: string): Promise<CrawlResult> {
    const startTime = Date.now();
    const config = sourceConfigs[sourceId];

    if (!config) {
      return {
        sourceId,
        articlesFound: 0,
        articlesNew: 0,
        status: "failed",
        error: `Unknown source: ${sourceId}`,
        duration: Date.now() - startTime,
      };
    }

    // Get source UUID from database
    const { data: dbSource } = await this.supabase
      .from("news_sources")
      .select("id")
      .ilike("url", `%${this.extractDomain(config.url)}%`)
      .single();

    if (!dbSource) {
      return {
        sourceId,
        articlesFound: 0,
        articlesNew: 0,
        status: "failed",
        error: `Source not found in database: ${sourceId}`,
        duration: Date.now() - startTime,
      };
    }

    // Create crawl log
    const { data: log } = await this.supabase
      .from("crawl_logs")
      .insert({ source_id: dbSource.id, status: "running" })
      .select()
      .single();

    try {
      // Get adapter and crawl
      const adapter = this.getAdapter(config);
      const articles = await adapter.crawl();

      // Deduplicate and insert
      const newArticles = await this.deduplicateAndInsert(
        dbSource.id,
        articles
      );

      // Update source last_crawled_at
      await this.supabase
        .from("news_sources")
        .update({ last_crawled_at: new Date().toISOString() })
        .eq("id", dbSource.id);

      // Update crawl log
      await this.supabase
        .from("crawl_logs")
        .update({
          completed_at: new Date().toISOString(),
          articles_found: articles.length,
          articles_new: newArticles,
          status: "completed",
        })
        .eq("id", log?.id);

      return {
        sourceId,
        articlesFound: articles.length,
        articlesNew: newArticles,
        status: "completed",
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await this.supabase
        .from("crawl_logs")
        .update({
          completed_at: new Date().toISOString(),
          status: "failed",
          error_message: errorMessage,
        })
        .eq("id", log?.id);

      return {
        sourceId,
        articlesFound: 0,
        articlesNew: 0,
        status: "failed",
        error: errorMessage,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Crawl all configured sources sequentially
   */
  async crawlAll(): Promise<CrawlResult[]> {
    const results: CrawlResult[] = [];

    for (const sourceId of Object.keys(sourceConfigs)) {
      console.log(`Crawling ${sourceId}...`);
      const result = await this.crawlSource(sourceId);
      results.push(result);
      console.log(
        `${sourceId}: ${result.status} - ${result.articlesNew} new articles`
      );
    }

    return results;
  }

  /**
   * Get appropriate adapter based on source type
   */
  private getAdapter(config: SourceConfig) {
    switch (config.type) {
      case "rss":
        return new RSSAdapter(config);
      case "html":
        return new HTMLAdapter(config);
      default:
        throw new Error(`Unsupported adapter type: ${config.type}`);
    }
  }

  /**
   * Check for duplicates and insert new articles
   */
  private async deduplicateAndInsert(
    sourceId: string,
    articles: CrawledArticle[]
  ): Promise<number> {
    let newCount = 0;

    for (const article of articles) {
      if (!article.externalUrl) continue;

      // Check if article already exists by URL
      const { data: existing } = await this.supabase
        .from("articles")
        .select("id")
        .eq("external_url", article.externalUrl)
        .single();

      if (!existing) {
        const { error } = await this.supabase.from("articles").insert({
          source_id: sourceId,
          external_url: article.externalUrl,
          title: article.title,
          content: article.content || null,
          summary: article.summary || null,
          image_url: article.imageUrl || null,
          author: article.author || null,
          published_at: article.publishedAt?.toISOString() || null,
        });

        if (!error) newCount++;
      }
    }

    return newCount;
  }

  /**
   * Extract domain from URL for matching
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  }
}
