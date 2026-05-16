'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, CreditCard, Save, Plus, Trash2,
  BookOpen, GraduationCap, Globe, Clock, Star,
  Building2, DollarSign, Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

const levels = [
  { value: 'certificate', label: 'Certificate' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'professional', label: 'Professional' },
]

const modes = [
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'in_person', label: 'In Person' },
]

const fields = [
  'Business Administration', 'Computer Science', 'Engineering',
  'Medicine', 'Law', 'Arts', 'Education', 'Agriculture',
  'Social Sciences', 'Environmental Science', 'Data Science',
  'Artificial Intelligence', 'Cybersecurity', 'Finance',
  'Marketing', 'International Relations', 'Public Health',
  'Architecture', 'Design', 'Music'
]

export default function EditUPIProgramPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    duration: '',
    credits: '',
    level: '',
    field: '',
    mode: 'online',
    tuition: { amount: '', currency: 'USD', per: 'total' },
    requirements: [''],
    prerequisites: [''],
    startDates: [''],
    maxStudents: '',
    status: 'active',
    featured: false,
    curriculum: [{
      module: '',
      code: '',
      description: '',
      credits: '',
      duration: '',
      order: 1
    }],
    transferableTo: [{
      institution: '',
      creditsAccepted: '',
      conditions: ''
    }]
  })

  useEffect(() => {
    fetchProgram()
  }, [id])

  const fetchProgram = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/upi/${id}`)
      const data = await response.json()
      
      if (data.data) {
        const program = data.data
        setForm({
          name: program.name || '',
          description: program.description || '',
          shortDescription: program.shortDescription || '',
          duration: program.duration || '',
          credits: program.credits?.toString() || '',
          level: program.level || '',
          field: program.field || '',
          mode: program.mode || 'online',
          tuition: {
            amount: program.tuition?.amount?.toString() || '',
            currency: program.tuition?.currency || 'USD',
            per: program.tuition?.per || 'total'
          },
          requirements: program.requirements?.length ? program.requirements : [''],
          prerequisites: program.prerequisites?.length ? program.prerequisites : [''],
          startDates: program.startDates?.length ? program.startDates.map((d: string) => d.split('T')[0]) : [''],
          maxStudents: program.maxStudents?.toString() || '',
          status: program.status || 'active',
          featured: program.featured || false,
          curriculum: program.curriculum?.length ? program.curriculum.map((c: any) => ({
            module: c.module || '',
            code: c.code || '',
            description: c.description || '',
            credits: c.credits?.toString() || '',
            duration: c.duration || '',
            order: c.order || 1
          })) : [{ module: '', code: '', description: '', credits: '', duration: '', order: 1 }],
          transferableTo: program.transferableTo?.length ? program.transferableTo.map((t: any) => ({
            institution: t.institution?._id || t.institution || '',
            creditsAccepted: t.creditsAccepted?.toString() || '',
            conditions: t.conditions || ''
          })) : []
        })
      }
    } catch (error) {
      console.error('Failed to fetch program:', error)
      toast.error('Failed to load program')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }))
  }

  const handleArrayChange = (field: string, index: number, value: any) => {
    setForm(prev => {
      const arr = [...(prev[field as keyof typeof prev] as any[])]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addArrayItem = (field: string, defaultValue: any = '') => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), defaultValue]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setForm(prev => {
      const arr = [...(prev[field as keyof typeof prev] as any[])]
      arr.splice(index, 1)
      return { ...prev, [field]: arr }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.description || !form.duration || !form.credits || !form.level || !form.field) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      
      const data = {
        ...form,
        credits: parseInt(form.credits as string),
        maxStudents: form.maxStudents ? parseInt(form.maxStudents as string) : undefined,
        tuition: {
          ...form.tuition,
          amount: form.tuition.amount ? parseFloat(form.tuition.amount as string) : undefined
        },
        requirements: form.requirements.filter((r: string) => r.trim()),
        prerequisites: form.prerequisites.filter((p: string) => p.trim()),
        startDates: form.startDates.filter((d: string) => d),
        curriculum: form.curriculum.filter((c: any) => c.module.trim()),
        transferableTo: form.transferableTo.filter((t: any) => t.institution && t.institution.trim())
      }

      const response = await fetch(`${apiUrl}/upi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update program')
      }

      toast.success('Program updated successfully!')
      router.push(`/admin/upi/${id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update program')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-96 bg-gray-200 animate-pulse rounded-[20px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/upi/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Edit UPI Program</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Update program details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#247BF7]" />
            Program Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Program Name *</label>
              <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="UPI Business Administration" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="A brief overview of the program" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Description *</label>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all resize-none"
                placeholder="Detailed program description" required />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Level *</label>
              <select value={form.level} onChange={(e) => handleChange('level', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" required>
                <option value="">Select level</option>
                {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Field *</label>
              <select value={form.field} onChange={(e) => handleChange('field', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" required>
                <option value="">Select field</option>
                {fields.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Duration *</label>
              <input type="text" value={form.duration} onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="12 Months" required />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Credits *</label>
              <input type="number" value={form.credits} onChange={(e) => handleChange('credits', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="60" required />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Mode</label>
              <select value={form.mode} onChange={(e) => handleChange('mode', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all">
                {modes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Status</label>
              <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all">
                <option value="active">Active</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Max Students</label>
              <input type="number" value={form.maxStudents} onChange={(e) => handleChange('maxStudents', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                placeholder="100 (leave empty for unlimited)" />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Tuition Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="number" value={form.tuition.amount} onChange={(e) => handleNestedChange('tuition', 'amount', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
                  placeholder="5000" />
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#247BF7]" />
              Curriculum
            </h2>
            <button type="button" onClick={() => addArrayItem('curriculum', { module: '', code: '', description: '', credits: '', duration: '', order: form.curriculum.length + 1 })}
              className="flex items-center gap-2 text-[13px] text-[#247BF7] hover:underline">
              <Plus className="w-4 h-4" /> Add Module
            </button>
          </div>
          
          {form.curriculum.map((module: any, i: number) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl mb-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] text-gray-500 mb-1">Module Name</label>
                  <input type="text" value={module.module} onChange={(e) => {
                    const arr = [...form.curriculum]
                    arr[i] = { ...arr[i], module: e.target.value }
                    setForm(prev => ({ ...prev, curriculum: arr }))
                  }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-[#247BF7]" placeholder="Introduction to Business" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Credits</label>
                  <input type="number" value={module.credits} onChange={(e) => {
                    const arr = [...form.curriculum]
                    arr[i] = { ...arr[i], credits: e.target.value }
                    setForm(prev => ({ ...prev, curriculum: arr }))
                  }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-[#247BF7]" placeholder="3" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Duration</label>
                  <input type="text" value={module.duration} onChange={(e) => {
                    const arr = [...form.curriculum]
                    arr[i] = { ...arr[i], duration: e.target.value }
                    setForm(prev => ({ ...prev, curriculum: arr }))
                  }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-[#247BF7]" placeholder="4 weeks" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[11px] text-gray-500 mb-1">Description</label>
                  <input type="text" value={module.description} onChange={(e) => {
                    const arr = [...form.curriculum]
                    arr[i] = { ...arr[i], description: e.target.value }
                    setForm(prev => ({ ...prev, curriculum: arr }))
                  }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-[#247BF7]" placeholder="Module description" />
                </div>
              </div>
              {form.curriculum.length > 1 && (
                <button type="button" onClick={() => {
                  const arr = [...form.curriculum]
                  arr.splice(i, 1)
                  setForm(prev => ({ ...prev, curriculum: arr }))
                }} className="mt-3 text-[11px] text-red-500 hover:underline">Remove Module</button>
              )}
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-5">Requirements & Dates</h2>
          
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[13px] font-medium text-gray-700">Entry Requirements</label>
              <button type="button" onClick={() => addArrayItem('requirements')} className="flex items-center gap-1 text-[12px] text-[#247BF7] hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {form.requirements.map((req, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={req} onChange={(e) => handleArrayChange('requirements', i, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7]"
                  placeholder="High school diploma or equivalent" />
                {form.requirements.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('requirements', i)} className="p-2.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[13px] font-medium text-gray-700">Start Dates</label>
              <button type="button" onClick={() => addArrayItem('startDates', '')} className="flex items-center gap-1 text-[12px] text-[#247BF7] hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {form.startDates.map((date, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="date" value={date} onChange={(e) => handleArrayChange('startDates', i, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7]" />
                {form.startDates.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem('startDates', i)} className="p-2.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href={`/admin/upi/${id}`} className="px-6 py-3 border border-gray-200 rounded-2xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}