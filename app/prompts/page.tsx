"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Prompt } from '@/lib/types/database'

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [formData, setFormData] = useState({ title: '', prompt_text: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadPrompts()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    }
  }

  const loadPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)
      }
    } catch (err) {
      setError('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (editingPrompt) {
        // Update existing prompt
        const response = await fetch(`/api/prompts/${editingPrompt.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to update prompt')
          return
        }
      } else {
        // Create new prompt
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to create prompt')
          return
        }
      }

      setFormData({ title: '', prompt_text: '' })
      setShowForm(false)
      setEditingPrompt(null)
      loadPrompts()
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setFormData({ title: prompt.title, prompt_text: prompt.prompt_text })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadPrompts()
      } else {
        setError('Failed to delete prompt')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const handleToggleActive = async (prompt: Prompt) => {
    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !prompt.is_active }),
      })

      if (response.ok) {
        loadPrompts()
      }
    } catch (err) {
      setError('Failed to toggle prompt status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Prompts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {prompts.length} of 5 prompts used (Free Tier)
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPrompt(null)
              setFormData({ title: '', prompt_text: '' })
              setShowForm(true)
            }}
            disabled={prompts.length >= 5}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            New Prompt
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 p-6 border border-gray-300 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                  placeholder="e.g., AI News"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prompt</label>
                <textarea
                  value={formData.prompt_text}
                  onChange={(e) => setFormData({ ...formData, prompt_text: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                  placeholder="e.g., Latest developments in artificial intelligence and machine learning"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingPrompt ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingPrompt(null)
                    setFormData({ title: '', prompt_text: '' })
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{prompt.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {prompt.prompt_text}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    prompt.is_active
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {prompt.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(prompt)}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(prompt)}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {prompt.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(prompt.id)}
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {prompts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No prompts yet. Create your first prompt to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
