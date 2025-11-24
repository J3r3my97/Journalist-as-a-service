"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLE_PROMPTS = [
  {
    title: 'Tech News',
    prompt_text: 'Major technology company announcements, product launches, and industry trends',
  },
  {
    title: 'AI & Machine Learning',
    prompt_text: 'Latest developments in artificial intelligence, machine learning research, and practical AI applications',
  },
  {
    title: 'Climate & Environment',
    prompt_text: 'Climate policy, renewable energy developments, and environmental science breakthroughs',
  },
  {
    title: 'Startup Ecosystem',
    prompt_text: 'Venture capital funding rounds, startup acquisitions, and founder stories',
  },
  {
    title: 'Business News',
    prompt_text: 'Major business developments, market trends, and economic policy updates',
  },
]

export default function OnboardingPage() {
  const [selectedPrompts, setSelectedPrompts] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const togglePrompt = (index: number) => {
    setSelectedPrompts(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleComplete = async () => {
    if (selectedPrompts.length === 0) {
      setError('Please select at least one prompt to get started')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create all selected prompts
      const promises = selectedPrompts.map(async (index) => {
        const prompt = EXAMPLE_PROMPTS[index]
        return fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prompt),
        })
      })

      const results = await Promise.all(promises)
      const failed = results.filter(r => !r.ok)

      if (failed.length > 0) {
        setError('Some prompts failed to create. Please try again.')
        setLoading(false)
        return
      }

      // Redirect to feed
      router.push('/feed')
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Let's create your first prompts
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Select 1-5 topics you'd like to follow. You can customize these later.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => togglePrompt(index)}
              className={`p-6 text-left rounded-lg border-2 transition ${
                selectedPrompts.includes(index)
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {prompt.prompt_text}
              </p>
            </button>
          ))}
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={handleComplete}
            disabled={loading || selectedPrompts.length === 0}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {loading ? 'Setting up...' : 'Get Started'}
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            Your first curation will arrive tomorrow morning at 6 AM
          </p>

          <button
            onClick={() => router.push('/prompts')}
            className="text-sm text-blue-600 hover:underline"
          >
            Skip and create custom prompts
          </button>
        </div>
      </div>
    </div>
  )
}
