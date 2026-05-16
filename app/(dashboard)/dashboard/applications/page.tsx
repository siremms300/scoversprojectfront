'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  FileText, Search, ChevronRight, Plus,
  Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react'
import { api } from '@/lib/api'

const statusFilters = [
  { value: '', label: 'All', icon: FileText },
  { value: 'submitted', label: 'Submitted', icon: Clock },
  { value: 'under_review', label: 'In Review', icon: AlertCircle },
  { value: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { value: 'rejected', label: 'Rejected', icon: XCircle },
]

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-50 text-blue-700',
  under_review: 'bg-yellow-50 text-yellow-700',
  processing: 'bg-purple-50 text-purple-700',
  documents_pending: 'bg-orange-50 text-orange-700',
  interview_scheduled: 'bg-indigo-50 text-indigo-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  completed: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-gray-50 text-gray-600',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, page])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (search) params.append('search', search)
      params.append('page', page.toString())
      params.append('limit', '10')

      const data = await api.applications.getAll(params.toString(), token!)
      setApplications(data.data || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">My Applications</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Track and manage your applications</p>
        </div>
        <Link
          href="/upi-program/apply"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          New Application
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => { setStatusFilter(filter.value); setPage(1) }}
              className={`px-4 py-2.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                statusFilter === filter.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[88px] bg-gray-100 animate-pulse rounded-[20px]" />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app: any, index: number) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/dashboard/applications/${app._id}`}
                className="bg-white rounded-[20px] border border-gray-100/80 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-lg hover:shadow-gray-100/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#247BF7]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {app.programType === 'UPI' ? 'UPI Program' : app.programType} Application
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${statusColors[app.status]}`}>
                        {app.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {app.targetCourse?.name && (
                      <p className="text-[12px] text-gray-500 mb-1">{app.targetCourse.name}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                      <span>Applied: {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="capitalize">Source: {app.source}</span>
                      {app.probabilityScore && (
                        <span className={`font-semibold ${
                          app.probabilityScore === 'high' ? 'text-emerald-600' :
                          app.probabilityScore === 'medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {app.probabilityScore.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#247BF7] transition-colors flex-shrink-0 hidden sm:block" />
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-12 text-center">
          <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-[15px] font-semibold text-gray-600 mb-2">No applications found</h3>
          <p className="text-[13px] text-gray-400 mb-6">Start your first application today</p>
          <Link
            href="/upi-program/apply"
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-[13px] font-medium transition-all ${
                page === i + 1
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
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