import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function summarizeArticle(
  title: string,
  content: string,
  promptContext: string
): Promise<{ summary: string; relevanceScore: number }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency
      messages: [
        {
          role: 'system',
          content: `You are a news summarizer. Summarize articles in 2-3 concise sentences.
Also rate the relevance of the article to the user's interest on a scale of 0.0 to 1.0.

User's interest: ${promptContext}

Respond in JSON format:
{
  "summary": "2-3 sentence summary",
  "relevance_score": 0.85
}`
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nContent: ${content.slice(0, 1000)}` // Limit content length
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    return {
      summary: result.summary || 'Summary unavailable',
      relevanceScore: result.relevance_score || 0.5,
    }
  } catch (error) {
    console.error('Error summarizing article:', error)
    // Fallback to truncated content
    return {
      summary: content.slice(0, 200) + '...',
      relevanceScore: 0.5,
    }
  }
}

export async function batchSummarizeArticles(
  articles: Array<{ title: string; content: string }>,
  promptContext: string
): Promise<Array<{ summary: string; relevanceScore: number }>> {
  // Process in batches to avoid rate limits
  const results = []

  for (const article of articles) {
    const result = await summarizeArticle(article.title, article.content, promptContext)
    results.push(result)

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return results
}
