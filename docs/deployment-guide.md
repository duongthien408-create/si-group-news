# Deployment Guide - SI News Hub

## Quick Deploy to Vercel

### 1. Push to Git
```bash
cd si-news-hub
git init
git add .
git commit -m "feat: initial SI News Hub setup"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRAWL_API_KEY` (generate a random string)

### 3. Configure Domain
- Add custom domain: `news.sigroup.vn`
- Or use Vercel subdomain: `si-news-hub.vercel.app`

---

## Alternative: Cloudflare Pages

### 1. Build Command
```
pnpm build
```

### 2. Output Directory
```
.next
```

### 3. Environment Variables
Same as Vercel above.

---

## Post-Deployment Checklist

### Database
- [ ] Run SQL migrations in Supabase SQL Editor
- [ ] Seed news sources (002_seed_sources.sql)
- [ ] Verify RLS policies are enabled

### n8n Workflows
- [ ] Configure Supabase credentials
- [ ] Configure OpenAI credentials
- [ ] Create Telegram bot and get chat ID
- [ ] Import and activate workflows
- [ ] Test translation workflow
- [ ] Test Telegram notification

### Testing
- [ ] Visit deployed URL
- [ ] Trigger crawl: `POST /api/crawl/trigger`
- [ ] Verify articles appear
- [ ] Test country filters
- [ ] Test language toggle (when translations exist)

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | Yes |
| `CRAWL_API_KEY` | API key for crawl trigger | Yes |
| `N8N_WEBHOOK_URL` | n8n webhook URL | Optional |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | For notifications |
| `TELEGRAM_CHAT_ID` | Telegram group chat ID | For notifications |

---

## Monitoring

### Supabase Dashboard
- Database usage
- API requests
- Error logs

### Vercel Dashboard
- Deployment status
- Function logs
- Analytics

### n8n
- Workflow executions
- Error notifications

---

## Troubleshooting

### Crawl fails
1. Check `crawl_logs` table for error messages
2. Verify source URLs are accessible
3. Check rate limiting (1 req/sec)

### Translations not working
1. Verify OpenAI API key in n8n
2. Check n8n execution logs
3. Verify `is_translated` flag updates

### Telegram not sending
1. Verify bot is in the group
2. Check chat ID is correct (negative for groups)
3. Check n8n Telegram credentials
