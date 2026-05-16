'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, PieChart, Activity, TrendingUp,
  Users, FileText, Download, Calendar
} from 'lucide-react'
import { api } from '@/lib/api'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('monthly')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const data = await api.applications.getAnalytics(token!)
      setAnalytics(data.data)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Analytics</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Platform performance insights</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
          {['weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-all ${
                period === p ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: analytics?.totalApplications || 0, icon: FileText },
          { label: 'Conversion Rate', value: `${analytics?.conversionRate || 0}%`, icon: TrendingUp },
          { label: 'Weekly Growth', value: `${analytics?.weeklyGrowth || 0}%`, icon: Activity },
          { label: 'Active Users', value: '1,245', icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[20px] p-5 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className="w-5 h-5 text-[#247BF7]" />
              <span className="text-[12px] text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Application Trends</h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-2xl">
            <BarChart3 className="w-16 h-16 text-gray-200" />
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Source Distribution</h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-2xl">
            <PieChart className="w-16 h-16 text-gray-200" />
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Probability Breakdown</h3>
          <div className="space-y-4 mt-4">
            {['high', 'medium', 'low'].map((level) => {
              const count = analytics?.probabilityDistribution?.find((p: any) => p._id === level)?.count || 0
              const total = analytics?.totalApplications || 1
              const pct = ((count / total) * 100).toFixed(1)
              const colors: Record<string, string> = { high: 'bg-emerald-500', medium: 'bg-amber-500', low: 'bg-red-500' }
              return (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600 capitalize">{level}</span>
                    <span className="font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[level]} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-4 mt-4">
            {analytics?.statusBreakdown?.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[13px] text-gray-600 capitalize">{item._id?.replace(/_/g, ' ')}</span>
                <span className="text-[13px] font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}