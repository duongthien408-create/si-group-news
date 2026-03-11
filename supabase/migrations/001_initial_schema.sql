-- SI News Hub Database Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for countries
CREATE TYPE country_enum AS ENUM (
  'usa', 'australia', 'canada', 'europe',
  'new_zealand', 'malta', 'generic'
);

-- News sources table
CREATE TABLE news_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country country_enum NOT NULL,
  url TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  crawl_selector JSONB, -- CSS selectors for crawling
  last_crawled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table (English original)
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES news_sources(id) ON DELETE SET NULL,
  external_url TEXT NOT NULL UNIQUE, -- Deduplication key
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  crawled_at TIMESTAMPTZ DEFAULT NOW(),
  is_translated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article translations (Vietnamese)
CREATE TABLE article_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE UNIQUE,
  title_vi TEXT NOT NULL,
  content_vi TEXT,
  summary_vi TEXT,
  translated_at TIMESTAMPTZ DEFAULT NOW(),
  translator TEXT DEFAULT 'openai' -- Track AI model used
);

-- Crawl logs for monitoring
CREATE TABLE crawl_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES news_sources(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  articles_found INTEGER DEFAULT 0,
  articles_new INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running', -- running, completed, failed
  error_message TEXT
);

-- Notification logs
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type TEXT NOT NULL, -- telegram, email
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  article_count INTEGER,
  status TEXT DEFAULT 'sent',
  metadata JSONB
);

-- Indexes for performance
CREATE INDEX idx_articles_source ON articles(source_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_crawled ON articles(crawled_at DESC);
CREATE INDEX idx_articles_translated ON articles(is_translated);
CREATE INDEX idx_sources_country ON news_sources(country);
CREATE INDEX idx_sources_active ON news_sources(is_active);
CREATE INDEX idx_translations_article ON article_translations(article_id);

-- RLS Policies
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawl_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read sources" ON news_sources FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read translations" ON article_translations FOR SELECT USING (true);

-- Service role full access for crawl_logs and notification_logs
CREATE POLICY "Service role access crawl_logs" ON crawl_logs FOR ALL USING (true);
CREATE POLICY "Service role access notification_logs" ON notification_logs FOR ALL USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sources_updated_at
  BEFORE UPDATE ON news_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
