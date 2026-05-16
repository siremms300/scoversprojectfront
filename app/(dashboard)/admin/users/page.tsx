'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Users, Mail, Shield, Ban, CheckCircle2,
  ChevronLeft, ChevronRight, MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

const roleFilters = [
  { value: '', label: 'All Roles' },
  { value: 'student', label: 'Students' },
  { value: 'admin', label: 'Admins' },
  { value: 'super_admin', label: 'Super Admins' },
  { value: 'investor', label: 'Investors' },
  { value: 'university_admin', label: 'University Admins' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, page])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (roleFilter) params.append('role', roleFilter)
      if (search) params.append('search', search)
      params.append('page', page.toString())
      params.append('limit', '15')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setUsers(data.data || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (id: string, updates: any) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      toast.success('User updated')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const roleColors: Record<string, string> = {
    student: 'bg-blue-50 text-blue-700',
    admin: 'bg-purple-50 text-purple-700',
    super_admin: 'bg-violet-50 text-violet-700',
    investor: 'bg-amber-50 text-amber-700',
    university_admin: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Users</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Manage platform users</p>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-100/80 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {roleFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setRoleFilter(f.value); setPage(1) }}
              className={`px-4 py-2.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all ${
                roleFilter === f.value ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">User</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Role</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Verified</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Joined</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-10 bg-gray-100 animate-pulse rounded-lg" /></td></tr>
                ))
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-[10px] flex items-center justify-center">
                        <span className="text-white text-[11px] font-semibold">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                      {user.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleUpdateUser(user._id, { isActive: !user.isActive })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    {user.isVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <button
                        onClick={() => handleUpdateUser(user._id, { isVerified: true })}
                        className="text-[11px] text-[#247BF7] hover:underline"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUser(user._id, { role: e.target.value })}
                      className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#247BF7]"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="investor">Investor</option>
                      <option value="university_admin">University Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
            <p className="text-[12px] text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] font-medium ${page === i + 1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}