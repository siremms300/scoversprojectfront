'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Award, DollarSign, Calendar, Globe,
  Save, Plus, Trash2, GraduationCap
} from 'lucide-react'
import { COUNTRIES } from '@/lib/constants'
import toast from 'react-hot-toast'

const scholarshipTypes = [
  { value: 'full', label: 'Full Scholarship' },
  { value: 'partial', label: 'Partial Scholarship' },
  { value: 'tuition', label: 'Tuition Only' },
  { value: 'research', label: 'Research Grant' },
  { value: 'need_based', label: 'Need Based' },
  { value: 'merit_based', label: 'Merit Based' },
]

export default function NewScholarshipPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: '',
    provider: { name: '', type: 'institution' },
    description: '',
    amount: { value: '', currency: 'USD', covers: ['tuition'] },
    eligibility: {
      nationality: [] as string[],
      minimumGpa: '',
      level: [] as string[],
      otherRequirements: [] as string[],
    },
    benefits: [] as string[],
    requiredDocuments: [] as string[],
    applicationProcess: [] as string[],
    deadline: '',
    startDate: '',
    duration: '',
    slots: '',
    contactEmail: '',
    website: '',
    status: 'active',
    featured: false,
  })

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
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

  const handleArrayChange = (field: string, index: number, value: string) => {
    setForm(prev => {
      const arr = [...(prev[field as keyof typeof prev] as string[])]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.title || !form.type || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const data = {
        ...form,
        amount: { ...form.amount, value: form.amount.value ? parseInt(form.amount.value) : undefined },
        slots: form.slots ? parseInt(form.slots) : undefined,
        eligibility: {
          ...form.eligibility,
          minimumGpa: form.eligibility.minimumGpa ? parseFloat(form.eligibility.minimumGpa) : undefined,
          nationality: form.eligibility.nationality.filter(Boolean),
          level: form.eligibility.level.filter(Boolean),
          otherRequirements: form.eligibility.otherRequirements.filter(Boolean),
        },
        benefits: form.benefits.filter(Boolean),
        requiredDocuments: form.requiredDocuments.filter(Boolean),
        applicationProcess: form.applicationProcess.filter(Boolean),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/scholarships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create scholarship')

      toast.success('Scholarship created successfully!')
      router.push('/admin/scholarships')
    } catch (error) {
      toast.error('Failed to create scholarship')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/scholarships" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Add New Scholarship</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Create a new scholarship opportunity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#247BF7]" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Scholarship Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="Mastercard Foundation Scholarship"
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
                {scholarshipTypes.map(t => (
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
                <option value="upcoming">Upcoming</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all resize-none"
                placeholder="Describe the scholarship opportunity"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Provider Name</label>
              <input
                type="text"
                value={form.provider.name}
                onChange={(e) => setForm(prev => ({ ...prev, provider: { ...prev.provider, name: e.target.value } }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="Mastercard Foundation"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Provider Type</label>
              <select
                value={form.provider.type}
                onChange={(e) => setForm(prev => ({ ...prev, provider: { ...prev.provider, type: e.target.value } }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
              >
                <option value="institution">Institution</option>
                <option value="government">Government</option>
                <option value="organization">Organization</option>
                <option value="corporate">Corporate</option>
                <option value="individual">Individual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amount & Dates */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5">Amount & Dates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={form.amount.value}
                  onChange={(e) => setForm(prev => ({ ...prev, amount: { ...prev.amount, value: e.target.value } }))}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="50000"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="4 years"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Available Slots</label>
              <input
                type="number"
                value={form.slots}
                onChange={(e) => handleChange('slots', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="100"
              />
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5">Eligibility Criteria</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Minimum GPA</label>
              <input
                type="number"
                step="0.1"
                value={form.eligibility.minimumGpa}
                onChange={(e) => setForm(prev => ({ ...prev, eligibility: { ...prev.eligibility, minimumGpa: e.target.value } }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="3.0"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Eligible Nationalities</label>
              <select
                multiple
                value={form.eligibility.nationality}
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  eligibility: {
                    ...prev.eligibility,
                    nationality: Array.from(e.target.selectedOptions, option => option.value)
                  }
                }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all h-32"
              >
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>
        </div>

        {/* Lists */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5">Benefits & Requirements</h2>
          
          <div className="mb-5">
            <label className="block text-[13px] font-medium text-gray-700 mb-3">Benefits</label>
            {form.benefits.map((benefit, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange('benefits', i, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="Full tuition coverage"
                />
                {form.benefits.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('benefits', i)} className="p-2.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('benefits')} className="flex items-center gap-2 text-[13px] text-[#247BF7] hover:underline mt-2">
              <Plus className="w-4 h-4" /> Add Benefit
            </button>
          </div>

          <div className="mb-5">
            <label className="block text-[13px] font-medium text-gray-700 mb-3">Required Documents</label>
            {form.requiredDocuments.map((doc, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => handleArrayChange('requiredDocuments', i, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="Academic transcript"
                />
                {form.requiredDocuments.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('requiredDocuments', i)} className="p-2.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('requiredDocuments')} className="flex items-center gap-2 text-[13px] text-[#247BF7] hover:underline mt-2">
              <Plus className="w-4 h-4" /> Add Document
            </button>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-3">Application Process Steps</label>
            {form.applicationProcess.map((step, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleArrayChange('applicationProcess', i, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="Step 1: Submit online application"
                />
                {form.applicationProcess.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('applicationProcess', i)} className="p-2.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('applicationProcess')} className="flex items-center gap-2 text-[13px] text-[#247BF7] hover:underline mt-2">
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5">Contact & Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="scholarships@example.com"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="https://example.com/scholarship"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/scholarships" className="px-6 py-3 border border-gray-200 rounded-2xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Scholarship'}
          </button>
        </div>
      </form>
    </div>
  )
}