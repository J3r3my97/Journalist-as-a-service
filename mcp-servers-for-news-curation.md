# Open Source MCP Servers for Journalist as a Service

## Best News-Specific MCP Servers for MVP

### 1. **News MCP** (cytrexsgr-news-mcp) ⭐ TOP PICK
**GitHub:** https://github.com/cytrexsgr/news-mcp
**Features:**
- Complete RSS aggregation and AI-powered analysis
- Automatic feed management
- Sentiment analysis and categorization (uses OpenAI GPT)
- Real-time dashboard and monitoring
- Automatic AI analysis of new feed items
- Advanced analytics and performance metrics
- Template system for flexible configuration
- PostgreSQL database (requires external DB)

**Why it's great:**
- Enterprise-grade system with auto-analysis
- Already has AI integration built-in
- Perfect for daily curation engine
- Strong analytics capabilities

**Integration effort:** Medium (requires PostgreSQL setup)

---

### 2. **RSS Crawler MCP** (mshk/rss-crawler)
**Location:** https://github.com/mshk/rss-crawler
**Features:**
- Fetches and parses RSS feeds
- Stores in SQLite database (lightweight!)
- Filtering and searching capabilities
- Firecrawl integration for advanced web scraping
- Structured data extraction

**Why it's great:**
- SQLite = easy setup, no external DB needed
- Good for MVP
- Firecrawl gives us advanced content extraction
- Built-in search and filtering

**Integration effort:** Low ✅

---

### 3. **RSS Feed MCP Server** (naoto24kawa)
**Location:** https://github.com/naoto24kawa/rss-feed-mcp-server
**Features:**
- Direct RSS/Atom feed access
- Feed registration and management
- Configuration file stored locally
- Simple and lightweight

**Why it's great:**
- Super simple to get started
- No external dependencies
- Good for quick MVP
- Can run via npx (zero install)

**Integration effort:** Very Low ✅✅

---

### 4. **Finance News RSS MCP** (jvenkatasandeep)
**Location:** https://github.com/jvenkatasandeep/finance-news-mcp
**Features:**
- Real-time finance news from major sources (Bloomberg, WSJ, CNBC, etc.)
- Built with FastMCP
- Pre-configured quality sources
- Search across all feeds by keyword

**Why it's great:**
- Shows how to integrate multiple quality sources
- Good template for multi-source aggregation
- Built with FastMCP framework (Python, easy to customize)

**Integration effort:** Low-Medium

---

### 5. **NewsHub MCP Server**
**Features:**
- Universal RSS/Atom compatibility
- Efficient caching mechanism
- Dynamic configuration
- Lightweight and transparent

**Why it's great:**
- Specifically designed for journalism use cases
- Smart caching for performance
- Open source

**Integration effort:** Medium

---

## Additional Useful MCP Servers

### **Hacker News MCP** (erithwik/mcp-hn)
- Search Hacker News
- Get top stories
- Good for tech news vertical

### **Google News MCP** (chanmeng/google-news-mcp-server)
- Google News integration
- Automatic topic categorization
- Multi-language support
- Comprehensive search (headlines, stories, topics)
- Uses SerpAPI (requires API key)

### **The Verge News MCP** (manimohans/verge-news-mcp)
- Single high-quality tech source
- TypeScript-based
- No API keys required
- 400+ downloads on PulseMCP

### **News Feed MCP** (spacestation09/newsfeed-mcp)
- Aggregates trending news from 31 data sources
- Supports custom RSS feeds via environment variables
- Good for broad coverage

---

## Recommended Approach for MVP

### **Option A: Quick MVP (Recommended)**
Use **RSS Feed MCP Server** as your default:
- Zero external dependencies
- Can be installed via npx
- Users can easily add their own feeds
- Extremely simple configuration
- Works out of the box

**Setup:**
```bash
npx rss-feed-mcp-server
```

**Why this works:**
- Get MVP running in hours, not days
- Prove concept first
- Can swap to more sophisticated servers later
- Users control their own sources

---

### **Option B: Feature-Rich MVP**
Use **RSS Crawler MCP** as your default:
- SQLite database (included, no external DB)
- Built-in filtering and search
- Firecrawl integration for better content extraction
- Still relatively easy to set up

**Why this works:**
- More professional feel
- Better content extraction
- Database for caching and history
- Good balance of features vs complexity

---

### **Option C: Production-Ready (Post-MVP)**
Use **News MCP** for full production:
- Enterprise-grade features
- Built-in AI analysis
- Sentiment categorization
- Real-time monitoring
- Advanced analytics

**When to use:**
- After validating MVP
- When you have budget for PostgreSQL hosting
- When users demand advanced features

---

## Implementation Strategy

### Phase 1: MVP (Week 1-3)
1. **Default Server:** RSS Feed MCP or RSS Crawler MCP
2. **Configuration:** 
   - Pre-configure 5-10 high-quality news sources
   - Create templates for common use cases
   - Simple JSON config file
3. **User Experience:**
   - Users get default sources immediately
   - Can view feed in Medium-style interface
   - Works out of the box

### Phase 2: Custom Sources (Week 4-8)
1. Let Pro users add custom MCP servers
2. Provide UI for adding RSS feeds
3. Build MCP server marketplace

### Phase 3: Advanced Features (Week 9+)
1. Migrate to News MCP for AI-powered features
2. Add sentiment analysis
3. Trending topics detection
4. Multi-source deduplication

---

## Default Source Recommendations

When setting up the MVP, pre-configure these sources:

### Technology
- TechCrunch RSS
- The Verge RSS
- Ars Technica RSS
- Hacker News (via HN MCP)

### Business
- Bloomberg RSS
- WSJ RSS
- Reuters Business

### General News
- Reuters World
- AP News
- NPR News

### Specialized
- Climate news feeds
- Local news aggregators
- Industry-specific feeds

---

## Integration Code Example

Here's how you'd integrate RSS Feed MCP Server in your Next.js backend:

```typescript
// lib/mcp-client.ts
import { MCPClient } from '@modelcontextprotocol/sdk';

export async function fetchArticlesForPrompt(
  prompt: string,
  feedUrls: string[]
): Promise<Article[]> {
  const client = new MCPClient();
  
  // Connect to RSS Feed MCP Server
  await client.connect({
    command: 'npx',
    args: ['rss-feed-mcp-server']
  });
  
  // Register feeds for this prompt
  for (const url of feedUrls) {
    await client.callTool('register_feed', { url });
  }
  
  // Fetch recent articles
  const articles = await client.callTool('list_feeds');
  
  return articles;
}
```

---

## Cost Considerations

### Free/Open Source (MVP Recommended)
- **RSS Feed MCP:** $0
- **RSS Crawler MCP:** $0 (SQLite is free)
- **Hosting:** Standard Next.js hosting (Vercel free tier works)

### Requires API Keys (Optional)
- **Google News MCP:** Requires SerpAPI ($50-200/mo depending on volume)
- **Finance News MCP:** Free (uses public RSS)

### Advanced (Post-MVP)
- **News MCP:** Requires PostgreSQL hosting (~$10-50/mo on Railway/Render)
- **OpenAI for summarization:** ~$0.01-0.05 per article summarized

---

## My Recommendation for Your MVP

**Use RSS Feed MCP Server** because:

1. ✅ Zero setup complexity
2. ✅ No external dependencies
3. ✅ Users can easily understand it ("just RSS feeds")
4. ✅ Proves core concept quickly
5. ✅ Can upgrade later without rewriting everything
6. ✅ Open source and actively maintained
7. ✅ Aligns with your "bring your own source" philosophy

**Then for Pro tier:**
- Add RSS Crawler MCP (with SQLite) for better performance
- Add News MCP for AI-powered analysis
- Let users plug in any other MCP server they want

This gets you to market fast while maintaining the composability story that differentiates you from Particle.

---

## Next Steps

1. ✅ Pick RSS Feed MCP Server for MVP
2. Set up 10 default high-quality feeds
3. Build Next.js integration
4. Test curation pipeline
5. Launch to beta users
6. Gather feedback on which sources they want
7. Iterate based on usage data

Would you like me to help you set up the integration code or create a configuration file for the default feeds?
