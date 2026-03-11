// API endpoint to check crawl status and history
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface CrawlLogRow {
  id: string;
  source_id: string;
  started_at: string;
  completed_at: string | null;
  articles_found: number;
  articles_new: number;
  status: string;
  error_message: string | null;
  news_sources: {
    name: string;
    country: string;
  } | null;
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get recent crawl logs with source info
    const { data, error } = await supabase
      .from("crawl_logs")
      .select(
        `
        *,
        news_sources (name, country)
      `
      )
      .order("started_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const logs = data as unknown as CrawlLogRow[];

    // Calculate summary stats
    const last24h = logs?.filter((log) => {
      const logTime = new Date(log.started_at).getTime();
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return logTime > dayAgo;
    });

    const summary = {
      recentCrawls: logs?.length || 0,
      last24Hours: {
        total: last24h?.length || 0,
        successful: last24h?.filter((l) => l.status === "completed").length || 0,
        failed: last24h?.filter((l) => l.status === "failed").length || 0,
        articlesFound:
          last24h?.reduce((sum, l) => sum + (l.articles_found || 0), 0) || 0,
        articlesNew:
          last24h?.reduce((sum, l) => sum + (l.articles_new || 0), 0) || 0,
      },
    };

    return NextResponse.json({ summary, logs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
