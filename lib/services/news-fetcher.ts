import Parser from 'rss-parser'

const parser = new Parser()

export type RSSFeed = {
  url: string
  name: string
  category: string
}

export type NewsArticle = {
  title: string
  link: string
  pubDate: string
  content: string
  source: string
}

// Default news sources
export const DEFAULT_RSS_FEEDS: RSSFeed[] = [
  // Technology
  { url: 'https://techcrunch.com/feed/', name: 'TechCrunch', category: 'tech' },
  { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', category: 'tech' },

  // Business
  { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg', category: 'business' },
  { url: 'https://www.reuters.com/business', name: 'Reuters Business', category: 'business' },

  // General News
  { url: 'https://www.reuters.com/world', name: 'Reuters World', category: 'general' },
  { url: 'https://feeds.npr.org/1001/rss.xml', name: 'NPR News', category: 'general' },
]

export async function fetchRSSFeed(feedUrl: string, sourceName: string): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL(feedUrl)

    return feed.items.map(item => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      content: item.contentSnippet || item.content || item.summary || '',
      source: sourceName,
    }))
  } catch (error) {
    console.error(`Error fetching RSS feed from ${sourceName}:`, error)
    return []
  }
}

export async function fetchMultipleFeeds(feeds: RSSFeed[]): Promise<NewsArticle[]> {
  const feedPromises = feeds.map(feed => fetchRSSFeed(feed.url, feed.name))
  const results = await Promise.allSettled(feedPromises)

  return results
    .filter((result): result is PromiseFulfilledResult<NewsArticle[]> => result.status === 'fulfilled')
    .flatMap(result => result.value)
}

export async function fetchRelevantArticles(
  promptText: string,
  maxArticles: number = 10
): Promise<NewsArticle[]> {
  // Fetch from all default feeds
  const allArticles = await fetchMultipleFeeds(DEFAULT_RSS_FEEDS)

  // Filter articles from last 24 hours
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const recentArticles = allArticles.filter(article => {
    const articleDate = new Date(article.pubDate)
    return articleDate >= oneDayAgo
  })

  // Simple keyword matching for MVP
  // In production, this would use embeddings or AI-powered relevance scoring
  const keywords = promptText.toLowerCase().split(' ')

  const scoredArticles = recentArticles.map(article => {
    const titleLower = article.title.toLowerCase()
    const contentLower = article.content.toLowerCase()

    let score = 0
    keywords.forEach(keyword => {
      if (keyword.length < 3) return // Skip short words
      if (titleLower.includes(keyword)) score += 3
      if (contentLower.includes(keyword)) score += 1
    })

    return { article, score }
  })

  // Sort by score and return top N
  return scoredArticles
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxArticles)
    .map(item => item.article)
}
