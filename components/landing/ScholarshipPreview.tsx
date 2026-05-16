'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Award, Clock, DollarSign, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const scholarships = [
  {
    title: 'Mastercard Foundation Scholarship',
    provider: 'Mastercard Foundation',
    type: 'Full Scholarship',
    deadline: '2024-12-31',
    value: '$50,000/year',
    countries: 'Multiple African Countries',
  },
  {
    title: 'Commonwealth Scholarship',
    provider: 'Commonwealth Commission',
    type: 'Full Scholarship',
    deadline: '2024-11-15',
    value: '£30,000/year',
    countries: 'Commonwealth Countries',
  },
  {
    title: 'PTDF Scholarship',
    provider: 'PTDF Nigeria',
    type: 'Full Scholarship',
    deadline: '2024-10-30',
    value: '₦5,000,000/year',
    countries: 'Nigeria',
  },
]

export function ScholarshipPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Scholarship{' '}
              <span className="text-gradient">Opportunities</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Find and apply for scholarships that match your profile. From full 
              rides to partial funding for international students.
            </p>
          </div>
          <Link href="/scholarships">
            <Button variant="outline" className="hidden md:flex items-center">
              View All Scholarships
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-[#247BF7]/5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#247BF7]/10 to-[#1E40AF]/10 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-[#247BF7]" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {scholarship.title}
              </h3>
              
              <p className="text-[#247BF7] font-medium mb-4">
                {scholarship.provider}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span className="text-sm">{scholarship.type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">{scholarship.value}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <Link
                href={`/scholarships/${scholarship.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center text-[#247BF7] font-medium hover:underline"
              >
                Learn More
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/scholarships">
            <Button variant="outline">
              View All Scholarships
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}