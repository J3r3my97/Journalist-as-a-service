"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Article, Prompt } from '@/lib/types/database'

type FeedData = {
  prompt: Prompt
  articles: Article[]
}

export default function FeedPage() {
  const [feedData, setFeedData] = useState<FeedData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadFeed()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    }
  }

  const loadFeed = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        setFeedData(data)
      } else {
        setError('Failed to load feed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your feed...</div>
      </div>
    )
  }

  const totalArticles = feedData.reduce((sum, item) => sum + item.articles.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Journalist as a Service</h1>
          <div className="flex gap-4">
            <a
              href="/prompts"
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Manage Prompts
            </a>
            <a
              href="/settings"
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Settings
            </a>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-sm text-gray-600 dark:text-gray-400">
            {totalArticles} articles curated today
          </h2>
        </div>

        {feedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No articles yet. Your first curation will arrive tomorrow morning!
            </p>
            <a
              href="/prompts"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Prompt
            </a>
          </div>
        ) : (
          <div className="space-y-12">
            {feedData.map((item) => (
              <section key={item.prompt.id} className="space-y-4">
                {/* Prompt Header */}
                <div className="border-l-4 border-blue-600 pl-4">
                  <h2 className="text-2xl font-bold">{item.prompt.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.prompt.prompt_text}
                  </p>
                </div>

                {/* Articles */}
                <div className="space-y-6">
                  {item.articles.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">
                      No articles found for this prompt today.
                    </p>
                  ) : (
                    item.articles.map((article) => (
                      <article
                        key={article.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition"
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                            {article.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            {article.summary}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{article.source}</span>
                              <span>
                                {new Date(article.published_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <span className="text-blue-600 group-hover:underline">
                              Read more →
                            </span>
                          </div>
                        </a>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
