'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  TrendingUp, Users, Target, Award, ArrowUpRight,
  BarChart3, PieChart, Activity, DollarSign,
  ChevronRight, Download, Sparkles, Eye, FileText,
  Building2, CreditCard, CheckCircle2, Clock
} from 'lucide-react'
import { api } from '@/lib/api'

export default function InvestorDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('monthly')

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const [appData, upiData] = await Promise.all([
        api.applications.getAnalytics(token!),
        fetch(`${apiUrl}/upi/analytics/data`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
      ])
      
      setMetrics({ ...appData.data, ...upiData.data })
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const kpiCards = [
    { 
      label: 'Total Applications', 
      value: metrics?.totalApplications?.toLocaleString() || '0', 
      change: '+23.5%', 
      icon: Users, 
      gradient: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    { 
      label: 'Conversion Rate', 
      value: `${metrics?.conversionRate || 0}%`, 
      change: '+4.3%', 
      icon: Target, 
      gradient: 'from-emerald-500 to-teal-500',
      trend: 'up'
    },
    { 
      label: 'UPI Enrollments', 
      value: metrics?.totalEnrollments?.toLocaleString() || '0', 
      change: '+15.2%', 
      icon: TrendingUp, 
      gradient: 'from-violet-500 to-purple-500',
      trend: 'up'
    },
    { 
      label: 'Revenue Generated', 
      value: '$128.5K', 
      change: '+18.7%', 
      icon: DollarSign, 
      gradient: 'from-amber-500 to-orange-500',
      trend: 'up'
    },
  ]

  const statusCounts = {
    total: metrics?.totalApplications || 0,
    accepted: metrics?.statusBreakdown?.find((s: any) => s._id === 'accepted')?.count || 0,
    inReview: metrics?.statusBreakdown?.find((s: any) => s._id === 'under_review')?.count || 0,
    completed: metrics?.statusBreakdown?.find((s: any) => s._id === 'completed')?.count || 0,
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
              <span className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Investor Portal</span>
            </div>
            <h1 className="text-[26px] md:text-[30px] font-bold text-white tracking-tight">
              UPI Program Performance
            </h1>
            <p className="text-[14px] text-gray-400 mt-1.5 max-w-md">
              Real-time metrics and insights on application trends, enrollments, and revenue.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white/10 rounded-xl p-1">
              {['weekly', 'monthly', 'yearly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                    timeRange === range
                      ? 'bg-white text-gray-900'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <button className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-2xl text-[13px] font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white rounded-[20px] p-5 border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-[14px] flex items-center justify-center shadow-sm`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-[12px] font-semibold ${
                card.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                <ArrowUpRight className="w-3.5 h-3.5" />
                {card.change}
              </span>
            </div>
            <p className="text-[28px] font-bold text-gray-900 tracking-tight">{card.value}</p>
            <p className="text-[13px] text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Growth Chart */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-semibold text-gray-900">Application Growth</h3>
              <Link href="/investor/applications" className="text-[13px] text-[#247BF7] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="h-72 flex items-center justify-center bg-gray-50 rounded-2xl">
              <BarChart3 className="w-12 h-12 text-gray-300" />
              <span className="text-[13px] text-gray-400 ml-2">Application growth chart</span>
            </div>
          </div>

          {/* Source Attribution */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-6">Source Attribution</h3>
            <div className="h-72 flex items-center justify-center bg-gray-50 rounded-2xl">
              <PieChart className="w-12 h-12 text-gray-300" />
              <span className="text-[13px] text-gray-400 ml-2">Source distribution chart</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Application Pipeline */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Application Pipeline</h3>
            <div className="space-y-3">
              {[
                { label: 'Total', value: statusCounts.total, icon: FileText, color: 'bg-blue-500' },
                { label: 'In Review', value: statusCounts.inReview, icon: Clock, color: 'bg-yellow-500' },
                { label: 'Accepted', value: statusCounts.accepted, icon: CheckCircle2, color: 'bg-emerald-500' },
                { label: 'Completed', value: statusCounts.completed, icon: Award, color: 'bg-violet-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
                    <span className="text-[13px] text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source Performance */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Source Performance</h3>
            <div className="space-y-3">
              {metrics?.sourceBreakdown?.slice(0, 5).map((source: any) => (
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

          {/* UPI Program Status */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-4">UPI Program Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                <div>
                  <p className="font-medium text-[13px] text-gray-900">Active Programs</p>
                  <p className="text-[11px] text-gray-500">Currently running</p>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{metrics?.totalPrograms || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-medium text-[13px] text-gray-900">Completion Rate</p>
                  <p className="text-[11px] text-gray-500">Students completed</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">{metrics?.completionRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-violet-50 rounded-xl">
                <div>
                  <p className="font-medium text-[13px] text-gray-900">Active Students</p>
                  <p className="text-[11px] text-gray-500">Currently enrolled</p>
                </div>
                <span className="text-2xl font-bold text-violet-600">{metrics?.activeEnrollments || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[
                { label: 'View Applications', href: '/investor/applications', icon: Eye },
                { label: 'UPI Tracking', href: '/investor/upi', icon: CreditCard },
                { label: 'Reports', href: '/investor/reports', icon: BarChart3 },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-gray-400 group-hover:text-[#247BF7] transition-colors" />
                    <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{link.label}</span>
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