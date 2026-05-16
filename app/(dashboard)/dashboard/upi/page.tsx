'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CreditCard, GraduationCap, Clock, TrendingUp,
  CheckCircle2, BookOpen, Star, ArrowRight,
  Trophy, Target, ChevronRight, Plus
} from 'lucide-react'

export default function UserUPIProgressPage() {
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/upi/my-progress`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setProgress(data.data || [])
    } catch (error) {
      console.error('Failed to fetch progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">UPI Progress</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Track your university pathway progress</p>
        </div>
        <Link
          href="/upi-program"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Explore Programs
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[20px]" />
          ))}
        </div>
      ) : progress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progress.map((item) => (
            <motion.div
              key={item.program._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[20px] border border-gray-100/80 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#247BF7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.program.name}</h3>
                    {item.program.institution && (
                      <p className="text-[12px] text-gray-500">{item.program.institution.name}</p>
                    )}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                  item.enrollment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                  item.enrollment.status === 'active' ? 'bg-blue-50 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.enrollment.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[12px] mb-2">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-semibold text-gray-900">{item.enrollment.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#247BF7] to-[#6366F1] rounded-full transition-all duration-500"
                    style={{ width: `${item.enrollment.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-lg font-bold text-gray-900">{item.program.credits}</p>
                  <p className="text-[10px] text-gray-500">Credits</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-lg font-bold text-gray-900">{item.enrollment.completedModules?.length || 0}</p>
                  <p className="text-[10px] text-gray-500">Modules Done</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-lg font-bold text-gray-900">{item.enrollment.overallGrade || '-'}</p>
                  <p className="text-[10px] text-gray-500">Grade</p>
                </div>
              </div>

              {item.enrollment.status === 'completed' ? (
                <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="font-semibold text-emerald-700">Program Completed!</p>
                    <p className="text-[12px] text-emerald-600">Credits ready for transfer</p>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/dashboard/upi/${item.program._id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <CreditCard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No UPI Enrollments</h3>
          <p className="text-gray-400 mb-6">Start your university pathway journey today</p>
          <Link
            href="/upi-program"
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Explore UPI Programs
          </Link>
        </div>
      )}
    </div>
  )
}