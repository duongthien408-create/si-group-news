# n8n Workflows for SI News Hub

## Overview

SI News Hub uses n8n for automation:
1. **Translation Workflow** - Translate EN articles to VI using OpenAI
2. **Telegram Notification** - Daily digest to Telegram group
3. **Scheduled Crawling** - Trigger crawlers on schedule

---

## Workflow 1: Translation (EN → VI)

### Trigger
- Webhook or Schedule (every 30 min)
- Supabase trigger on new article insert

### Flow
```
[Trigger] → [Supabase: Get untranslated articles]
         → [OpenAI: Translate title + summary]
         → [Supabase: Insert translation]
         → [Supabase: Mark article as translated]
```

### n8n Nodes Configuration

#### 1. Supabase Node - Get Untranslated
```json
{
  "operation": "getAll",
  "table": "articles",
  "filters": {
    "is_translated": false
  },
  "limit": 10
}
```

#### 2. OpenAI Node - Translate
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a professional translator. Translate the following immigration news from English to Vietnamese. Maintain professional tone and accuracy. Only output the translation, no explanations."
    },
    {
      "role": "user",
      "content": "Translate this title: {{$json.title}}\n\nAnd this summary: {{$json.summary}}"
    }
  ]
}
```

#### 3. Supabase Node - Insert Translation
```json
{
  "operation": "insert",
  "table": "article_translations",
  "data": {
    "article_id": "{{$json.id}}",
    "title_vi": "{{$json.translated_title}}",
    "summary_vi": "{{$json.translated_summary}}",
    "translator": "openai-gpt4omini"
  }
}
```

#### 4. Supabase Node - Update Article
```json
{
  "operation": "update",
  "table": "articles",
  "filters": {
    "id": "{{$json.id}}"
  },
  "data": {
    "is_translated": true
  }
}
```

### Estimated Cost
- GPT-4o-mini: ~$0.15/1M input tokens, $0.60/1M output tokens
- ~100 articles/day × ~500 tokens = 50K tokens/day
- **Monthly cost: ~$3-5**

---

## Workflow 2: Telegram Daily Digest

### Trigger
- Schedule: 9:00 AM daily (Vietnam timezone)

### Flow
```
[Schedule Trigger] → [Supabase: Get today's articles]
                   → [Format Message]
                   → [Telegram: Send to group]
                   → [Supabase: Log notification]
```

### n8n Nodes Configuration

#### 1. Schedule Trigger
```json
{
  "rule": {
    "interval": [{ "field": "hours", "hours": 9 }]
  },
  "timezone": "Asia/Ho_Chi_Minh"
}
```

#### 2. Supabase Node - Get Recent Articles
```json
{
  "operation": "getAll",
  "table": "articles",
  "filters": {
    "crawled_at": {
      "gte": "{{$today.minus(1, 'day').toISO()}}"
    }
  },
  "select": "*, news_sources(name, country), article_translations(title_vi)",
  "limit": 20
}
```

#### 3. Code Node - Format Message
```javascript
const articles = $input.all();

const countryFlags = {
  usa: '🇺🇸',
  australia: '🇦🇺',
  canada: '🇨🇦',
  europe: '🇪🇺',
  new_zealand: '🇳🇿',
  malta: '🇲🇹',
  generic: '🌍'
};

let message = `📰 *SI News Hub - Tin tức định cư hôm nay*\n`;
message += `📅 ${new Date().toLocaleDateString('vi-VN')}\n\n`;

const grouped = {};
articles.forEach(a => {
  const country = a.json.news_sources?.country || 'generic';
  if (!grouped[country]) grouped[country] = [];
  grouped[country].push(a.json);
});

Object.entries(grouped).forEach(([country, items]) => {
  const flag = countryFlags[country] || '🌍';
  message += `${flag} *${country.toUpperCase()}*\n`;
  items.slice(0, 3).forEach(item => {
    const title = item.article_translations?.[0]?.title_vi || item.title;
    message += `• [${title}](${item.external_url})\n`;
  });
  message += '\n';
});

message += `\n🔗 Xem thêm: https://news.sigroup.vn`;

return [{ json: { message, articleCount: articles.length } }];
```

#### 4. Telegram Node - Send Message
```json
{
  "chatId": "{{$env.TELEGRAM_CHAT_ID}}",
  "text": "{{$json.message}}",
  "parseMode": "Markdown",
  "disableWebPagePreview": true
}
```

#### 5. Supabase Node - Log Notification
```json
{
  "operation": "insert",
  "table": "notification_logs",
  "data": {
    "notification_type": "telegram",
    "article_count": "{{$json.articleCount}}",
    "status": "sent",
    "metadata": { "chat_id": "{{$env.TELEGRAM_CHAT_ID}}" }
  }
}
```

---

## Workflow 3: Scheduled Crawling

### Trigger
- Schedule: Every 6 hours

### Flow
```
[Schedule] → [HTTP Request: POST /api/crawl/trigger]
           → [Log Result]
```

### n8n Nodes Configuration

#### 1. HTTP Request Node
```json
{
  "method": "POST",
  "url": "{{$env.APP_URL}}/api/crawl/trigger",
  "headers": {
    "Authorization": "Bearer {{$env.CRAWL_API_KEY}}"
  },
  "body": {}
}
```

---

## Environment Variables for n8n

```
# Supabase
SUPABASE_URL=https://ygkonqhpoorvqqbwiumj.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=-1001234567890

# App
APP_URL=https://your-deployed-url.vercel.app
CRAWL_API_KEY=your-crawl-api-key
```

---

## Setup Instructions

### 1. Create Telegram Bot
1. Message @BotFather on Telegram
2. `/newbot` → follow prompts
3. Save the bot token
4. Add bot to your group
5. Get chat ID: `https://api.telegram.org/bot<TOKEN>/getUpdates`

### 2. Import Workflows to n8n
1. Create new workflow
2. Add nodes as specified above
3. Configure credentials
4. Activate workflow

### 3. Test Workflows
1. Run translation workflow manually first
2. Verify translations appear in database
3. Test Telegram notification
4. Enable scheduled triggers

---

## Monitoring

- Check `crawl_logs` table for crawl history
- Check `notification_logs` table for notification history
- n8n execution history shows all runs
