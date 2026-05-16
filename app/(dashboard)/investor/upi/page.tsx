'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CreditCard, TrendingUp, Users, Target,
  Building2, GraduationCap, ArrowUpRight,
  Star, BookOpen, ChevronRight
} from 'lucide-react'

export default function InvestorUPITrackingPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const [programsRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/upi`),
        fetch(`${apiUrl}/upi/analytics/data`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      
      const programsData = await programsRes.json()
      const statsData = await statsRes.json()
      
      setPrograms(programsData.data || [])
      setStats(statsData.data)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">UPI Program Tracking</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Monitor program performance and enrollments</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Programs', value: stats.totalPrograms, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
            { label: 'Total Enrollments', value: stats.totalEnrollments, icon: Users, color: 'from-emerald-500 to-teal-500' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: Target, color: 'from-violet-500 to-purple-500' },
            { label: 'Active Students', value: stats.activeEnrollments, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-[20px] p-5 border border-gray-100/80">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-[14px] flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[12px] text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Programs Table */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900">Program Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Program</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Field</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Level</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Credits</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Enrollments</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Rating</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-10 bg-gray-100 animate-pulse rounded-lg" /></td></tr>
                ))
              ) : programs.map((program: any) => (
                <tr key={program._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-[#247BF7]" />
                      </div>
                      <p className="text-[13px] font-medium text-gray-900">{program.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-600">{program.field}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-600 capitalize">{program.level}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-600">{program.credits}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-semibold text-gray-900">
                      {program.enrolledStudents?.length || 0}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-[12px] text-gray-600">{program.averageRating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/upi-program/${program.slug}`}
                      className="text-[12px] text-[#247BF7] font-medium hover:underline"
                    >
                      View
                    </Link>
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