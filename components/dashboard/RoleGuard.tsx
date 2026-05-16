'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(user.role)) {
      const redirectMap: Record<string, string> = {
        student: '/dashboard',
        admin: '/admin',
        super_admin: '/admin',
        investor: '/investor',
        university_admin: '/university',
      }
      router.replace(redirectMap[user.role] || '/dashboard')
    }
  }, [user, loading, allowedRoles, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}