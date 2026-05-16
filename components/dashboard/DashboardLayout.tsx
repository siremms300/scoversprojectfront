'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

type SidebarRole = 'admin' | 'investor' | 'university' | 'user'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const mapRole = (role?: string): SidebarRole => {
    switch (role) {
      case 'super_admin': return 'admin'
      case 'university_admin': return 'university'
      case 'student': return 'user'
      case 'admin': return 'admin'
      case 'investor': return 'investor'
      case 'university': return 'university'
      default: return 'user'
    }
  }

  const sidebarRole = mapRole(user?.role)

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8F9FB]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar 
        role={sidebarRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">
        <DashboardHeader 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}