'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CreditCard, BookOpen, Clock, Globe,
  CheckCircle2, GraduationCap, DollarSign, Star,
  Users, Building2, ArrowRight, Calendar, Shield
} from 'lucide-react'

export default function UPIProgramPublicPage() {
  const { slug } = useParams()
  const [program, setProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgram()
  }, [slug])

  const fetchProgram = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/upi/${slug}`)
      const data = await response.json()
      setProgram(data.data)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] pt-24">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-96 bg-gray-200 animate-pulse rounded-[24px]" />
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] pt-24 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">Program not found</h3>
          <Link href="/upi-program" className="text-[#247BF7] hover:underline mt-2 inline-block">
            View all programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/upi-program" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to programs
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium">
                  {program.level}
                </span>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium capitalize">
                  {program.mode?.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{program.name}</h1>
              <p className="text-gray-400 mb-6">{program.description}</p>
              
              <div className="flex flex-wrap gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#60A5FA]" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#60A5FA]" />
                  <span>{program.credits} Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#60A5FA]" />
                  <span>{program.transferableTo?.length || 0} Transfer Partners</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              {program.tuition?.amount && (
                <div className="text-center mb-6">
                  <p className="text-[32px] font-bold text-white">
                    ${program.tuition.amount?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">per {program.tuition.per}</p>
                </div>
              )}
              <Link
                href={`/upi-program/apply?program=${program._id}`}
                className="block text-center w-full py-3 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-100 transition-colors mb-3"
              >
                Apply Now
              </Link>
              <Link
                href="/contact"
                className="block text-center w-full py-3 border border-white/20 text-white rounded-2xl font-medium hover:bg-white/5 transition-colors"
              >
                Talk to Advisor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Curriculum */}
            <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#247BF7]" />
                Curriculum
              </h2>
              <div className="space-y-3">
                {program.curriculum?.map((module: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{module.module}</p>
                      <p className="text-[12px] text-gray-500">{module.credits} Credits • {module.duration}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">Module {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {program.requirements?.length > 0 && (
              <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Requirements</h2>
                <ul className="space-y-3">
                  {program.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {program.institution && (
              <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Partner Institution</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#247BF7]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{program.institution.name}</p>
                    <p className="text-[12px] text-gray-500">{program.institution.country}</p>
                  </div>
                </div>
              </div>
            )}

            {program.transferableTo?.length > 0 && (
              <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Transfer Partners</h3>
                <div className="space-y-2">
                  {program.transferableTo.map((transfer: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                      <span className="text-[13px] text-gray-700">{transfer.institution?.name}</span>
                      <span className="text-[11px] text-gray-500">{transfer.creditsAccepted} credits</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-[20px] border border-gray-100/80 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Program Highlights</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, label: 'Fully Accredited' },
                  { icon: Globe, label: 'International Recognition' },
                  { icon: Clock, label: 'Flexible Schedule' },
                  { icon: Users, label: 'Expert Instructors' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[#247BF7]" />
                    <span className="text-[13px] text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#247BF7] to-[#6366F1] rounded-[24px] p-8 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Enroll now and earn transferable credits toward your degree.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/upi-program/apply?program=${program._id}`}
              className="px-8 py-3.5 bg-white text-[#247BF7] rounded-2xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 border border-white/30 text-white rounded-2xl font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              Talk to Advisor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}