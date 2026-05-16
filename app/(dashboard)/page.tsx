// client/app/%28dashboard%29/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const redirectMap: Record<string, string> = {
        student: '/dashboard',
        admin: '/admin',
        super_admin: '/admin',
        investor: '/investor',
        university_admin: '/university',
      }
      router.replace(redirectMap[user.role] || '/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}