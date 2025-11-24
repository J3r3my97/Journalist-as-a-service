import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(prompts)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user tier and prompt count
    const { data: userData } = await supabase
      .from('users')
      .select('tier')
      .eq('id', user.id)
      .single()

    const { count } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Enforce 5 prompt limit for free tier
    if (userData?.tier === 'free' && count && count >= 5) {
      return NextResponse.json(
        { error: 'Free tier limited to 5 prompts. Upgrade to Pro for unlimited.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, prompt_text } = body

    if (!title || !prompt_text) {
      return NextResponse.json(
        { error: 'Title and prompt text are required' },
        { status: 400 }
      )
    }

    const { data: prompt, error } = await supabase
      .from('prompts')
      .insert({
        user_id: user.id,
        title,
        prompt_text,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
