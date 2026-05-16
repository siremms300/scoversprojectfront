'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plus, Search, CreditCard, GraduationCap, Clock,
  Globe, Users, Edit, Trash2, Eye, TrendingUp,
  Star, ChevronRight, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUPIPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchPrograms()
    fetchStats()
  }, [])

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      
      const response = await fetch(`${apiUrl}/upi?${params}`)
      const data = await response.json()
      setPrograms(data.data || [])
    } catch (error) {
      console.error('Failed to fetch programs:', error)
    } finally {
      setLoading(false)
    }
  }


  
//   const fetchStats = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
//       const response = await fetch(`${apiUrl}/upi/analytics`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const data = await response.json()
//       setStats(data.data)
//     } catch (error) {
//       console.error('Failed to fetch stats:', error)
//     }
//   }




    const fetchStats = async () => {
    try {
        const token = localStorage.getItem('token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiUrl}/upi/analytics/data`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setStats(data.data)
    } catch (error) {
        console.error('Failed to fetch stats:', error)
    }
    }






  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      await fetch(`${apiUrl}/upi/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Program deleted')
      fetchPrograms()
    } catch (error) {
      toast.error('Failed to delete program')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">UPI Program Management</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage university pathway programs</p>
        </div>
        <Link
          href="/admin/upi/new"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          New Program
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Programs', value: stats.totalPrograms, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
            { label: 'Total Enrollments', value: stats.totalEnrollments, icon: Users, color: 'from-emerald-500 to-teal-500' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
            { label: 'Active Students', value: stats.activeEnrollments, icon: GraduationCap, color: 'from-amber-500 to-orange-500' },
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

      {/* Search */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPrograms()}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-[20px]" />
          ))
        ) : programs.map((program) => (
          <motion.div
            key={program._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[20px] border border-gray-100/80 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#247BF7]" />
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/admin/upi/${program._id}/edit`} className="p-2 text-gray-400 hover:text-[#247BF7] transition-colors">
                  <Edit className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(program._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{program.name}</h3>
            <p className="text-[12px] text-gray-500 mb-3">{program.field} • {program.level}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {program.duration}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <GraduationCap className="w-3.5 h-3.5" />
                {program.credits} Credits
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <Globe className="w-3.5 h-3.5" />
                {program.mode?.replace(/_/g, ' ')}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <Users className="w-3.5 h-3.5" />
                {program.enrolledStudents?.length || 0} enrolled
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                program.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                program.status === 'coming_soon' ? 'bg-blue-50 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {program.status?.replace(/_/g, ' ')}
              </span>
              <Link
                href={`/admin/upi/${program._id}`}
                className="flex items-center gap-1 text-[12px] text-[#247BF7] hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                View
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}