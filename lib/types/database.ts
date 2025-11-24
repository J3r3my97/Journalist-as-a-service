export type User = {
  id: string
  email: string
  timezone: string
  tier: 'free' | 'pro'
  created_at: string
  updated_at: string
}

export type Prompt = {
  id: string
  user_id: string
  title: string
  prompt_text: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Article = {
  id: string
  prompt_id: string
  title: string
  url: string
  source: string
  summary: string
  published_at: string
  curated_at: string
  relevance_score: number
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      prompts: {
        Row: Prompt
        Insert: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'curated_at'>
        Update: Partial<Omit<Article, 'id' | 'prompt_id' | 'curated_at'>>
      }
    }
  }
}
