'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CreditCard, BookOpen, Clock, Globe,
  CheckCircle2, GraduationCap, DollarSign, Star,
  Users, Building2, ArrowRight, Calendar, Shield,
  Edit, Trash2, Eye, TrendingUp, Plus, Save
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUPIProgramDetailPage() {
  const { id } = useParams()
  const [program, setProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchProgram()
    fetchStudents()
  }, [id])

  const fetchProgram = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/upi/${id}`)
      const data = await response.json()
      setProgram(data.data)
    } catch (error) {
      console.error('Failed to fetch program:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/upi/${id}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setStudents(data.data || [])
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program? This cannot be undone.')) return
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      await fetch(`${apiUrl}/upi/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Program deleted')
      window.location.href = '/admin/upi'
    } catch (error) {
      toast.error('Failed to delete program')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-96 bg-gray-200 animate-pulse rounded-[20px]" />
      </div>
    )
  }

  if (!program) {
    return (
      <div className="text-center py-20">
        <CreditCard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Program not found</h3>
        <Link href="/admin/upi" className="text-[#247BF7] hover:underline mt-2 inline-block">
          Back to UPI Programs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/upi" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" />
          Back to UPI Programs
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/upi/${id}/edit`}
            className="px-4 py-2.5 border border-gray-200 rounded-2xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 border border-red-200 rounded-2xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                program.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                program.status === 'coming_soon' ? 'bg-blue-50 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {program.status?.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-100 text-gray-600 capitalize">
                {program.mode?.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
            <p className="text-[13px] text-gray-500 mt-1">{program.field} • {program.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Credits', value: program.credits, icon: GraduationCap },
            { label: 'Duration', value: program.duration, icon: Clock },
            { label: 'Students', value: students.length, icon: Users },
            { label: 'Modules', value: program.curriculum?.length || 0, icon: BookOpen },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-2xl">
              <stat.icon className="w-5 h-5 text-[#247BF7] mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[11px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'curriculum', label: 'Curriculum' },
          { id: 'students', label: 'Students' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-[#247BF7] text-[#247BF7]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">{program.description}</p>
            </div>

            {program.requirements?.length > 0 && (
              <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {program.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Program Details</h3>
              <div className="space-y-2">
                {[
                  { label: 'Duration', value: program.duration },
                  { label: 'Credits', value: program.credits },
                  { label: 'Level', value: program.level },
                  { label: 'Mode', value: program.mode },
                  { label: 'Max Students', value: program.maxStudents || 'Unlimited' },
                  { label: 'Tuition', value: program.tuition?.amount ? `$${program.tuition.amount}` : 'N/A' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-[12px] text-gray-500">{item.label}</span>
                    <span className="text-[12px] font-medium text-gray-900 capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {program.startDates?.length > 0 && (
              <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Start Dates</h3>
                <div className="space-y-2">
                  {program.startDates.map((date: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Curriculum Tab */}
      {activeTab === 'curriculum' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Curriculum Modules</h3>
          <div className="space-y-3">
            {program.curriculum?.map((module: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{module.module}</p>
                  <span className="text-[11px] text-gray-400">Module {i + 1}</span>
                </div>
                {module.description && (
                  <p className="text-[12px] text-gray-500 mb-2">{module.description}</p>
                )}
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span>{module.credits} Credits</span>
                  <span>{module.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">Enrolled Students ({students.length})</h3>
          </div>
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Student</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Progress</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Grade</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((student: any) => (
                    <tr key={student._id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-[10px] flex items-center justify-center">
                            <span className="text-white text-[11px] font-semibold">
                              {student.user?.firstName?.charAt(0)}{student.user?.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-gray-900">
                              {student.user?.firstName} {student.user?.lastName}
                            </p>
                            <p className="text-[11px] text-gray-400">{student.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-1 rounded-lg text-[11px] font-medium ${
                          student.status === 'active' ? 'bg-blue-50 text-blue-700' :
                          student.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#247BF7] rounded-full" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span className="text-[12px] text-gray-500">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-gray-700">
                        {student.overallGrade || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-gray-500">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No students enrolled yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}