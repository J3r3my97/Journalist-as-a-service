# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Journalist as a Service is an AI-powered news curation platform where users define custom prompts and receive daily, personalized news articles curated by AI. The core differentiator is that users control sources through MCP (Model Context Protocol) servers and can bring their own AI agents for curation.

**Key Value Proposition:** Open, composable personal journalism infrastructure—not just another news app, but a platform where users control sources, agents, and curation logic.

## Tech Stack

- **Frontend:** Next.js 14+ (React, TypeScript)
- **Backend:** Next.js API routes (or separate Node.js/Python service)
- **Database:** PostgreSQL via Supabase (or Firebase for speed)
- **Authentication:** NextAuth.js or Supabase Auth
- **MCP Integration:** Direct integration with chosen MCP server
- **AI Agent:** OpenAI API or Anthropic Claude for summarization
- **Hosting:** Vercel (frontend), Supabase (backend/DB)
- **Cron Jobs:** Vercel Cron or separate service

## Development Commands

Once the Next.js project is initialized, standard commands will be:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

For database migrations (if using Supabase):
```bash
npx supabase migration new <name>   # Create new migration
npx supabase db push                # Apply migrations
```

## Core Data Models

### User
```typescript
{
  id: string
  email: string
  password_hash: string
  created_at: timestamp
  timezone: string
  tier: 'free' | 'pro'
}
```

### Prompt
```typescript
{
  id: string
  user_id: string (FK)
  title: string
  prompt_text: string
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### Article
```typescript
{
  id: string
  prompt_id: string (FK)
  title: string
  url: string
  source: string
  summary: string
  published_at: timestamp
  curated_at: timestamp
  relevance_score: float
}
```

## Architecture Patterns

### Daily Curation Flow
1. Cron job triggers at configured time (e.g., 6 AM user local time)
2. Fetch all active users with active prompts
3. For each prompt:
   - Query MCP server with prompt text
   - Get top N articles (e.g., 5-10 per prompt)
   - Pass through AI agent for summarization
   - Calculate relevance score
   - Store in database with deduplication
4. Mark curation as complete for that day

### Feed Loading Flow
1. User opens app
2. Fetch articles for user's prompts (today's curation)
3. Group by prompt
4. Sort by relevance within each group
5. Render in infinite scroll feed

### MCP Integration

**Default MCP Server for MVP:** RSS Feed MCP Server (naoto24kawa/rss-feed-mcp-server)
- Zero external dependencies
- Can be installed via `npx rss-feed-mcp-server`
- Simple configuration file stored locally
- Works out of the box

**Alternative MCP Servers (for reference):**
- **RSS Crawler MCP** (mshk/rss-crawler) - SQLite-based, Firecrawl integration
- **News MCP** (cytrexsgr/news-mcp) - Enterprise-grade with AI analysis (requires PostgreSQL)
- **Google News MCP** - Requires SerpAPI key
- **Hacker News MCP** - Good for tech news vertical

**Integration Pattern:**
```typescript
import { MCPClient } from '@modelcontextprotocol/sdk';

const client = new MCPClient();
await client.connect({
  command: 'npx',
  args: ['rss-feed-mcp-server']
});

// Register feeds and fetch articles
await client.callTool('register_feed', { url });
const articles = await client.callTool('list_feeds');
```

**Pro Tier (Post-MVP):**
- Custom MCP server integration
- Users can bring their own MCP servers
- Upgrade to News MCP for AI-powered sentiment analysis

**MCP queries should be cached when possible to reduce latency**

### AI Agent Integration
- Default AI agent handles summarization (2-3 sentences per article)
- Calculate relevance scores based on prompt matching
- Include clear source attribution to prevent hallucination issues
- Pro tier (post-MVP) allows custom AI agent configurations

## MVP Scope (v1.0)

### Must-Have Features
1. **User Authentication** - Email/password with NextAuth.js or Supabase Auth
2. **Prompt Management** - Create up to 5 prompts (free tier), CRUD operations
3. **Default News Source** - Single high-quality MCP server, curated starter sources
4. **Daily Curation Engine** - Scheduled job for article fetching and summarization
5. **Feed Interface** - Medium-style scrollable feed grouped by prompt
6. **Basic Settings** - Account management, notifications, timezone

### Explicitly Out of Scope for MVP
- Custom MCP server integration (pro feature)
- Custom AI agents (pro feature)
- Payment/subscription system
- Native mobile apps (web-responsive only)
- Social features, bookmarking, email digests
- Advanced filtering or analytics

## Key Implementation Notes

### Free Tier Limits
- Up to 5 prompts per user
- Default MCP servers only
- Basic AI agent
- Daily curation only

### Default News Sources (Pre-configured)

**Technology:**
- TechCrunch RSS
- The Verge RSS
- Ars Technica RSS
- Hacker News (via HN MCP)

**Business:**
- Bloomberg RSS
- Wall Street Journal RSS
- Reuters Business

**General News:**
- Reuters World
- Associated Press News
- NPR News

**Specialized:**
- Climate news feeds
- Local news aggregators
- Industry-specific feeds

### Onboarding Flow
1. Sign up with email/password
2. Welcome screen: "Create your first prompt"
3. Show 3-5 example prompts (tech news, local news, climate, startups, AI/ML)
4. Set timezone preference
5. "Your first curation will arrive tomorrow morning"

### Feed UX Requirements
Each article card should show:
- Headline
- Source
- Brief AI summary (2-3 sentences)
- Publication date
- "Read more" link to original source
- Clean, distraction-free Medium-style reading experience
- Responsive design (mobile & desktop)

### Cron Job Considerations
- Use Vercel Cron for simplicity (or separate service if needed)
- Run daily at 6 AM user local time (requires timezone handling)
- Implement deduplication to avoid showing same article multiple times
- Set reasonable article limits per prompt to manage AI API costs

## Security & Performance

- Hash passwords with bcrypt or similar
- Validate all user inputs (prompt text, email, etc.)
- Rate limit API endpoints to prevent abuse
- Cache MCP server responses where applicable
- Optimize database queries (index on user_id, prompt_id, curated_at)
- Monitor AI API costs and set reasonable limits

### Cost Considerations
**MVP (Free Tier):**
- RSS Feed MCP Server: $0 (open source)
- Vercel hosting: Free tier sufficient initially
- OpenAI/Claude API for summarization: ~$0.01-0.05 per article
- Supabase: Free tier (500MB database, 50,000 monthly active users)

**Post-MVP/Pro Tier:**
- PostgreSQL hosting for News MCP: ~$10-50/month (Railway/Render)
- Google News MCP (if used): SerpAPI $50-200/month
- Scale Vercel/Supabase as needed

## Future Roadmap

### Phase 2: Pro Features (Post-MVP)
- Custom MCP server integration
- Custom AI agent configurations
- Payment integration (Stripe)
- Pro tier: $8/month or $80/year

### Phase 3: Growth
- Mobile app (PWA or React Native)
- Email digests
- Social features (share prompts, follow others)
- Advanced analytics

### Phase 4: Platform Play
- Marketplace for MCP servers
- Community-shared prompts
- Agent marketplace
- API access for developers
