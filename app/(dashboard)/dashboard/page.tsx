'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  FileText, CreditCard, Award, TrendingUp,
  ArrowRight, Clock, CheckCircle2, Plus,
  Sparkles, Star, Compass, ChevronRight,
  MessageSquare, Search, Zap
} from 'lucide-react'
import { api } from '@/lib/api'

export default function UserDashboard() {
  const [applications, setApplications] = useState<any[]>([])
  const [upiProgress, setUpiProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
    
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [appsRes, upiRes] = await Promise.all([
        api.applications.getAll('limit=5', token!),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/upi/my-progress`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
      ])
      setApplications(appsRes.data || [])
      setUpiProgress(upiRes.data || [])
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    submitted: { color: 'text-blue-600', bg: 'bg-blue-50', icon: FileText },
    under_review: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    accepted: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
    rejected: { color: 'text-red-600', bg: 'bg-red-50', icon: CheckCircle2 },
    completed: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  }

  const stats = [
    { label: 'Applications', value: applications.length, icon: FileText, gradient: 'from-blue-500 to-blue-600' },
    { label: 'In Review', value: applications.filter((a: any) => a.status === 'under_review').length, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
    { label: 'Accepted', value: applications.filter((a: any) => a.status === 'accepted').length, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'UPI Active', value: upiProgress.length, icon: TrendingUp, gradient: 'from-violet-500 to-purple-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 md:p-8">
        {/* Decorative dots pattern using CSS instead of SVG data URL */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        {/* Glow effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#247BF7]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#60A5FA]" />
              <span className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">{greeting}</span>
            </div>
            <h1 className="text-[26px] md:text-[30px] font-bold text-white tracking-tight">
              Continue your journey
            </h1>
            <p className="text-[14px] text-gray-400 mt-1.5 max-w-md">
              Track your applications, monitor UPI progress, and discover new opportunities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/institutions"
              className="px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-2xl text-[13px] font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>
            <Link
              href="/upi-program/apply"
              className="px-5 py-2.5 bg-white text-gray-900 rounded-2xl text-[13px] font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
            >
              <Plus className="w-4 h-4" />
              New Application
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white rounded-[20px] p-5 border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-[14px] flex items-center justify-center mb-4 shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-[28px] font-bold text-gray-900 tracking-tight">{stat.value}</p>
            <p className="text-[13px] text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-gray-900">Recent Applications</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">Your latest application submissions</p>
              </div>
              <Link href="/dashboard/applications" className="text-[13px] text-[#247BF7] font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[60px] bg-gray-50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : applications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {applications.map((app: any) => {
                  const status = statusConfig[app.status] || statusConfig.submitted
                  return (
                    <Link
                      key={app._id}
                      href={`/dashboard/applications/${app._id}`}
                      className="flex items-center justify-between p-4 md:p-5 hover:bg-gray-50/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${status.bg}`}>
                          <status.icon className={`w-5 h-5 ${status.color}`} />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-gray-900">
                            {app.programType === 'UPI' ? 'UPI Program' : app.programType} Application
                          </p>
                          <p className="text-[12px] text-gray-400 mt-0.5">
                            {new Date(app.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric', year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${status.bg} ${status.color}`}>
                          {app.status?.replace(/_/g, ' ')}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-600 mb-1">No applications yet</h3>
                <p className="text-[13px] text-gray-400 mb-5">Start your first application today</p>
                <Link
                  href="/upi-program/apply"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#247BF7] text-white rounded-2xl text-[13px] font-medium hover:bg-[#1E40AF] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Apply Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* UPI Progress */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-[#247BF7]" />
              <h3 className="text-[14px] font-semibold text-gray-900">UPI Progress</h3>
            </div>
            {upiProgress.length > 0 ? (
              <div className="space-y-3">
                {upiProgress.map((item: any) => (
                  <div key={item.program?._id} className="p-3.5 bg-gray-50/80 rounded-2xl">
                    <p className="text-[13px] font-semibold text-gray-900">{item.program?.name}</p>
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                        <span>Progress</span>
                        <span className="font-medium">{item.enrollment?.progress || 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#247BF7] to-[#6366F1] rounded-full transition-all duration-500"
                          style={{ width: `${item.enrollment?.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-[13px] text-gray-500">No enrollments</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[
                { label: 'Browse Institutions', href: '/institutions', icon: Search },
                { label: 'Find Scholarships', href: '/scholarships', icon: Star },
                { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
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