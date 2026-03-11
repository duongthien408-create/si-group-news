// API endpoint to trigger news crawling
// Can be called by n8n webhook or manually
import { NextRequest, NextResponse } from "next/server";
import { CrawlerService } from "@/lib/crawler/crawler-service";

export async function POST(request: NextRequest) {
  // Simple auth check - in production use proper auth
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.CRAWL_API_KEY || "dev-key";

  if (authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const sourceId = body.sourceId as string | undefined;

    const crawler = new CrawlerService();

    if (sourceId) {
      // Crawl single source
      const result = await crawler.crawlSource(sourceId);
      return NextResponse.json(result);
    } else {
      // Crawl all sources
      const results = await crawler.crawlAll();
      const summary = {
        totalSources: results.length,
        successful: results.filter((r) => r.status === "completed").length,
        failed: results.filter((r) => r.status === "failed").length,
        totalNewArticles: results.reduce((sum, r) => sum + r.articlesNew, 0),
        results,
      };
      return NextResponse.json(summary);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "crawl/trigger",
    method: "POST with Bearer token",
  });
}
