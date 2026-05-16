'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, CreditCard, BookOpen,
  Award, Settings, TrendingUp, PieChart, Activity,
  Users, Building2, Newspaper, BarChart3,
  GraduationCap, Sparkles, Zap, X, ChevronRight,
  MessageSquare, Plus, Star, Compass
} from 'lucide-react'

type SidebarRole = 'admin' | 'investor' | 'university' | 'user'

interface SidebarProps {
  role: SidebarRole
  isOpen: boolean
  onClose: () => void
}

const menus: Record<SidebarRole, any[]> = {
  admin: [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Applications', href: '/admin/applications', icon: FileText, badge: '12' },
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
    { name: 'Applications', href: '/university/applications', icon: FileText, badge: '5' },
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

const roleLabels: Record<SidebarRole, string> = {
  admin: 'Administrator',
  investor: 'Investor',
  university: 'University',
  user: 'Student',
}

export function DashboardSidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const items = menus[role] || menus.user

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:fixed inset-y-0 left-0 z-50 w-[264px]',
        'bg-white border-r border-gray-100/80',
        'flex flex-col',
        'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="h-[68px] flex items-center gap-3 px-5 border-b border-gray-50 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 flex-1 min-w-0" onClick={onClose}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-[14px] flex items-center justify-center shadow-md shadow-[#247BF7]/15 flex-shrink-0">
              <GraduationCap className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-gray-900 tracking-tight leading-none">Scovers</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{roleLabels[role]}</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Quick Action */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <Link
            href="/upi-program/apply"
            onClick={onClose}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-gradient-to-r from-[#247BF7] to-[#6366F1] rounded-2xl text-white text-[13px] font-medium hover:shadow-lg hover:shadow-[#247BF7]/25 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative',
                  isActive
                    ? 'bg-[#F0F4FF] text-[#247BF7]'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                <item.icon className={cn(
                  'w-[18px] h-[18px] flex-shrink-0 transition-colors',
                  isActive ? 'text-[#247BF7]' : 'text-gray-400 group-hover:text-gray-500'
                )} />
                <span className="flex-1">{item.name}</span>
                
                {item.badge && (
                  <span className={cn(
                    'px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-none',
                    isActive 
                      ? 'bg-[#247BF7]/10 text-[#247BF7]' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  )}>
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#247BF7] rounded-r-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Card */}
        <div className="p-3 flex-shrink-0">
          <div className="bg-gradient-to-br from-[#F8FAFF] to-[#F0F4FF] rounded-2xl p-4 border border-[#247BF7]/5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-[#247BF7]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">UPI Credits</p>
                <p className="text-[11px] text-gray-500">Earn & transfer</p>
              </div>
            </div>
            <Link
              href="/upi-program"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-white text-[#247BF7] rounded-xl text-[12px] font-medium hover:bg-white/80 transition-colors border border-[#247BF7]/10"
            >
              <Compass className="w-3.5 h-3.5" />
              Explore Programs
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}