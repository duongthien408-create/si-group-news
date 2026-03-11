// News source configurations for crawling
// Each source has customized selectors based on their HTML structure
import type { SourceConfig } from "./types";

export const sourceConfigs: Record<string, SourceConfig> = {
  // === USA ===
  boundless: {
    id: "boundless",
    url: "https://www.boundless.com/blog/category/immigration-news/",
    type: "html",
    selectors: {
      articleList: ".blog-post, article, .post",
      articleLink: "a[href*='/blog/']",
      title: "h2 a, h3 a, .post-title a",
      summary: ".excerpt, .post-excerpt, p",
      image: "img[src*='boundless']",
    },
    maxArticles: 10,
  },
  uscis: {
    id: "uscis",
    url: "https://www.uscis.gov/newsroom/all-news",
    type: "html",
    selectors: {
      // USCIS uses table-based layout
      articleList: "table.views-table tbody tr",
      articleLink: "td a",
      title: "td a",
      date: "td:nth-child(2)",
    },
    maxArticles: 10,
  },

  // === AUSTRALIA ===
  // homeaffairs blocked (403) - skip for now

  thisisaustralia: {
    id: "thisisaustralia",
    url: "https://www.thisisaustralia.com/news/",
    type: "html",
    selectors: {
      articleList: ".post, article, .news-item",
      articleLink: "a[href*='/news/']",
      title: ".entry-title a, h2 a, h3 a",
      summary: ".entry-summary, .excerpt, p",
      image: ".post-thumbnail img, .featured-image img",
    },
    maxArticles: 10,
  },
  visaenvoy: {
    id: "visaenvoy",
    url: "https://visaenvoy.com/immigration-news-australia/",
    type: "html",
    selectors: {
      articleList: ".post, article",
      articleLink: ".entry-title a, h2 a",
      title: ".entry-title a, h2 a",
      summary: ".entry-excerpt, .excerpt, p",
      image: ".post-thumbnail img, img.attachment-post-thumbnail",
    },
    maxArticles: 10,
  },

  // === CANADA ===
  immigrationnewscanada: {
    id: "immigrationnewscanada",
    url: "https://immigrationnewscanada.ca/",
    type: "html",
    selectors: {
      articleList: ".post, article, .type-post",
      articleLink: ".entry-title a, h2 a",
      title: ".entry-title a, h2 a",
      summary: ".entry-content p, .excerpt",
      image: ".post-thumbnail img, .wp-post-image",
    },
    maxArticles: 10,
  },
  immigrationca: {
    id: "immigrationca",
    url: "https://immigration.ca/canada-immigration-latest-news-articles/",
    type: "html",
    selectors: {
      articleList: ".post, article, .news-item",
      articleLink: "h2 a, .entry-title a",
      title: "h2 a, .entry-title a",
      summary: ".entry-excerpt, p",
      image: ".post-thumbnail img, .featured-image img",
    },
    maxArticles: 10,
  },
  cicnews: {
    id: "cicnews",
    url: "https://www.cicnews.com/",
    type: "html",
    selectors: {
      articleList: ".post, article, .news-card",
      articleLink: ".entry-title a, h2 a, h3 a",
      title: ".entry-title, h2, h3",
      summary: ".entry-summary, .excerpt, .post-excerpt",
      image: ".post-thumbnail img, img.wp-post-image",
    },
    maxArticles: 10,
  },

  // === EUROPE ===
  imidaily: {
    id: "imidaily",
    url: "https://www.imidaily.com/",
    type: "html",
    selectors: {
      // IMI Daily uses ColorMag theme + Elementor
      articleList: ".cm-post, .elementor-post, article.post",
      articleLink: ".cm-entry-title a, .elementor-post__title a, h2 a",
      title: ".cm-entry-title a, .elementor-post__title a, h2 a",
      summary: ".cm-excerpt, .elementor-post__excerpt p, .entry-content p",
      image: ".cm-post__thumbnail img, .elementor-post__thumbnail img",
    },
    maxArticles: 10,
  },
  citizenshipbyinvestment: {
    id: "citizenshipbyinvestment",
    url: "https://citizenshipbyinvestment.ch/",
    type: "html",
    selectors: {
      articleList: ".post, article, .news-item",
      articleLink: "h2 a, h3 a, .entry-title a",
      title: "h2 a, h3 a, .entry-title a",
      summary: ".entry-excerpt, .excerpt, p",
      image: ".post-thumbnail img, img.wp-post-image",
    },
    maxArticles: 10,
  },
  riftrust: {
    id: "riftrust",
    url: "https://www.riftrust.com/blog",
    type: "html",
    selectors: {
      articleList: ".post, article, .blog-post",
      articleLink: "h2 a, h3 a, .post-title a",
      title: "h2 a, h3 a, .post-title a",
      summary: ".post-excerpt, .excerpt, p",
      image: ".post-thumbnail img, .featured-image img",
    },
    maxArticles: 5,
  },

  // === NEW ZEALAND ===
  nzimmigration: {
    id: "nzimmigration",
    url: "https://www.immigration.govt.nz/about-us/media-centre/media-releases",
    type: "html",
    selectors: {
      articleList: ".media-release, .news-item, article",
      articleLink: "a[href*='/media-releases/']",
      title: "h3 a, h2 a, .title a",
      date: "time, .date",
    },
    maxArticles: 10,
  },
  beehive: {
    id: "beehive",
    url: "https://www.beehive.govt.nz/search?f%5B0%5D=portfolio%3A6816",
    type: "html",
    selectors: {
      articleList: ".release, .views-row, article",
      articleLink: "h3 a, h2 a, .title a",
      title: "h3, h2, .title",
      date: "time, .date-display-single",
    },
    maxArticles: 10,
  },
  businessdesknz: {
    id: "businessdesknz",
    url: "https://businessdesk.co.nz/section/immigration",
    type: "html",
    selectors: {
      articleList: ".article-card, article, .story",
      articleLink: "a[href*='/article/']",
      title: "h2, h3, .headline",
      summary: ".excerpt, .summary, p",
      image: "img.article-image, .thumbnail img",
    },
    maxArticles: 10,
  },

  // === MALTA ===
  maltatoday: {
    id: "maltatoday",
    url: "https://www.maltatoday.com.mt/news",
    type: "html",
    selectors: {
      articleList: ".article-item, article, .news-item",
      articleLink: "a[href*='/news/']",
      title: "h2, h3, .headline",
      image: "img.article-image, .thumbnail img",
    },
    maxArticles: 5,
  },

  // === RSS FEEDS (more reliable) ===
  cicnewsRss: {
    id: "cicnewsRss",
    url: "https://www.cicnews.com/",
    type: "rss",
    rssUrl: "https://www.cicnews.com/feed",
    maxArticles: 10,
  },
  immigrationcaRss: {
    id: "immigrationcaRss",
    url: "https://immigration.ca/",
    type: "rss",
    rssUrl: "https://immigration.ca/feed",
    maxArticles: 10,
  },
};

// Note: Some sites may block scrapers (403 error)
// For production, consider using RSS feeds where available
