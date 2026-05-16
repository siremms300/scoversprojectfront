'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

type SidebarRole = 'admin' | 'investor' | 'university' | 'user'

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [loading, isAuthenticated, router])

  // Check route access
  useEffect(() => {
    if (!user || loading) return

    const roleAccessMap: Record<string, string[]> = {
      student: ['/dashboard'],
      admin: ['/admin', '/dashboard'],
      super_admin: ['/admin', '/dashboard'],
      investor: ['/investor'],
      university_admin: ['/university'],
    }

    const allowedPaths = roleAccessMap[user.role] || ['/dashboard']
    const hasAccess = allowedPaths.some(path => pathname.startsWith(path))

    if (!hasAccess) {
      const redirectMap: Record<string, string> = {
        student: '/dashboard',
        admin: '/admin',
        super_admin: '/admin',
        investor: '/investor',
        university_admin: '/university',
      }
      router.replace(redirectMap[user.role] || '/dashboard')
    }
  }, [user, loading, pathname, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const mapRole = (role?: string): SidebarRole => {
    switch (role) {
      case 'super_admin': return 'admin'
      case 'university_admin': return 'university'
      case 'student': return 'user'
      default: return (role as SidebarRole) || 'user'
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#F5F6FA]">
      <DashboardSidebar 
        role={mapRole(user?.role)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[264px]">
        <DashboardHeader 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-5 md:p-7 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}







































// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/hooks/useAuth'
// import { DashboardSidebar } from './DashboardSidebar'
// import { DashboardHeader } from './DashboardHeader'

// type SidebarRole = 'admin' | 'investor' | 'university' | 'user'

// export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
//   const { user, loading, isAuthenticated } = useAuth()
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.replace('/login')
//     }
//   }, [loading, isAuthenticated, router])

//   if (loading || !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
//         <div className="text-center">
//           <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//           <p className="text-sm text-gray-500">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   const mapRole = (role?: string): SidebarRole => {
//     switch (role) {
//       case 'super_admin': return 'admin'
//       case 'university_admin': return 'university'
//       case 'student': return 'user'
//       default: return (role as SidebarRole) || 'user'
//     }
//   }

//   return (
//     <div className="h-screen flex overflow-hidden bg-[#F5F6FA]">
//       <DashboardSidebar 
//         role={mapRole(user?.role)}
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <div className="flex-1 flex flex-col min-w-0 lg:ml-[264px]">
//         <DashboardHeader 
//           user={user}
//           onMenuClick={() => setSidebarOpen(true)}
//         />
//         <main className="flex-1 overflow-y-auto scrollbar-thin">
//           <div className="p-5 md:p-7 lg:p-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }




















































// 'use client'

// import { useState } from 'react'
// import { useAuth } from '@/hooks/useAuth'
// import { DashboardSidebar } from './DashboardSidebar'
// import { DashboardHeader } from './DashboardHeader'

// type SidebarRole = 'admin' | 'investor' | 'university' | 'user'

// export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth()
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const mapRole = (role?: string): SidebarRole => {
//     switch (role) {
//       case 'super_admin': return 'admin'
//       case 'university_admin': return 'university'
//       case 'student': return 'user'
//       default: return (role as SidebarRole) || 'user'
//     }
//   }

//   return (
//     <div className="h-screen flex overflow-hidden bg-[#F5F6FA]">
//       {/* Sidebar */}
//       <DashboardSidebar 
//         role={mapRole(user?.role)}
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* Main */}
//       <div className="flex-1 flex flex-col min-w-0 lg:ml-[264px]">
//         <DashboardHeader 
//           user={user}
//           onMenuClick={() => setSidebarOpen(true)}
//         />
//         <main className="flex-1 overflow-y-auto scrollbar-thin">
//           <div className="p-5 md:p-7 lg:p-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }


















































































// 'use client'

// import { useState } from 'react'
// import { useAuth } from '@/hooks/useAuth'
// import { DashboardSidebar } from './DashboardSidebar'
// import { DashboardHeader } from './DashboardHeader'

// type SidebarRole = 'admin' | 'investor' | 'university' | 'user'

// export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth()
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const mapRole = (role?: string): SidebarRole => {
//     switch (role) {
//       case 'super_admin': return 'admin'
//       case 'university_admin': return 'university'
//       case 'student': return 'user'
//       case 'admin': return 'admin'
//       case 'investor': return 'investor'
//       case 'university': return 'university'
//       default: return 'user'
//     }
//   }

//   const sidebarRole = mapRole(user?.role)

//   return (
//     <div className="h-screen flex overflow-hidden bg-[#F8F9FB]">
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <DashboardSidebar 
//         role={sidebarRole}
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* Main area */}
//       <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">
//         <DashboardHeader 
//           user={user}
//           onMenuClick={() => setSidebarOpen(true)}
//         />
//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }