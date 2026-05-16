'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Search, GraduationCap, Clock, CreditCard, Building2 } from 'lucide-react'

interface Program {
  _id: string
  name: string
  slug: string
  duration: string
  credits: number
  institution?: { name: string }
  transferableTo?: any[]
}

interface Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ProgramStep({ data, onUpdate, onNext, onBack }: Props) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<string>(data?.programId || '')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upi`)
      const result = await response.json()
      setPrograms(result.data || [])
    } catch (error) {
      console.error('Failed to fetch programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrograms = programs.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleContinue = () => {
    if (selectedProgram) {
      const program = programs.find(p => p._id === selectedProgram)
      onUpdate({
        programId: selectedProgram,
        programName: program?.name,
        programSlug: program?.slug,
      })
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrograms.map((program) => (
            <button
              key={program._id}
              onClick={() => setSelectedProgram(program._id)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                selectedProgram === program._id
                  ? 'border-[#247BF7] bg-[#247BF7]/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{program.name}</h3>
                  {program.institution && (
                    <p className="text-sm text-gray-500 mb-3">{program.institution.name}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {program.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      {program.credits} Credits
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {program.transferableTo?.length || 0} Partners
                    </span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                  selectedProgram === program._id
                    ? 'border-[#247BF7] bg-[#247BF7]'
                    : 'border-gray-300'
                }`}>
                  {selectedProgram === program._id && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

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
          disabled={!selectedProgram}
          className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}