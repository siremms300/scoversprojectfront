// client/components/layout/RootLayoutClient.tsx
'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if current route is a dashboard page
  const isDashboard = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/admin') || 
                      pathname.startsWith('/investor') || 
                      pathname.startsWith('/university')

  // Dashboard pages have their own layout (sidebar + header)
  // So don't show public navbar/footer
  if (isDashboard) {
    return <>{children}</>
  }

  // Public pages get the normal navbar and footer
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}