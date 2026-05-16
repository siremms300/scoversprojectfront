'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, FileText, BookOpen, TrendingUp, Building2,
  ChevronRight, Search, Filter, Download, Plus,
  CheckCircle2, Clock, XCircle, AlertCircle,
  ArrowUpRight, GraduationCap, Star, Globe
} from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'

export default function UniversityDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const [appsRes, programsRes] = await Promise.all([
        api.applications.getAll('limit=10', token!),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses?institution=${user?.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json())
      ])
      setApplications(appsRes.data || [])
      setPrograms(programsRes.data || [])
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Accepted', value: applications.filter((a: any) => a.status === 'accepted').length, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
    { label: 'In Review', value: applications.filter((a: any) => a.status === 'under_review').length, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Active Programs', value: programs.length, icon: BookOpen, color: 'from-violet-500 to-violet-600' },
  ]

  const statusColors: Record<string, string> = {
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    under_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    documents_pending: 'bg-orange-50 text-orange-700 border-orange-200',
    interview_scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className="flex h-screen bg-[#FAFBFC]">
      <Sidebar role="university" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                University Dashboard
              </h1>
              <p className="text-gray-500 mt-1">Manage applications and programs</p>
            </div>
            <div className="flex gap-3">
              <button className="border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <Link
                href="/university/programs/new"
                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Program
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-premium p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'applications', label: 'Applications' },
              { id: 'programs', label: 'Programs' },
              { id: 'students', label: 'Students' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-[#247BF7] text-[#247BF7]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Applications Table */}
          {activeTab === 'applications' && (
            <div className="card-premium p-5 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] transition-all w-48"
                    />
                  </div>
                  <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Program</th>
                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Documents</th>
                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app: any) => (
                        <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {app.userId?.firstName?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {app.userId?.firstName} {app.userId?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{app.userId?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-gray-600">
                            {app.targetCourse?.name || app.programType}
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[app.status] || 'bg-gray-50 text-gray-700'}`}>
                              {app.status?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              {app.documents?.length > 0 ? (
                                <span className="text-xs text-emerald-600 font-medium">
                                  {app.documents.length} uploaded
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">None</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-sm text-gray-500">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <Link
                              href={`/university/applications/${app._id}`}
                              className="text-[#247BF7] text-sm font-medium hover:underline"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-gray-600 font-medium mb-2">No applications yet</h3>
                  <p className="text-sm text-gray-400">Applications will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* Programs List */}
          {activeTab === 'programs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program: any, index: number) => (
                <motion.div
                  key={program._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-premium p-5 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#247BF7]" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      program.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{program.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{program.level} • {program.duration}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {program.currentStudents || 0} students
                    </span>
                    <Link
                      href={`/university/programs/${program._id}`}
                      className="text-[#247BF7] text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      Manage <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
              <Link
                href="/university/programs/new"
                className="card-premium p-5 border-2 border-dashed border-gray-300 hover:border-[#247BF7] transition-colors flex flex-col items-center justify-center text-center min-h-[200px] group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#247BF7]/10 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#247BF7] transition-colors" />
                </div>
                <p className="font-medium text-gray-500 group-hover:text-[#247BF7] transition-colors">
                  Add New Program
                </p>
                <p className="text-xs text-gray-400 mt-1">Create a new course offering</p>
              </Link>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Application Chart */}
                <div className="card-premium p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                    <TrendingUp className="w-12 h-12 text-gray-300" />
                    <span className="text-gray-400 ml-3">Chart placeholder</span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card-premium p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'New application received', student: 'John Doe', time: '2 hours ago', icon: FileText, color: 'bg-blue-100 text-blue-600' },
                      { action: 'Documents verified', student: 'Jane Smith', time: '5 hours ago', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
                      { action: 'Application approved', student: 'Mike Johnson', time: '1 day ago', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
                      { action: 'Interview scheduled', student: 'Sarah Williams', time: '2 days ago', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.student} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="card-premium p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Acceptance Rate', value: '68%', trend: 'up', change: '+5%' },
                      { label: 'Avg. Response Time', value: '4.2h', trend: 'down', change: '-0.5h' },
                      { label: 'Document Completion', value: '82%', trend: 'up', change: '+3%' },
                      { label: 'Student Satisfaction', value: '4.8/5', trend: 'up', change: '+0.2' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-600">{stat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{stat.value}</span>
                          <span className={`text-xs ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="card-premium p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
                  <div className="space-y-3">
                    {[
                      { event: 'Fall 2025 Intake', date: 'Jan 15, 2025', type: 'Application' },
                      { event: 'Scholarship Review', date: 'Jan 20, 2025', type: 'Internal' },
                      { event: 'Spring Semester Start', date: 'Feb 1, 2025', type: 'Academic' },
                    ].map((deadline, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-[#247BF7] rounded-full flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{deadline.event}</p>
                          <p className="text-xs text-gray-500">{deadline.date} • {deadline.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}