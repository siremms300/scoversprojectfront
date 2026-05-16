'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search, Plus, Newspaper, Edit, Trash2, Eye,
  Clock, Tag, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`)
      const data = await response.json()
      setPosts(data.data || [])
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Post deleted')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const statusColors: Record<string, string> = {
    published: 'bg-emerald-50 text-emerald-700',
    draft: 'bg-gray-100 text-gray-600',
    archived: 'bg-red-50 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Blog Posts</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage educational content</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Title</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Category</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Views</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Date</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-10 bg-gray-100 animate-pulse rounded-lg" /></td></tr>
                ))
              ) : posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Newspaper className="w-5 h-5 text-[#247BF7]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-[11px] text-gray-400">{post.author?.firstName} {post.author?.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-gray-600 capitalize">{post.category?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${statusColors[post.status] || ''}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">{post.views || 0}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/blog/${post._id}/edit`} className="p-2 text-gray-400 hover:text-[#247BF7] transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(post._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-[#247BF7] transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}