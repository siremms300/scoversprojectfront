'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, FileText, User, BookOpen, Target,
  Upload, Clock, CheckCircle2, XCircle, AlertCircle,
  MessageSquare, ExternalLink, TrendingUp, Eye
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
  { status: 'completed', label: 'Completed', icon: CheckCircle2 },
]

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-50 text-blue-700',
  under_review: 'bg-yellow-50 text-yellow-700',
  processing: 'bg-purple-50 text-purple-700',
  documents_pending: 'bg-orange-50 text-orange-700',
  interview_scheduled: 'bg-indigo-50 text-indigo-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  completed: 'bg-emerald-50 text-emerald-700',
}

export default function InvestorApplicationDetailPage() {
  const { id } = useParams()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  const currentStepIndex = statusSteps.findIndex(s => s.status === application?.status)

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
      <Link href="/investor/applications" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" />
        Back to applications
      </Link>

      {/* Header */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {application.programType === 'UPI' ? 'UPI Program' : application.programType} Application
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[application.status]}`}>
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
                <TrendingUp className="w-4 h-4 inline mr-1" />
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
                    ? application.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-[#247BF7] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStepIndex ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-[11px] mt-2 font-medium whitespace-nowrap ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${index < currentStepIndex ? 'bg-[#247BF7]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              application.academicBackground.map((edu: any, i: number) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl mb-3 last:mb-0">
                  <p className="font-medium text-gray-900">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No academic information</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Program Type', value: application.programType },
                { label: 'Source', value: application.source },
                { label: 'Submitted', value: new Date(application.createdAt).toLocaleDateString() },
                { label: 'Probability', value: application.probabilityScore?.toUpperCase() || 'N/A' },
                { label: 'Documents', value: `${application.documents?.length || 0} uploaded` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-[13px] text-gray-500">{item.label}</span>
                  <span className="text-[13px] font-medium text-gray-900 capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              {application.timeline?.map((event: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-[#247BF7]' : 'bg-gray-300'}`} />
                    {i < (application.timeline?.length || 0) - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
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
        </div>
      </div>
    </div>
  )
}