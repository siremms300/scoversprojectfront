'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Newspaper, Save, Tag, Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

const categories = [
  { value: 'study_abroad', label: 'Study Abroad' },
  { value: 'scholarships', label: 'Scholarships' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'student_life', label: 'Student Life' },
  { value: 'career_advice', label: 'Career Advice' },
  { value: 'news', label: 'News' },
  { value: 'tips', label: 'Tips' },
  { value: 'success_stories', label: 'Success Stories' },
]

export default function NewBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
  })

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.title || !form.content || !form.category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create post')

      toast.success('Blog post created successfully!')
      router.push('/admin/blog')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setForm(prev => ({ ...prev, status: 'draft' }))
    // Trigger submit with draft status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-gray-900">New Blog Post</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Create educational content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setForm(prev => ({ ...prev, status: 'draft' })) }}
            className="px-4 py-2.5 border border-gray-200 rounded-2xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => { setForm(prev => ({ ...prev, status: 'published' })) }}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all resize-none"
                  placeholder="A brief summary of the post"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={16}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all resize-none font-mono"
                  placeholder="Write your blog post content here..."
                  required
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-5">SEO Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => handleChange('seoTitle', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => handleChange('seoDescription', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all resize-none"
                  placeholder="Meta description for search engines"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Post Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-2">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                    placeholder="study, tips, guide"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Separate tags with commas</p>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Publishing Tips</h3>
            <ul className="space-y-2 text-[12px] text-gray-500">
              <li>• Use clear, descriptive titles</li>
              <li>• Add relevant tags for discovery</li>
              <li>• Include a compelling excerpt</li>
              <li>• Add SEO title and description</li>
              <li>• Preview before publishing</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : form.status === 'published' ? 'Publish Post' : 'Save as Draft'}
          </button>
        </div>
      </form>
    </div>
  )
}