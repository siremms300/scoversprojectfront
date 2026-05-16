'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, MapPin, Star, Filter, SlidersHorizontal, GraduationCap, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { COUNTRIES } from '@/lib/constants'

const institutionTypes = [
  { value: '', label: 'All Types' },
  { value: 'university', label: 'University' },
  { value: 'college', label: 'College' },
  { value: 'polytechnic', label: 'Polytechnic' },
  { value: 'vocational', label: 'Vocational' },
]

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [type, setType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchInstitutions()
  }, [country, type])

  const fetchInstitutions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (country) params.append('country', country)
      if (type) params.append('type', type)
      if (search) params.append('search', search)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions?${params}`)
      const data = await response.json()
      setInstitutions(data.data || [])
    } catch (error) {
      console.error('Failed to fetch institutions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#247BF7] to-[#1E40AF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Find Your Perfect Institution
          </motion.h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Browse 500+ accredited institutions worldwide
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search institutions..."
                icon={<Search className="w-4 h-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchInstitutions()}
              />
            </div>
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button onClick={fetchInstitutions}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t"
            >
              <Select
                label="Country"
                options={[
                  { value: '', label: 'All Countries' },
                  ...COUNTRIES.map(c => ({ value: c, label: c }))
                ]}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <Select
                label="Institution Type"
                options={institutionTypes}
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">{institutions.length} institutions found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institutions.map((institution: any, index: number) => (
                <motion.div
                  key={institution._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/institutions/${institution.slug}`}>
                    <Card hover className="h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#247BF7]/10 to-[#1E40AF]/10 rounded-xl flex items-center justify-center">
                          {institution.logo ? (
                            <img src={institution.logo} alt={institution.name} className="w-10 h-10" />
                          ) : (
                            <Building2 className="w-8 h-8 text-[#247BF7]" />
                          )}
                        </div>
                        {institution.ranking?.global && (
                          <Badge variant="info">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            #{institution.ranking.global}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {institution.name}
                      </h3>

                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {institution.city}, {institution.country}
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {institution.shortDescription || institution.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge>{institution.type}</Badge>
                        {institution.studentCount && (
                          <span className="text-sm text-gray-500">
                            {institution.studentCount.toLocaleString()}+ students
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}