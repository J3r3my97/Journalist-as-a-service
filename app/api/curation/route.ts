import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { fetchRelevantArticles } from '@/lib/services/news-fetcher'
import { summarizeArticle } from '@/lib/services/ai-summarizer'

// This endpoint should be called by a cron job (Vercel Cron or external service)
export async function POST(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get all active prompts from all users
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_active', true)

    if (promptsError || !prompts) {
      return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
    }

    let totalArticlesCurated = 0
    const errors = []

    // Process each prompt
    for (const prompt of prompts) {
      try {
        // Fetch relevant articles for this prompt
        const articles = await fetchRelevantArticles(prompt.prompt_text, 10)

        // Summarize and store each article
        for (const article of articles) {
          try {
            // Check if article already exists (deduplication by URL)
            const { data: existingArticle } = await supabase
              .from('articles')
              .select('id')
              .eq('prompt_id', prompt.id)
              .eq('url', article.link)
              .single()

            if (existingArticle) {
              continue // Skip if already curated
            }

            // Summarize the article using AI
            const { summary, relevanceScore } = await summarizeArticle(
              article.title,
              article.content,
              prompt.prompt_text
            )

            // Store the curated article
            await supabase.from('articles').insert({
              prompt_id: prompt.id,
              title: article.title,
              url: article.link,
              source: article.source,
              summary,
              published_at: article.pubDate,
              relevance_score: relevanceScore,
            })

            totalArticlesCurated++
          } catch (articleError) {
            console.error(`Error processing article:`, articleError)
            errors.push({ prompt_id: prompt.id, article_title: article.title, error: String(articleError) })
          }
        }
      } catch (promptError) {
        console.error(`Error processing prompt ${prompt.id}:`, promptError)
        errors.push({ prompt_id: prompt.id, error: String(promptError) })
      }
    }

    return NextResponse.json({
      success: true,
      prompts_processed: prompts.length,
      articles_curated: totalArticlesCurated,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Curation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Manual trigger endpoint for testing (protected)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return POST(request)
}
