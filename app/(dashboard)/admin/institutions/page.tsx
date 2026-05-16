'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search, Plus, Building2, MapPin, Star,
  ChevronRight, Edit, Trash2, Eye, MoreVertical,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminInstitutionsPage() {
  const [institutions, setInstitutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchInstitutions()
  }, [search, page])

  const fetchInstitutions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      params.append('page', page.toString())
      params.append('limit', '12')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions?${params}`)
      const data = await response.json()
      setInstitutions(data.data || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this institution?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/institutions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Institution deleted')
      fetchInstitutions()
    } catch (error) {
      toast.error('Failed to delete institution')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Institutions</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage partner institutions</p>
        </div>
        <Link
          href="/admin/institutions/new"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Institution
        </Link>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-100/80 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search institutions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-[20px]" />
          ))
        ) : institutions.map((inst) => (
          <motion.div
            key={inst._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[20px] border border-gray-100/80 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                {inst.logo ? (
                  <img src={inst.logo} alt={inst.name} className="w-8 h-8 rounded" />
                ) : (
                  <Building2 className="w-7 h-7 text-[#247BF7]" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/institutions/${inst._id}/edit`}
                  className="p-2 text-gray-400 hover:text-[#247BF7] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(inst._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{inst.name}</h3>
            <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-3">
              <MapPin className="w-3 h-3" />
              {inst.city}, {inst.country}
            </div>

            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] font-medium text-gray-600 capitalize">
                {inst.type}
              </span>
              {inst.ranking?.global && (
                <span className="flex items-center gap-1 text-[11px] text-yellow-600">
                  <Star className="w-3 h-3 fill-current" />
                  #{inst.ranking.global}
                </span>
              )}
            </div>

            <Link
              href={`/admin/institutions/${inst._id}`}
              className="mt-4 flex items-center justify-center gap-1 w-full py-2.5 bg-gray-50 rounded-xl text-[12px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              View Details
            </Link>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-[12px] font-medium ${
                page === i + 1 ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}