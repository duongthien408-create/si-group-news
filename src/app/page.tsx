import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

// Country flags for display
const countryFlags: Record<string, string> = {
  usa: "🇺🇸",
  australia: "🇦🇺",
  canada: "🇨🇦",
  europe: "🇪🇺",
  new_zealand: "🇳🇿",
  malta: "🇲🇹",
  generic: "🌍",
};

const countryNames: Record<string, string> = {
  usa: "USA",
  australia: "Australia",
  canada: "Canada",
  europe: "Europe",
  new_zealand: "New Zealand",
  malta: "Malta",
  generic: "World",
};

interface Article {
  id: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  external_url: string;
  published_at: string | null;
  crawled_at: string;
  news_sources: {
    name: string;
    country: string;
  } | null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const selectedCountry = params.country || "all";
  const supabase = await createClient();

  // Fetch articles
  let query = supabase
    .from("articles")
    .select(
      `
      id, title, summary, image_url, external_url, published_at, crawled_at,
      news_sources (name, country)
    `
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("crawled_at", { ascending: false })
    .limit(30);

  if (selectedCountry !== "all") {
    query = query.eq("news_sources.country", selectedCountry);
  }

  const { data } = await query;
  const articles = (data || []) as unknown as Article[];

  // Filter out articles without sources if country filter applied
  const filteredArticles =
    selectedCountry === "all"
      ? articles
      : articles.filter((a) => a.news_sources?.country === selectedCountry);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-dark text-white py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-primary-gold hover:opacity-80">
            SI News Hub
          </Link>
          <nav className="flex gap-2">
            <Link
              href="?lang=en"
              className="px-3 py-1 text-sm rounded bg-primary-brown hover:bg-primary-gold hover:text-dark transition-colors"
            >
              EN
            </Link>
            <Link
              href="?lang=vi"
              className="px-3 py-1 text-sm rounded border border-charcoal hover:bg-primary-gold hover:text-dark transition-colors"
            >
              VI
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark to-charcoal text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-serif mb-4">
            Immigration News <span className="text-primary-gold">Hub</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Cập nhật tin tức định cư mới nhất từ USA, Australia, Canada, Europe,
            New Zealand và Malta.
          </p>
        </div>
      </section>

      {/* Country Filters */}
      <section className="py-6 px-6 border-b border-light-gray bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                selectedCountry === "all"
                  ? "bg-primary-brown text-white border-primary-brown"
                  : "border-charcoal hover:bg-primary-brown hover:text-white hover:border-primary-brown"
              }`}
            >
              🌐 All
            </Link>
            {Object.entries(countryFlags).map(([key, flag]) => (
              <Link
                key={key}
                href={`?country=${key}`}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  selectedCountry === key
                    ? "bg-primary-brown text-white border-primary-brown"
                    : "border-charcoal hover:bg-primary-brown hover:text-white hover:border-primary-brown"
                }`}
              >
                {flag} {countryNames[key]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-8 px-6 bg-light-gray min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-charcoal text-lg">
                Chưa có tin tức nào. Chạy crawler để lấy tin mới.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                POST /api/crawl/trigger với Bearer token
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {article.image_url && (
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    {article.news_sources && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {countryFlags[article.news_sources.country] || "🌍"}
                        </span>
                        <span className="text-xs text-primary-brown font-medium uppercase">
                          {article.news_sources.name}
                        </span>
                      </div>
                    )}
                    <h2 className="text-lg font-serif text-dark line-clamp-2 mb-2">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-sm text-charcoal line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString()
                          : new Date(article.crawled_at).toLocaleDateString()}
                      </span>
                      <a
                        href={article.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-brown hover:text-secondary-green font-medium"
                      >
                        Read more →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-footer text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary-gold font-serif text-lg mb-2">SI Group</p>
          <p className="text-sm text-gray-400">
            © 2026 SI Group. Immigration News Hub.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <a
              href="https://sigroup.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-gold"
            >
              sigroup.vn
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
