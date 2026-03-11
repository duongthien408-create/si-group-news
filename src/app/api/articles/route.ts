// API endpoint to fetch articles with filters
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ArticleRow {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  external_url: string;
  author: string | null;
  published_at: string | null;
  crawled_at: string;
  news_sources: {
    id: string;
    name: string;
    country: string;
    url: string;
  } | null;
  article_translations: Array<{
    title_vi: string;
    summary_vi: string | null;
    content_vi: string | null;
  }> | null;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const country = searchParams.get("country");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const lang = searchParams.get("lang") || "en"; // en or vi

    // Build query
    let query = supabase
      .from("articles")
      .select(
        `
        *,
        news_sources (id, name, country, url),
        article_translations (title_vi, summary_vi, content_vi)
      `,
        { count: "exact" }
      )
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("crawled_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by country if specified
    if (country && country !== "all") {
      query = query.eq("news_sources.country", country);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const articles = data as unknown as ArticleRow[];

    // Transform based on language preference
    const transformed = articles?.map((article) => {
      const translation = article.article_translations?.[0];
      const useVietnamese = lang === "vi" && translation;

      return {
        id: article.id,
        title: useVietnamese ? translation.title_vi : article.title,
        summary: useVietnamese ? translation.summary_vi : article.summary,
        content: useVietnamese ? translation.content_vi : article.content,
        imageUrl: article.image_url,
        externalUrl: article.external_url,
        author: article.author,
        publishedAt: article.published_at,
        crawledAt: article.crawled_at,
        isTranslated: !!translation,
        source: article.news_sources,
      };
    });

    return NextResponse.json({
      articles: transformed,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
