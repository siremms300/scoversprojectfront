// client/app/(dashboard)/admin/applications/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search, Filter, ChevronRight, Eye, Download,
  CheckCircle2, Clock, XCircle, AlertCircle, Activity,
  ChevronLeft
} from 'lucide-react'
import { api } from '@/lib/api'

const statusFilters = [
  { value: '', label: 'All' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'In Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
]

const statusConfig: Record<string, any> = {
  submitted: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
  under_review: { color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertCircle },
  processing: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Activity },
  accepted: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  rejected: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
  completed: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
}

export default function AdminApplicationsPage() {
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
      params.append('limit', '15')

      const data = await api.applications.getAll(params.toString(), token!)
      setApplications(data.data || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Applications</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage and review all applications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 border border-gray-200 rounded-2xl text-[13px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1) }}
              className={`px-4 py-2.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all ${
                statusFilter === f.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Student</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Program</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Probability</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Source</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Date</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : applications.map((app: any) => {
                const status = statusConfig[app.status] || statusConfig.submitted
                const StatusIcon = status.icon
                return (
                  <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-[10px] flex items-center justify-center">
                          <span className="text-white text-[11px] font-semibold">
                            {app.userId?.firstName?.charAt(0)}{app.userId?.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{app.userId?.firstName} {app.userId?.lastName}</p>
                          <p className="text-[11px] text-gray-400">{app.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-700">{app.programType}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {app.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[12px] font-semibold ${
                        app.probabilityScore === 'high' ? 'text-emerald-600' :
                        app.probabilityScore === 'medium' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {app.probabilityScore?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-500 capitalize">{app.source}</td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/applications/${app._id}`}
                        className="inline-flex items-center gap-1 text-[12px] text-[#247BF7] font-medium hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
            <p className="text-[12px] text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all ${
                    page === i + 1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}