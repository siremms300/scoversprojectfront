'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, FileText, User, BookOpen, Target,
  Upload, Clock, CheckCircle2, XCircle, AlertCircle,
  MessageSquare, Download, ExternalLink,
  Calendar, MapPin, Mail, Phone, Flag, GraduationCap,
  CreditCard, TrendingUp, Send
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

const statusSteps = [
  { status: 'submitted', label: 'Submitted', icon: FileText },
  { status: 'under_review', label: 'Under Review', icon: AlertCircle },
  { status: 'processing', label: 'Processing', icon: Clock },
  { status: 'documents_pending', label: 'Documents', icon: Upload },
  { status: 'interview_scheduled', label: 'Interview', icon: MessageSquare },
  { status: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { status: 'completed', label: 'Enrolled', icon: GraduationCap },
]

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  under_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  documents_pending: 'bg-orange-50 text-orange-700 border-orange-200',
  interview_scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const nextStatuses: Record<string, string[]> = {
  submitted: ['under_review', 'documents_pending', 'rejected'],
  under_review: ['processing', 'documents_pending', 'interview_scheduled', 'rejected', 'accepted'],
  processing: ['interview_scheduled', 'accepted', 'rejected'],
  documents_pending: ['under_review', 'processing', 'rejected'],
  interview_scheduled: ['accepted', 'rejected'],
  accepted: ['completed'],
}

export default function AdminApplicationDetailPage() {
  const { id } = useParams()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem('token')
      const data = await api.applications.getOne(id as string, token!)
      setApplication(data.data)
    } catch (error) {
      toast.error('Failed to load application')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return
    try {
      setUpdating(true)
      const token = localStorage.getItem('token')
      await api.applications.updateStatus(id as string, selectedStatus, note, token!)
      toast.success('Status updated successfully')
      setNote('')
      setSelectedStatus('')
      fetchApplication()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleAddNote = async () => {
    if (!note.trim()) return
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/applications/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: note, visibility: 'admin' }),
      })
      if (response.ok) {
        toast.success('Note added')
        setNote('')
        fetchApplication()
      }
    } catch (error) {
      toast.error('Failed to add note')
    }
  }

  const handleEnrollStudent = async () => {
    if (!confirm('Enroll this student in the UPI program? This will complete the application and grant them access to course materials.')) return
    
    try {
      setEnrolling(true)
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const response = await fetch(`${apiUrl}/applications/${id}/enroll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      toast.success('Student enrolled in UPI program successfully!')
      fetchApplication()
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll student')
    } finally {
      setEnrolling(false)
    }
  }

  const currentStepIndex = statusSteps.findIndex(s => s.status === application?.status)
  const availableStatuses = nextStatuses[application?.status] || []

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-64 bg-gray-200 animate-pulse rounded-[20px]" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Application not found</h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/applications" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to applications
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {application.programType === 'UPI' ? 'UPI Program' : application.programType} Application
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[application.status]}`}>
                {application.status?.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-500">Application ID: {application._id}</p>
          </div>
          <div className="flex items-center gap-2">
            {application.probabilityScore && (
              <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${
                application.probabilityScore === 'high' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : application.probabilityScore === 'medium'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {application.probabilityScore.toUpperCase()} Probability
              </span>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="flex items-center overflow-x-auto pb-2">
          {statusSteps.map((step, index) => (
            <div key={step.status} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  index <= currentStepIndex
                    ? application.status === 'rejected' && index === statusSteps.length - 1
                      ? 'bg-red-500 text-white'
                      : 'bg-[#247BF7] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStepIndex ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-[11px] mt-2 font-medium whitespace-nowrap ${
                  index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${
                  index < currentStepIndex ? 'bg-[#247BF7]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#247BF7]" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: `${application.personalInfo?.firstName || ''} ${application.personalInfo?.lastName || ''}` },
                { label: 'Email', value: application.personalInfo?.email },
                { label: 'Phone', value: application.personalInfo?.phone },
                { label: 'Nationality', value: application.personalInfo?.nationality },
                { label: 'Date of Birth', value: application.personalInfo?.dateOfBirth },
                { label: 'Location', value: `${application.personalInfo?.city || ''}, ${application.personalInfo?.state || ''}, ${application.personalInfo?.currentCountry || ''}` },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm text-gray-900 mt-0.5">{item.value || '-'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Background */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#247BF7]" />
              Academic Background
            </h2>
            {application.academicBackground?.length > 0 ? (
              <div className="space-y-3">
                {application.academicBackground.map((edu: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}/{edu.gradingScale || '4.0'}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No academic information</p>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#247BF7]" />
              Documents
            </h2>
            {application.documents?.length > 0 ? (
              <div className="space-y-3">
                {application.documents.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.status === 'verified' ? 'bg-emerald-100' : 
                        doc.status === 'rejected' ? 'bg-red-100' : 'bg-gray-200'
                      }`}>
                        {doc.status === 'verified' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : doc.status === 'rejected' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{doc.type?.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500">{doc.name}</p>
                      </div>
                    </div>
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-[#247BF7] transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No documents uploaded</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Details */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Program Type', value: application.programType },
                { label: 'Source', value: application.source },
                { label: 'Submitted', value: new Date(application.createdAt).toLocaleDateString() },
                { label: 'Probability', value: application.probabilityScore?.toUpperCase() || 'N/A' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-[13px] text-gray-500">{item.label}</span>
                  <span className="text-[13px] font-medium text-gray-900 capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] mb-3"
            >
              <option value="">Select new status</option>
              {availableStatuses.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)..."
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] resize-none mb-3 placeholder:text-gray-400"
            />
            <button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || updating}
              className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Enrollment - Only show for accepted UPI applications */}
          {application.status === 'accepted' && application.programType === 'UPI' && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[20px] border border-emerald-200 p-5">
              <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Ready for Enrollment
              </h3>
              <p className="text-[12px] text-emerald-700 mb-4">
                This application has been accepted. Enroll the student in the UPI program to grant them access to course materials and begin their learning journey.
              </p>
              <button
                onClick={handleEnrollStudent}
                disabled={enrolling}
                className="w-full bg-emerald-500 text-white py-2.5 rounded-xl text-[13px] font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                {enrolling ? 'Enrolling...' : 'Enroll in UPI Program'}
              </button>
            </div>
          )}

          {/* Already Enrolled */}
          {application.status === 'completed' && application.programType === 'UPI' && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[20px] border border-emerald-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">Student Enrolled</p>
                  <p className="text-[12px] text-emerald-600">Successfully enrolled in UPI program</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              {application.timeline?.map((event: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-[#247BF7]' : 'bg-gray-300'}`} />
                    {i < (application.timeline?.length || 0) - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-[13px] font-medium text-gray-900 capitalize">{event.status?.replace(/_/g, ' ')}</p>
                    {event.note && <p className="text-[12px] text-gray-500 mt-0.5">{event.note}</p>}
                    <p className="text-[11px] text-gray-400 mt-1">{new Date(event.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Internal Notes</h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {application.notes?.filter((n: any) => n.visibility === 'admin').map((n: any, i: number) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[12px] text-gray-700">{n.content}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {n.createdBy?.firstName} - {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {application.notes?.filter((n: any) => n.visibility === 'admin').length === 0 && (
                <p className="text-[12px] text-gray-400 text-center py-4">No notes yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal note..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:border-[#247BF7] placeholder:text-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={!note.trim()}
                className="px-3 py-2 bg-[#247BF7] text-white rounded-xl hover:bg-[#1E40AF] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}