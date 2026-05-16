'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search, Plus, Award, DollarSign, Clock, Globe,
  Edit, Trash2, Eye, GraduationCap
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchScholarships()
  }, [])

  const fetchScholarships = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships`)
      const data = await response.json()
      setScholarships(data.data || [])
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this scholarship?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/scholarships/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Scholarship deleted')
      fetchScholarships()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Scholarships</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage scholarship opportunities</p>
        </div>
        <Link
          href="/admin/scholarships/new"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Scholarship
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 animate-pulse rounded-[20px]" />
          ))
        ) : scholarships.map((scholarship) => (
          <motion.div
            key={scholarship._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[20px] border border-gray-100/80 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/admin/scholarships/${scholarship._id}/edit`} className="p-2 text-gray-400 hover:text-[#247BF7] transition-colors">
                  <Edit className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(scholarship._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{scholarship.title}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <DollarSign className="w-3.5 h-3.5" />
                {scholarship.type?.replace(/_/g, ' ')}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                Deadline: {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <GraduationCap className="w-3.5 h-3.5" />
                {scholarship.applicants?.length || 0} applicants
              </div>
            </div>

            <Link
              href={`/admin/scholarships/${scholarship._id}`}
              className="flex items-center justify-center gap-1 w-full py-2.5 bg-gray-50 rounded-xl text-[12px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              View Details
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}