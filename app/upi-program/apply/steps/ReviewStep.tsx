'use client'

import { ArrowLeft, CheckCircle2, User, BookOpen, Target, FileText, Upload, Loader2 } from 'lucide-react'

interface Props {
  data: any
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function ReviewStep({ data, onSubmit, onBack, isSubmitting }: Props) {
  const sections = [
    {
      title: 'Personal Information',
      icon: User,
      items: [
        { label: 'Full Name', value: `${data.personalInfo?.firstName || ''} ${data.personalInfo?.lastName || ''}` },
        { label: 'Email', value: data.personalInfo?.email },
        { label: 'Phone', value: data.personalInfo?.phone },
        { label: 'Nationality', value: data.personalInfo?.nationality },
        { label: 'Date of Birth', value: data.personalInfo?.dateOfBirth },
      ],
    },
    {
      title: 'Academic Background',
      icon: BookOpen,
      items: (data.academicBackground || []).map((edu: any, i: number) => ({
        label: `Education ${i + 1}`,
        value: `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution}`,
      })),
    },
    {
      title: 'Program Selection',
      icon: Target,
      items: [
        { label: 'Program', value: data.programSelection?.programName || 'Not selected' },
      ],
    },
    {
      title: 'Classification',
      icon: FileText,
      items: (data.classificationResponses || []).map((resp: any) => ({
        label: resp.question,
        value: resp.answer,
      })),
    },
    {
      title: 'Documents',
      icon: Upload,
      items: (data.documents || []).map((doc: any) => ({
        label: doc.label || doc.type,
        value: doc.name || 'Uploaded',
      })),
    },
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="card-premium p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <section.icon className="w-5 h-5 text-[#247BF7]" />
            </div>
            <h3 className="font-semibold text-gray-900">{section.title}</h3>
          </div>

          <div className="space-y-3">
            {section.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                  {item.value || '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Submit Application
            </>
          )}
        </button>
      </div>
    </div>
  )
}