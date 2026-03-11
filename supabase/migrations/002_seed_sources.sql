-- Seed news sources from CSV
INSERT INTO news_sources (country, url, name, notes) VALUES
-- USA (Skip paywall sites per user request)
('usa', 'https://www.boundless.com/blog/category/immigration-news/', 'Boundless', 'Easy to read, easy to understand'),
('usa', 'https://www.uscis.gov/newsroom/all-news', 'USCIS News', 'Official source'),
('usa', 'https://travel.state.gov/content/travel/en/us-visas/immigrate/employment-based-immigrant-visas.html', 'State Dept - Employment Visas', 'Official visa info'),
('usa', 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-statistics.html', 'State Dept - Visa Statistics', 'Annual reports'),

-- Australia
('australia', 'https://immi.homeaffairs.gov.au/news-media', 'Home Affairs Australia', 'Official source'),
('australia', 'https://www.thisisaustralia.com/news/', 'This Is Australia', 'Quick updates'),
('australia', 'https://visaenvoy.com/immigration-news-australia/', 'Visa Envoy', 'Immigration news Australia'),

-- Canada
('canada', 'https://immigrationnewscanada.ca/', 'Immigration News Canada', 'Easy to read'),
('canada', 'https://immigration.ca/canada-immigration-latest-news-articles/', 'Immigration.ca', 'Easy to read'),
('canada', 'https://www.cicnews.com/', 'CIC News', 'Easy to read'),
('canada', 'https://www.canada.ca/en/immigration-refugees-citizenship/news.html', 'IRCC Official', 'Government official'),

-- Europe
('europe', 'https://www.imidaily.com/', 'IMI Daily', 'Investment migration news'),
('europe', 'https://citizenshipbyinvestment.ch/', 'CBI Switzerland', 'Citizenship by investment'),
('europe', 'https://www.riftrust.com/', 'Riftrust', 'European immigration'),

-- New Zealand
('new_zealand', 'https://www.immigration.govt.nz/about-us/media-centre', 'NZ Immigration', 'Official visa info'),
('new_zealand', 'https://www.beehive.govt.nz/portfolio/nationalactnew-zealand-first-coalition-government-2023-2026/immigration', 'Beehive NZ', 'Government portal'),
('new_zealand', 'https://businessdesk.co.nz/immigration', 'BusinessDesk NZ', 'Policy analysis'),

-- Malta
('malta', 'https://www.maltatoday.com.mt/', 'Malta Today', 'Malta news')

ON CONFLICT (url) DO NOTHING;
