'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, PieChart, TrendingUp, Activity,
  Users, Target, DollarSign, ArrowUpRight,
  Download, Calendar, Star, CreditCard
} from 'lucide-react'
import { api } from '@/lib/api'

export default function InvestorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('monthly')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const [appData, upiData] = await Promise.all([
        api.applications.getAnalytics(token!),
        fetch(`${apiUrl}/upi/analytics/data`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
      ])
      
      setAnalytics({ ...appData.data, ...upiData.data })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const revenueData = {
    total: '$128,500',
    averagePerStudent: '$2,570',
    projectedMonthly: '$15,200',
    growth: '+18.7%',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Analytics</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Detailed performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1">
            {['weekly', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  period === p ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="px-4 py-2.5 border border-gray-200 rounded-2xl text-[13px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: revenueData.total, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
          { label: 'Avg Per Student', value: revenueData.averagePerStudent, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Projected Monthly', value: revenueData.projectedMonthly, icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
          { label: 'Revenue Growth', value: revenueData.growth, icon: Activity, color: 'from-amber-500 to-orange-500' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-[20px] p-5 border border-gray-100/80">
            <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-[14px] flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-[12px] text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <div className="h-72 flex items-center justify-center bg-gray-50 rounded-2xl">
            <BarChart3 className="w-12 h-12 text-gray-300" />
            <span className="text-[13px] text-gray-400 ml-2">Revenue chart</span>
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Enrollment Growth</h3>
          <div className="h-72 flex items-center justify-center bg-gray-50 rounded-2xl">
            <TrendingUp className="w-12 h-12 text-gray-300" />
            <span className="text-[13px] text-gray-400 ml-2">Enrollment chart</span>
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="h-72 flex items-center justify-center bg-gray-50 rounded-2xl">
            <PieChart className="w-12 h-12 text-gray-300" />
            <span className="text-[13px] text-gray-400 ml-2">Conversion chart</span>
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Program Distribution</h3>
          <div className="h-72 flex items-center justify-center bg-gray-50 rounded-2xl">
            <BarChart3 className="w-12 h-12 text-gray-300" />
            <span className="text-[13px] text-gray-400 ml-2">Distribution chart</span>
          </div>
        </div>
      </div>

      {/* Top Programs Table */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900">Top Performing Programs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">#</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Program</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Enrollments</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Completion</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Revenue</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(analytics?.popularPrograms || []).map((program: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-bold text-gray-400">#{i + 1}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-gray-900">{program.name}</p>
                    <p className="text-[11px] text-gray-400">{program.field}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-900">{program.enrollmentCount}</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600">--</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600">--</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-[12px] text-gray-600">{program.averageRating || 'N/A'}</span>
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