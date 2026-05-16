'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const institutions = [
  {
    name: 'University of Toronto',
    country: 'Canada',
    logo: '/institutions/utoronto.png',
    ranking: 21,
    students: '95,000+',
  },
  {
    name: 'University of Melbourne',
    country: 'Australia',
    logo: '/institutions/unimelb.png',
    ranking: 33,
    students: '52,000+',
  },
  {
    name: 'University of Lagos',
    country: 'Nigeria',
    logo: '/institutions/unilag.png',
    ranking: 401,
    students: '45,000+',
  },
  {
    name: 'University of Cape Town',
    country: 'South Africa',
    logo: '/institutions/uct.png',
    ranking: 198,
    students: '28,000+',
  },
  {
    name: 'University of Ghana',
    country: 'Ghana',
    logo: '/institutions/ug.png',
    ranking: 601,
    students: '38,000+',
  },
  {
    name: 'Harvard University',
    country: 'USA',
    logo: '/institutions/harvard.png',
    ranking: 1,
    students: '31,000+',
  },
]

export function InstitutionShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Partner{' '}
              <span className="text-gradient">Institutions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Access 500+ accredited institutions worldwide. From top-ranked 
              universities to specialized colleges.
            </p>
          </div>
          <Link href="/institutions">
            <Button variant="outline" className="hidden md:flex items-center">
              View All Institutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((institution, index) => (
            <motion.div
              key={institution.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-[#247BF7]/5 hover:border-[#247BF7]/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#247BF7]/10 to-[#1E40AF]/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-gradient">
                    {institution.name.charAt(0)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-gray-600">
                    #{institution.ranking}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {institution.name}
              </h3>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {institution.country}
                <span className="mx-2">•</span>
                <span>{institution.students} students</span>
              </div>

              <Link
                href={`/institutions/${institution.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[#247BF7] font-medium text-sm hover:underline inline-flex items-center"
              >
                Explore Programs
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/institutions">
            <Button variant="outline">
              View All Institutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}