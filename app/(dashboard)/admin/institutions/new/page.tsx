'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Building2, Globe, MapPin, Star,
  Mail, Phone, Upload, Plus, Trash2, Save
} from 'lucide-react'
import { COUNTRIES } from '@/lib/constants'
import toast from 'react-hot-toast'

const institutionTypes = [
  { value: 'university', label: 'University' },
  { value: 'college', label: 'College' },
  { value: 'polytechnic', label: 'Polytechnic' },
  { value: 'vocational', label: 'Vocational' },
  { value: 'language_school', label: 'Language School' },
  { value: 'other', label: 'Other' },
]

export default function NewInstitutionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: '',
    country: '',
    state: '',
    city: '',
    address: '',
    description: '',
    shortDescription: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    ranking: { global: '', national: '' },
    tuitionRange: { min: '', max: '', currency: 'USD' },
    studentCount: '',
    foundedYear: '',
    accreditation: [''],
    facilities: [''],
    socialMedia: { facebook: '', twitter: '', instagram: '', linkedin: '' },
    status: 'active',
    featured: false,
  })

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

    const handleNestedChange = (parent: string, field: string, value: any) => {
    setForm((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [field]: value }
    }))
    }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setForm(prev => {
      const arr = [...(prev[field as keyof typeof prev] as string[])]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addArrayItem = (field: string) => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setForm(prev => {
      const arr = [...(prev[field as keyof typeof prev] as string[])]
      arr.splice(index, 1)
      return { ...prev, [field]: arr }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.type || !form.country || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Clean up empty array items
      const data = {
        ...form,
        accreditation: form.accreditation.filter(a => a.trim()),
        facilities: form.facilities.filter(f => f.trim()),
        ranking: {
          global: form.ranking.global ? parseInt(form.ranking.global as string) : undefined,
          national: form.ranking.national ? parseInt(form.ranking.national as string) : undefined,
        },
        tuitionRange: {
          min: form.tuitionRange.min ? parseInt(form.tuitionRange.min as string) : undefined,
          max: form.tuitionRange.max ? parseInt(form.tuitionRange.max as string) : undefined,
          currency: form.tuitionRange.currency,
        },
        studentCount: form.studentCount ? parseInt(form.studentCount as string) : undefined,
        foundedYear: form.foundedYear ? parseInt(form.foundedYear as string) : undefined,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/institutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create institution')

      toast.success('Institution created successfully!')
      router.push('/admin/institutions')
    } catch (error) {
      toast.error('Failed to create institution')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/institutions" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Add New Institution</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Create a new partner institution</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#247BF7]" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Institution Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="University of Lagos"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                required
              >
                <option value="">Select type</option>
                {institutionTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Short Description</label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="A brief description of the institution"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all resize-none"
                placeholder="Detailed description of the institution"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#247BF7]" />
            Location
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Country *</label>
              <select
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                required
              >
                <option value="">Select country</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">State/Region</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="Lagos"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="Ikeja"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Full Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="123 University Road"
              />
            </div>
          </div>
        </div>

        {/* Rankings & Stats */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#247BF7]" />
            Rankings & Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Global Ranking</label>
              <input
                type="number"
                value={form.ranking.global}
                onChange={(e) => handleNestedChange('ranking', 'global', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="21"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">National Ranking</label>
              <input
                type="number"
                value={form.ranking.national}
                onChange={(e) => handleNestedChange('ranking', 'national', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Student Count</label>
              <input
                type="number"
                value={form.studentCount}
                onChange={(e) => handleChange('studentCount', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Founded Year</label>
              <input
                type="number"
                value={form.foundedYear}
                onChange={(e) => handleChange('foundedYear', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="1962"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Min Tuition</label>
              <input
                type="number"
                value={form.tuitionRange.min}
                onChange={(e) => handleNestedChange('tuitionRange', 'min', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Max Tuition</label>
              <input
                type="number"
                value={form.tuitionRange.max}
                onChange={(e) => handleNestedChange('tuitionRange', 'max', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="15000"
              />
            </div>
          </div>
        </div>

        {/* Contact & Web */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#247BF7]" />
            Contact & Web Presence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="https://www.university.edu"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="info@university.edu"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="text"
                value={form.socialMedia.facebook}
                onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="facebook.com/university"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="text"
                value={form.socialMedia.twitter}
                onChange={(e) => handleNestedChange('socialMedia', 'twitter', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="twitter.com/university"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="text"
                value={form.socialMedia.instagram}
                onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="instagram.com/university"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="text"
                value={form.socialMedia.linkedin}
                onChange={(e) => handleNestedChange('socialMedia', 'linkedin', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="linkedin.com/company/university"
              />
            </div>
          </div>
        </div>

        {/* Accreditation & Facilities */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5">Accreditation & Facilities</h2>
          
          <div className="mb-5">
            <label className="block text-[13px] font-medium text-gray-700 mb-3">Accreditations</label>
            {form.accreditation.map((acc, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={acc}
                  onChange={(e) => handleArrayChange('accreditation', i, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="NUC Accreditation"
                />
                {form.accreditation.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('accreditation', i)} className="p-2.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('accreditation')} className="flex items-center gap-2 text-[13px] text-[#247BF7] hover:underline mt-2">
              <Plus className="w-4 h-4" />
              Add Accreditation
            </button>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-3">Facilities</label>
            {form.facilities.map((facility, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => handleArrayChange('facilities', i, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="Library, Sports Complex, etc."
                />
                {form.facilities.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('facilities', i)} className="p-2.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('facilities')} className="flex items-center gap-2 text-[13px] text-[#247BF7] hover:underline mt-2">
              <Plus className="w-4 h-4" />
              Add Facility
            </button>
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-gray-900">Featured Institution</p>
              <p className="text-[11px] text-gray-500">Show this institution on the homepage</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#247BF7] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/institutions"
            className="px-6 py-3 border border-gray-200 rounded-2xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Institution'}
          </button>
        </div>
      </form>
    </div>
  )
}