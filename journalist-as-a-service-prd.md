# Product Requirements Document: Journalist as a Service

## Executive Summary

Journalist as a Service is an AI-powered news curation platform that allows users to define custom prompts and receive daily, personalized news articles curated by AI. Unlike existing solutions like Particle or Feedly, users have full control over their sources through MCP (Model Context Protocol) servers and can bring their own AI agents for curation.

**Core Value Proposition:** Open, composable personal journalism infrastructure - not just another news app, but a platform where users control sources, agents, and curation logic.

## Problem Statement

Users are overwhelmed by information but want to stay informed about specific topics. Current solutions have limitations:
- **Particle**: Doesn't allow users to define their own sources
- **Feedly/Inoreader**: Limited AI capabilities, closed ecosystems
- **Generic news apps**: Algorithmic feeds users can't control

### Key Pain Points
1. Too much noise, hard to find signal
2. Can't customize news sources at a granular level
3. One-size-fits-all summarization doesn't work for everyone
4. Lack of control over how news is filtered and presented

## Product Vision

A web application where users can:
- Define multiple custom prompts (e.g., "AI regulation in healthcare," "climate policy developments")
- Choose or add their own MCP servers for news sources
- Plug in custom AI agents for curation
- Scroll through a Medium-style feed of curated articles grouped by prompt
- Maintain full transparency and control over their news pipeline

## Target Users

### Primary
- **Power users** who care about specific topics and want granular control
- **Industry professionals** who need to monitor niche areas
- **Researchers** tracking specific domains

### Secondary  
- **General news consumers** who want better personalization
- **Content creators** who need curated research sources

## Competitive Analysis

| Product | Pricing | Strengths | Weaknesses |
|---------|---------|-----------|------------|
| **Feedly** | Free / $6.99/mo (Pro) / $12.99/mo (Pro+) | Established, good UI, AI feeds | Closed ecosystem, expensive for full features |
| **Inoreader** | Free / $7.50/mo (~$89/yr) | Powerful, RSS focus | Complex for beginners, recent price increase |
| **Particle** | Free (VC-funded) | Beautiful UI, multi-perspective | No custom sources, limited control |
| **Apple News+** | $12.99/mo | Curated content | Walled garden, no customization |

### Our Differentiation
- **Open architecture** via MCP servers
- **Bring your own agent** capability
- **Multi-prompt customization** as core feature
- **Infrastructure play** rather than just another app

## MVP Scope

### Must-Have Features (v1.0)

#### 1. User Authentication
- Email/password sign up and login
- Session management
- Password reset flow

#### 2. Prompt Management
- Create up to 5 prompts (free tier limit)
- Edit/delete prompts
- Simple text input interface
- Examples/templates for common use cases

**Example Prompts:**
- "Tech industry developments and M&A activity"
- "Climate policy and renewable energy news"
- "[City name] local news and events"
- "AI regulation and policy updates"
- "Startup funding in biotech"

#### 3. Default News Source Integration
- One high-quality default MCP server (NewsAPI, quality RSS aggregator, or similar)
- Curated "starter pack" of reliable sources
- No custom sources in MVP (pro feature for later)

#### 4. Daily Curation Engine
- Scheduled job runs daily (e.g., 6 AM user local time)
- For each user prompt:
  - Query MCP server for relevant articles
  - Apply default AI agent for summarization/filtering
  - Store results with metadata (source, date, relevance score)
- Deduplication logic to avoid repeated articles

#### 5. Feed Interface (Medium-Style)
- Scrollable feed of curated articles
- Grouped by prompt with clear visual delineation
- Each article card shows:
  - Headline
  - Source
  - Brief AI summary (2-3 sentences)
  - Publication date
  - "Read more" link to original source
- Clean, distraction-free reading experience
- Responsive design (mobile & desktop web)

#### 6. Basic Settings
- Account management
- Notification preferences (daily digest toggle)
- Timezone setting for curation timing

### Explicitly Out of Scope for MVP
- ❌ Custom MCP server integration (pro feature)
- ❌ Custom AI agents (pro feature)
- ❌ Payment/subscription system (build limits but don't charge yet)
- ❌ Native mobile apps (web-first, mobile-responsive)
- ❌ Social features (sharing, comments, etc.)
- ❌ Bookmarking/archiving
- ❌ Advanced filtering (sentiment, length preferences, etc.)
- ❌ Email digests
- ❌ Multi-language support
- ❌ Analytics/reading stats

## Technical Architecture

### Tech Stack
- **Frontend:** Next.js 14+ (React, TypeScript)
- **Backend:** Next.js API routes (or separate Node.js/Python service)
- **Database:** PostgreSQL via Supabase (or Firebase for speed)
- **Authentication:** NextAuth.js or Supabase Auth
- **MCP Integration:** Direct integration with chosen MCP server
- **AI Agent:** OpenAI API or Anthropic Claude for summarization
- **Hosting:** Vercel (frontend), Supabase (backend/DB)
- **Cron Jobs:** Vercel Cron or separate service

### Data Models

#### User
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

#### Prompt
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

#### Article
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

### Key Technical Flows

#### Daily Curation Flow
1. Cron job triggers at configured time
2. Fetch all active users with active prompts
3. For each prompt:
   - Query MCP server with prompt text
   - Get top N articles (e.g., 5-10 per prompt)
   - Pass through AI agent for summarization
   - Calculate relevance score
   - Store in database
4. Mark curation as complete for that day

#### Feed Loading Flow
1. User opens app
2. Fetch articles for user's prompts (today's curation)
3. Group by prompt
4. Sort by relevance within each group
5. Render in infinite scroll feed

## User Experience

### Onboarding Flow
1. Sign up with email/password
2. Welcome screen: "Create your first prompt"
3. Show 3-5 example prompts user can adopt or customize
4. "Your first curation will arrive tomorrow morning"
5. Optional: Tour of feed interface

### Daily Usage Flow
1. User receives notification (optional): "Your daily briefing is ready"
2. Opens app, sees feed grouped by prompts
3. Scrolls through articles, clicks to read full source
4. Can edit prompts anytime from settings

### Settings/Configuration
- Simple settings page
- Manage prompts (CRUD operations)
- Toggle notifications
- Set timezone
- Account details

## Monetization Strategy

### Free Tier
- Up to 5 prompts
- Default MCP servers only
- Basic AI agent
- Daily curation

### Pro Tier (Post-MVP)
**Pricing:** $8/month or $80/year (17% annual discount)

**Features:**
- Unlimited prompts (or 20-50 if ceiling needed)
- Custom MCP server integration
- Custom AI agent configurations
- Archive/search across past curations
- Priority processing
- Email digest option
- Advanced filtering options

### Future: API Access Tier
**Pricing:** $15-20/month
- Programmatic access to curation engine
- For developers building on top

## Success Metrics

### North Star Metric
**Daily Active Users (DAU)** - users who check their feed daily

### Key Metrics
- **Activation:** % of signups who create at least 1 prompt
- **Engagement:** % of users who check feed daily
- **Retention:** 7-day, 30-day retention rates
- **Prompt Quality:** Avg prompts per active user
- **Click-through:** % of articles clicked to read full source
- **Upgrade Intent:** Waitlist for pro features

### Success Criteria for MVP
- 100 beta users
- 60%+ create at least 2 prompts
- 40%+ DAU rate among active users
- 50%+ 7-day retention
- Qualitative feedback: "This is better than Particle/Feedly"

## Roadmap

### Phase 1: MVP (Weeks 1-3)
- Week 1: Project setup, auth, basic UI
- Week 2: Prompt management, MCP integration, curation engine
- Week 3: Feed interface, polish, testing
- Deploy to beta users

### Phase 2: Pro Features (Weeks 4-8)
- Custom MCP server integration
- Custom AI agent configs
- Payment integration (Stripe)
- Pro tier launch

### Phase 3: Growth (Weeks 9-12)
- Mobile app (React Native or PWA)
- Email digests
- Social features (share prompts, follow others)
- Advanced analytics

### Phase 4: Platform Play (Future)
- Marketplace for MCP servers
- Community-shared prompts
- Agent marketplace
- API access for developers

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| MCP server quality/reliability | High | Start with battle-tested sources, have fallbacks |
| AI summarization hallucinations | High | Human oversight initially, clear source attribution |
| User doesn't understand prompts | Medium | Strong examples, templates, onboarding |
| Daily curation is too slow | Medium | Optimize queries, cache results, parallel processing |
| Cost of AI API calls | Medium | Set reasonable article limits, optimize prompts |
| Users don't see value vs free alternatives | High | Focus on composability story, target power users first |

## Open Questions

1. **Which MCP server to use as default?** Need to evaluate options
2. **How many articles per prompt per day?** 5? 10? User configurable?
3. **Should we show articles from multiple days?** Or only today's curation?
4. **Email digest in MVP or wait for pro?** Lean toward wait
5. **How to handle low-volume prompts?** (e.g., niche topics with few daily articles)

## Launch Plan

### Beta Launch (Week 3)
- Private beta with 20-50 hand-selected users
- Collect qualitative feedback via interviews
- Iterate based on feedback

### Public Launch (Week 6-8)
- Product Hunt launch
- Reddit (r/SideProject, r/InternetIsBeautiful)
- Hacker News Show HN
- Tech Twitter
- Landing page with waitlist → immediate access

### Marketing Angle
- "Your personal newsroom with AI journalists"
- "Particle, but you control the sources"
- "News infrastructure for power users"
- Position as anti-filter-bubble, pro-transparency tool

## Appendix

### Example Default Prompts for Onboarding
1. **Tech News:** "Major technology company announcements, product launches, and industry trends"
2. **Local News:** "[Your city] - local government, community events, and regional developments"
3. **Climate & Environment:** "Climate policy, renewable energy, and environmental science breakthroughs"
4. **Startup Ecosystem:** "Venture capital funding, startup acquisitions, and founder stories"
5. **AI & Machine Learning:** "AI research papers, policy discussions, and practical applications"

### Competitive Feature Matrix

| Feature | Our MVP | Particle | Feedly Pro+ | Inoreader Pro |
|---------|---------|----------|-------------|---------------|
| Custom prompts | ✅ (5 free) | ❌ | ✅ (AI Feeds) | ✅ (Active Searches) |
| Custom sources | ❌ (v2) | ❌ | Limited | ✅ (RSS) |
| Custom AI agents | ❌ (v2) | ❌ | ❌ | ❌ |
| Multi-perspective | ❌ (v2) | ✅ | ❌ | ❌ |
| Medium-style feed | ✅ | ✅ | ❌ | ❌ |
| Price (monthly) | Free → $8 | Free | $12.99 | $7.50 |
| Open architecture | ✅ | ❌ | ❌ | Partial |

---

**Document Version:** 1.0  
**Last Updated:** November 24, 2025  
**Owner:** Product Team  
**Status:** Draft for Review
