// Database types for SI News Hub
// Run `npx supabase gen types typescript --project-id YOUR_ID > src/lib/supabase/types.ts` to regenerate

export type CountryEnum =
  | "usa"
  | "australia"
  | "canada"
  | "europe"
  | "new_zealand"
  | "malta"
  | "generic";

export interface Database {
  public: {
    Tables: {
      news_sources: {
        Row: {
          id: string;
          country: CountryEnum;
          url: string;
          name: string;
          notes: string | null;
          is_active: boolean;
          crawl_selector: Record<string, unknown> | null;
          last_crawled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          country: CountryEnum;
          url: string;
          name: string;
          notes?: string | null;
          is_active?: boolean;
          crawl_selector?: Record<string, unknown> | null;
          last_crawled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          country?: CountryEnum;
          url?: string;
          name?: string;
          notes?: string | null;
          is_active?: boolean;
          crawl_selector?: Record<string, unknown> | null;
          last_crawled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          source_id: string | null;
          external_url: string;
          title: string;
          content: string | null;
          summary: string | null;
          image_url: string | null;
          author: string | null;
          published_at: string | null;
          crawled_at: string;
          is_translated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_id?: string | null;
          external_url: string;
          title: string;
          content?: string | null;
          summary?: string | null;
          image_url?: string | null;
          author?: string | null;
          published_at?: string | null;
          crawled_at?: string;
          is_translated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string | null;
          external_url?: string;
          title?: string;
          content?: string | null;
          summary?: string | null;
          image_url?: string | null;
          author?: string | null;
          published_at?: string | null;
          crawled_at?: string;
          is_translated?: boolean;
          created_at?: string;
        };
      };
      article_translations: {
        Row: {
          id: string;
          article_id: string;
          title_vi: string;
          content_vi: string | null;
          summary_vi: string | null;
          translated_at: string;
          translator: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          title_vi: string;
          content_vi?: string | null;
          summary_vi?: string | null;
          translated_at?: string;
          translator?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          title_vi?: string;
          content_vi?: string | null;
          summary_vi?: string | null;
          translated_at?: string;
          translator?: string;
        };
      };
      crawl_logs: {
        Row: {
          id: string;
          source_id: string;
          started_at: string;
          completed_at: string | null;
          articles_found: number;
          articles_new: number;
          status: string;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          source_id: string;
          started_at?: string;
          completed_at?: string | null;
          articles_found?: number;
          articles_new?: number;
          status?: string;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          source_id?: string;
          started_at?: string;
          completed_at?: string | null;
          articles_found?: number;
          articles_new?: number;
          status?: string;
          error_message?: string | null;
        };
      };
      notification_logs: {
        Row: {
          id: string;
          notification_type: string;
          sent_at: string;
          article_count: number | null;
          status: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          notification_type: string;
          sent_at?: string;
          article_count?: number | null;
          status?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          notification_type?: string;
          sent_at?: string;
          article_count?: number | null;
          status?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
    };
    Enums: {
      country_enum: CountryEnum;
    };
  };
}

// Helper types
export type NewsSource = Database["public"]["Tables"]["news_sources"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type ArticleTranslation = Database["public"]["Tables"]["article_translations"]["Row"];
export type CrawlLog = Database["public"]["Tables"]["crawl_logs"]["Row"];

// Extended types with relations
export type ArticleWithSource = Article & {
  news_sources: NewsSource | null;
};

export type ArticleWithTranslation = Article & {
  article_translations: ArticleTranslation | null;
};

export type FullArticle = Article & {
  news_sources: NewsSource | null;
  article_translations: ArticleTranslation | null;
};
