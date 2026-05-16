'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, FileText, Building2, CreditCard, TrendingUp,
  ArrowUpRight, DollarSign, Activity,
  BarChart3, ChevronRight, Plus, Search,
  Download, Filter, MoreVertical, Eye,
  CheckCircle2, Clock, XCircle, AlertCircle,
  Sparkles, Star
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [recentApps, setRecentApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('weekly')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [analyticsData, appsData] = await Promise.all([
        api.applications.getAnalytics(token!),
        api.applications.getAll('limit=10&sort=-createdAt', token!),
      ])
      setAnalytics(analyticsData.data)
      setRecentApps(appsData.data || [])
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { 
      label: 'Total Applications', 
      value: analytics?.totalApplications?.toLocaleString() || '0', 
      change: '+12.5%', 
      trend: 'up',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100'
    },
    { 
      label: 'Conversion Rate', 
      value: `${analytics?.conversionRate || 0}%`, 
      change: '+3.2%', 
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'from-emerald-50 to-teal-50'
    },
    { 
      label: 'Active Institutions', 
      value: '245', 
      change: '+5 new', 
      trend: 'up',
      icon: Building2,
      gradient: 'from-violet-500 to-purple-500',
      bg: 'from-violet-50 to-purple-50'
    },
    { 
      label: 'Revenue', 
      value: '$45.2K', 
      change: '+8.1%', 
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'from-amber-50 to-orange-50'
    },
  ]

  const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    submitted: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
    under_review: { color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertCircle },
    processing: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Activity },
    documents_pending: { color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle },
    interview_scheduled: { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Clock },
    accepted: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
    rejected: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
    completed: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 md:p-8">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#247BF7]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#60A5FA]" />
              <span className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="text-[26px] md:text-[30px] font-bold text-white tracking-tight">
              Platform Overview
            </h1>
            <p className="text-[14px] text-gray-400 mt-1.5 max-w-md">
              Monitor applications, manage institutions, and track performance metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-2xl text-[13px] font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <Link
              href="/admin/applications/new"
              className="px-5 py-2.5 bg-white text-gray-900 rounded-2xl text-[13px] font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
            >
              <Plus className="w-4 h-4" />
              New Application
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white rounded-[20px] p-5 border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-[14px] flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-[12px] font-semibold ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-[28px] font-bold text-gray-900 tracking-tight">{stat.value}</p>
            <p className="text-[13px] text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications Table */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-gray-900">Recent Applications</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">Latest submissions across all programs</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:border-[#247BF7] focus:ring-1 focus:ring-[#247BF7]/10 transition-all w-40"
                  />
                </div>
                <Link href="/admin/applications" className="text-[13px] text-[#247BF7] font-medium hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Program</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Probability</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentApps.slice(0, 8).map((app: any) => {
                    const status = statusConfig[app.status] || statusConfig.submitted
                    const StatusIcon = status.icon
                    return (
                      <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-[10px] flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-[11px] font-semibold">
                                {app.userId?.firstName?.charAt(0)}{app.userId?.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-gray-900">
                                {app.userId?.firstName} {app.userId?.lastName}
                              </p>
                              <p className="text-[11px] text-gray-400">{app.userId?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[13px] text-gray-700">{app.programType}</span>
                        </td>
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
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] text-gray-500 capitalize">{app.source}</span>
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
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[20px] border border-gray-100/80 p-5 md:p-6">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Application Trends</h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-2xl">
                <BarChart3 className="w-10 h-10 text-gray-300" />
                <span className="text-[13px] text-gray-400 ml-2">Chart data</span>
              </div>
            </div>
            <div className="bg-white rounded-[20px] border border-gray-100/80 p-5 md:p-6">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Source Attribution</h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-2xl">
                <Activity className="w-10 h-10 text-gray-300" />
                <span className="text-[13px] text-gray-400 ml-2">Chart data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Source Breakdown */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Source Breakdown</h3>
            <div className="space-y-3">
              {analytics?.sourceBreakdown?.map((source: any) => (
                <div key={source.source} className="space-y-1.5">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-gray-600 capitalize">{source.source}</span>
                    <span className="font-medium text-gray-900">{source.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#247BF7] to-[#6366F1] rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Probability Distribution */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Probability Distribution</h3>
            <div className="space-y-3">
              {[
                { label: 'High', value: analytics?.probabilityDistribution?.find((p: any) => p._id === 'high')?.count || 0, color: 'bg-emerald-500' },
                { label: 'Medium', value: analytics?.probabilityDistribution?.find((p: any) => p._id === 'medium')?.count || 0, color: 'bg-amber-500' },
                { label: 'Low', value: analytics?.probabilityDistribution?.find((p: any) => p._id === 'low')?.count || 0, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
                    <span className="text-[13px] text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {[
                { label: 'Add Institution', href: '/admin/institutions/new', icon: Building2 },
                { label: 'Create Scholarship', href: '/admin/scholarships/new', icon: Star },
                { label: 'Write Blog Post', href: '/admin/blog/new', icon: FileText },
                { label: 'View Reports', href: '/admin/analytics', icon: BarChart3 },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="w-4 h-4 text-gray-400 group-hover:text-[#247BF7] transition-colors" />
                    <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{action.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}