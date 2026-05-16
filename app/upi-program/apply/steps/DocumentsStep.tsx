'use client'

import { useState, useRef } from 'react'
import { ArrowRight, ArrowLeft, Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react'

const documentTypes = [
  { type: 'transcript', label: 'Academic Transcript', required: true, icon: FileText },
  { type: 'passport', label: 'Passport / ID', required: true, icon: FileText },
  { type: 'cv', label: 'CV / Resume', required: false, icon: FileText },
  { type: 'sop', label: 'Statement of Purpose', required: false, icon: FileText },
  { type: 'recommendation', label: 'Recommendation Letter', required: false, icon: FileText },
  { type: 'ielts', label: 'IELTS / TOEFL Score', required: false, icon: FileText },
]

interface UploadedDoc {
  type: string
  label: string
  file?: File
  name?: string
}

interface Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function DocumentsStep({ data, onUpdate, onNext, onBack }: Props) {
  const [documents, setDocuments] = useState<UploadedDoc[]>(
    data?.length ? data : documentTypes.map(d => ({ type: d.type, label: d.label }))
  )
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleFileSelect = (type: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.type === type ? { ...doc, file, name: file.name } : doc
    ))
  }

  const handleRemove = (type: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.type === type ? { ...doc, file: undefined, name: undefined } : doc
    ))
  }

  const handleContinue = () => {
    const requiredDocs = documentTypes.filter(d => d.required)
    const uploadedRequired = requiredDocs.every(reqDoc => 
      documents.find(d => d.type === reqDoc.type && d.file)
    )
    
    if (!uploadedRequired) {
      return // Show error or prevent
    }

    onUpdate(documents.filter(d => d.file))
    onNext()
  }

  const allRequiredUploaded = documentTypes
    .filter(d => d.required)
    .every(reqDoc => documents.find(d => d.type === reqDoc.type && d.file))

  return (
    <div className="space-y-6">
      <div className="card-premium p-6 md:p-8">
        <p className="text-sm text-gray-500 mb-6">
          Upload the required documents. You can also upload optional documents to strengthen your application.
        </p>

        <div className="space-y-4">
          {documents.map((doc) => {
            const isRequired = documentTypes.find(d => d.type === doc.type)?.required
            const Icon = documentTypes.find(d => d.type === doc.type)?.icon || FileText
            
            return (
              <div
                key={doc.type}
                className={`border-2 rounded-xl p-4 transition-all ${
                  doc.file
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      doc.file ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      {doc.file ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {doc.label}
                        {isRequired && <span className="text-red-400 ml-1">*</span>}
                      </p>
                      {doc.file ? (
                        <p className="text-xs text-emerald-600">{doc.name}</p>
                      ) : (
                        <p className="text-xs text-gray-400">
                          {isRequired ? 'Required' : 'Optional'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    {doc.file ? (
                      <button
                        type="button"
                        onClick={() => handleRemove(doc.type)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[doc.type]?.click()}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                    )}
                    <input
                      ref={(el) => { fileInputRefs.current[doc.type] = el }}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(doc.type, file)
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!allRequiredUploaded && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              Please upload all required documents before continuing.
            </p>
          </div>
        )}
      </div>

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
          onClick={handleContinue}
          disabled={!allRequiredUploaded}
          className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}