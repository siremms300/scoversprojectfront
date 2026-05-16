'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, FileText, Building2,
  BookOpen, Award, Newspaper, Settings, LogOut,
  TrendingUp, CreditCard, MessageSquare, Bell,
  ChevronLeft, ChevronRight, Menu, GraduationCap,
  BarChart3, PieChart, Activity, DollarSign,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin' | 'university' | 'user'
}

const menuItems: Record<string, Array<{ name: string; href: string; icon: any }>> = {
  admin: [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'UPI Program', href: '/admin/upi', icon: CreditCard },
    { name: 'Institutions', href: '/admin/institutions', icon: Building2 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Scholarships', href: '/admin/scholarships', icon: Award },
    { name: 'Blog', href: '/admin/blog', icon: Newspaper },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  investor: [
    { name: 'Overview', href: '/investor', icon: LayoutDashboard },
    { name: 'UPI Tracking', href: '/investor/upi', icon: TrendingUp },
    { name: 'Applications', href: '/investor/applications', icon: FileText },
    { name: 'Analytics', href: '/investor/analytics', icon: PieChart },
    { name: 'Reports', href: '/investor/reports', icon: Activity },
    { name: 'Settings', href: '/investor/settings', icon: Settings },
  ],
  university: [
    { name: 'Overview', href: '/university', icon: LayoutDashboard },
    { name: 'Applications', href: '/university/applications', icon: FileText },
    { name: 'Programs', href: '/university/programs', icon: BookOpen },
    { name: 'Students', href: '/university/students', icon: Users },
    { name: 'Analytics', href: '/university/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/university/settings', icon: Settings },
  ],
  user: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', href: '/dashboard/applications', icon: FileText },
    { name: 'UPI Progress', href: '/dashboard/upi', icon: CreditCard },
    { name: 'Scholarships', href: '/dashboard/scholarships', icon: Award },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
}

export function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const normalizedRole =
    role === 'super_admin' ? 'admin' : role === 'university_admin' ? 'university' : role === 'student' ? 'user' : role
  const items = menuItems[normalizedRole] || menuItems.user

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:w-72',
          collapsed && 'lg:w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="text-lg font-bold text-gradient">Scovers</span>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-sm',
                  isActive
                    ? 'bg-[#247BF7] text-white shadow-md shadow-[#247BF7]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#247BF7]'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || mobileOpen) && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-gray-100">
          {(!collapsed || mobileOpen) ? (
            <div className="flex items-center gap-3 px-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 capitalize">{role}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for fixed sidebar on desktop */}
      <div className="hidden lg:block lg:w-72 flex-shrink-0" />
    </>
  )
}