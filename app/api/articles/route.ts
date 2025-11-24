import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '1')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's prompts
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('id, title, prompt_text')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (promptsError || !prompts) {
      return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
    }

    // Calculate date range
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Get articles for each prompt
    const feedData = []
    for (const prompt of prompts) {
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('prompt_id', prompt.id)
        .gte('curated_at', cutoffDate.toISOString())
        .order('relevance_score', { ascending: false })
        .limit(10)

      if (!articlesError && articles) {
        feedData.push({
          prompt,
          articles,
        })
      }
    }

    return NextResponse.json(feedData)
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
