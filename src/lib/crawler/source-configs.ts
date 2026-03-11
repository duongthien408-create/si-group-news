// News source configurations for crawling
// Each source has specific selectors and settings
import type { SourceConfig } from "./types";

export const sourceConfigs: Record<string, SourceConfig> = {
  // === USA ===
  boundless: {
    id: "boundless",
    url: "https://www.boundless.com/blog/category/immigration-news/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2, h3",
      summary: "p",
      image: "img",
    },
    maxArticles: 10,
  },
  uscis: {
    id: "uscis",
    url: "https://www.uscis.gov/newsroom/all-news",
    type: "html",
    selectors: {
      articleList: ".views-row",
      articleLink: "a",
      title: ".field-content",
      date: ".date-display-single",
    },
    maxArticles: 10,
  },

  // === AUSTRALIA ===
  homeaffairs: {
    id: "homeaffairs",
    url: "https://immi.homeaffairs.gov.au/news-media",
    type: "html",
    selectors: {
      articleList: ".news-item, article",
      articleLink: "a",
      title: "h3, h2",
      summary: "p",
    },
    maxArticles: 10,
  },
  thisisaustralia: {
    id: "thisisaustralia",
    url: "https://www.thisisaustralia.com/news/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2, h3",
      summary: ".excerpt, p",
      image: "img",
    },
    maxArticles: 10,
  },
  visaenvoy: {
    id: "visaenvoy",
    url: "https://visaenvoy.com/immigration-news-australia/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: ".entry-title, h2",
      summary: ".entry-content p",
      image: "img",
    },
    maxArticles: 10,
  },

  // === CANADA ===
  immigrationnewscanada: {
    id: "immigrationnewscanada",
    url: "https://immigrationnewscanada.ca/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2, h3",
      summary: "p",
      image: "img",
    },
    maxArticles: 10,
  },
  immigrationca: {
    id: "immigrationca",
    url: "https://immigration.ca/canada-immigration-latest-news-articles/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2",
      summary: "p",
      image: "img",
    },
    maxArticles: 10,
  },
  cicnews: {
    id: "cicnews",
    url: "https://www.cicnews.com/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: ".entry-title, h2",
      summary: ".entry-summary, p",
      image: "img",
    },
    maxArticles: 10,
  },
  ircc: {
    id: "ircc",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html",
    type: "html",
    selectors: {
      articleList: ".item, article",
      articleLink: "a",
      title: "h3, h2",
      date: "time",
    },
    maxArticles: 10,
  },

  // === EUROPE ===
  imidaily: {
    id: "imidaily",
    url: "https://www.imidaily.com/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2",
      summary: ".excerpt, p",
      image: "img",
    },
    maxArticles: 10,
  },
  citizenshipbyinvestment: {
    id: "citizenshipbyinvestment",
    url: "https://citizenshipbyinvestment.ch/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2, h3",
      summary: "p",
      image: "img",
    },
    maxArticles: 10,
  },
  riftrust: {
    id: "riftrust",
    url: "https://www.riftrust.com/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2, h3",
      summary: "p",
      image: "img",
    },
    maxArticles: 5,
  },

  // === NEW ZEALAND ===
  nzimmigration: {
    id: "nzimmigration",
    url: "https://www.immigration.govt.nz/about-us/media-centre",
    type: "html",
    selectors: {
      articleList: ".media-release, article",
      articleLink: "a",
      title: "h3, h2",
      date: "time",
    },
    maxArticles: 10,
  },
  beehive: {
    id: "beehive",
    url: "https://www.beehive.govt.nz/portfolio/nationalactnew-zealand-first-coalition-government-2023-2026/immigration",
    type: "html",
    selectors: {
      articleList: "article, .release",
      articleLink: "a",
      title: "h2, h3",
      date: "time",
    },
    maxArticles: 10,
  },
  businessdesknz: {
    id: "businessdesknz",
    url: "https://businessdesk.co.nz/immigration",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2, h3",
      summary: "p",
      image: "img",
    },
    maxArticles: 10,
  },

  // === MALTA ===
  maltatoday: {
    id: "maltatoday",
    url: "https://www.maltatoday.com.mt/",
    type: "html",
    selectors: {
      articleList: "article",
      articleLink: "a",
      title: "h2, h3",
      image: "img",
    },
    maxArticles: 5,
  },

  // === GENERIC (RSS feeds) ===
  cnn: {
    id: "cnn",
    url: "https://edition.cnn.com/",
    type: "rss",
    rssUrl: "http://rss.cnn.com/rss/edition_world.rss",
    maxArticles: 5,
  },
};

// Note: Some selectors may need adjustment after testing
// WSJ, CNBC skipped due to paywall per user request
