# SI News Hub

Immigration news aggregator for SI Group (sigroup.vn)

## Features

- 📰 **17+ News Sources** - USA, Australia, Canada, Europe, NZ, Malta
- 🤖 **Auto Crawling** - Scheduled news collection via n8n
- 🌐 **Bilingual** - English/Vietnamese with AI translation
- 📱 **Telegram Digest** - Daily news notifications
- 🎨 **SI Group Brand** - Matching sigroup.vn design

## Tech Stack

- **Frontend**: Next.js 16, TailwindCSS 4, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Automation**: n8n workflows
- **Translation**: OpenAI GPT-4o-mini
- **Hosting**: Vercel/Cloudflare Pages

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
si-news-hub/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/
│   │   │   ├── articles/    # Articles API
│   │   │   └── crawl/       # Crawl trigger/status
│   │   ├── page.tsx         # Homepage
│   │   └── layout.tsx       # Root layout
│   └── lib/
│       ├── crawler/         # News crawlers
│       │   ├── adapters/    # RSS/HTML adapters
│       │   └── source-configs.ts
│       └── supabase/        # DB client & types
├── supabase/
│   └── migrations/          # SQL schema
└── docs/
    ├── n8n-workflows.md     # n8n setup guide
    └── deployment-guide.md  # Deploy instructions
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/articles` | GET | List articles (filters: country, lang, limit) |
| `/api/crawl/trigger` | POST | Trigger news crawl (auth required) |
| `/api/crawl/status` | GET | Crawl history & stats |

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
CRAWL_API_KEY=xxx
```

## n8n Workflows

See [docs/n8n-workflows.md](docs/n8n-workflows.md) for:
- Translation workflow (EN → VI)
- Telegram daily digest
- Scheduled crawling

## Deployment

See [docs/deployment-guide.md](docs/deployment-guide.md)

## License

© 2026 SI Group
