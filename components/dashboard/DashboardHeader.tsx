'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Menu, Search, Bell, MessageSquare, ChevronDown,
  User, Settings, HelpCircle, LogOut, Command
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  user: any
  onMenuClick: () => void
}

export function DashboardHeader({ user, onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const { logout } = useAuth()

  const handleLogout = () => {
    setShowUserMenu(false)
    logout()
  }

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
      case 'super_admin':
        return '/admin'
      case 'investor':
        return '/investor'
      case 'university_admin':
        return '/university'
      default:
        return '/dashboard'
    }
  }

  return (
    <header className="h-[68px] bg-white/80 backdrop-blur-xl border-b border-gray-100/80 flex items-center justify-between px-4 md:px-6 lg:px-7 sticky top-0 z-30 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-500" />
        </button>

        {/* Search */}
        <div className={cn(
          'hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-2xl transition-all duration-300 border',
          searchFocused 
            ? 'bg-white border-gray-200 shadow-sm ring-2 ring-[#247BF7]/5' 
            : 'bg-gray-50/80 border-transparent'
        )}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-none outline-none text-[13px] text-gray-700 placeholder:text-gray-400 w-32 md:w-48 lg:w-56"
          />
          <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] text-gray-400 font-mono leading-none">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Bell className="w-[18px] h-[18px] text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-[340px] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-semibold text-[14px] text-gray-900">Notifications</h3>
                  <span className="px-2 py-0.5 bg-[#247BF7]/10 text-[#247BF7] text-[11px] font-semibold rounded-full">3 new</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {[
                    { title: 'Application update', desc: 'Your application is now under review', time: '2 min ago', unread: true },
                    { title: 'Document verified', desc: 'Your academic transcript has been verified', time: '1 hour ago', unread: true },
                    { title: 'Scholarship match', desc: 'New scholarship matches your profile', time: '3 hours ago', unread: false },
                    { title: 'UPI Progress', desc: 'You completed Module 3. Great job!', time: '5 hours ago', unread: false },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer transition-colors ${
                        n.unread ? 'bg-[#F8FAFF]' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.unread ? 'bg-[#247BF7]' : 'bg-gray-200'
                        }`} />
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{n.title}</p>
                          <p className="text-[12px] text-gray-500 mt-0.5">{n.desc}</p>
                          <p className="text-[11px] text-gray-400 mt-1.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/dashboard/notifications"
                  className="block text-center p-3 text-[13px] text-[#247BF7] font-medium hover:bg-gray-50 transition-colors border-t border-gray-50"
                >
                  View all notifications
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <Link href="/dashboard/messages" className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <MessageSquare className="w-[18px] h-[18px] text-gray-400" />
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-[12px] flex items-center justify-center shadow-sm shadow-[#247BF7]/15">
              <span className="text-white text-[13px] font-semibold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-400 capitalize">{user?.role?.replace(/_/g, ' ')}</p>
            </div>
            <ChevronDown className={cn(
              'hidden md:block w-3.5 h-3.5 text-gray-400 transition-transform',
              showUserMenu && 'rotate-180'
            )} />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[11px] text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    Help Center
                  </Link>
                </div>
                <div className="p-2 border-t border-gray-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}





















// // client/components/dashboard/DashboardHeader.tsx
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import {
//   Menu, Search, Bell, MessageSquare, ChevronDown,
//   User, Settings, HelpCircle, LogOut, Command,
//   Sun, Moon
// } from 'lucide-react'
// import { cn } from '@/lib/utils'

// interface HeaderProps {
//   user: any
//   onMenuClick: () => void
// }

// export function DashboardHeader({ user, onMenuClick }: HeaderProps) {
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [showUserMenu, setShowUserMenu] = useState(false)
//   const [searchFocused, setSearchFocused] = useState(false)
//   const router = useRouter()

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     router.push('/login')
//   }
  

//   return (
//     <header className="h-[68px] bg-white/80 backdrop-blur-xl border-b border-gray-100/80 flex items-center justify-between px-4 md:px-6 lg:px-7 sticky top-0 z-30 flex-shrink-0">
//       {/* Left */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-50 transition-colors"
//         >
//           <Menu className="w-5 h-5 text-gray-500" />
//         </button>

//         {/* Search */}
//         <div className={cn(
//           'hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-2xl transition-all duration-300 border',
//           searchFocused 
//             ? 'bg-white border-gray-200 shadow-sm ring-2 ring-[#247BF7]/5' 
//             : 'bg-gray-50/80 border-transparent'
//         )}>
//           <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
//           <input
//             type="text"
//             placeholder="Search..."
//             onFocus={() => setSearchFocused(true)}
//             onBlur={() => setSearchFocused(false)}
//             className="bg-transparent border-none outline-none text-[13px] text-gray-700 placeholder:text-gray-400 w-32 md:w-48 lg:w-56"
//           />
//           <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] text-gray-400 font-mono leading-none">
//             <Command className="w-2.5 h-2.5" />K
//           </kbd>
//         </div>
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-1">
//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
//           >
//             <Bell className="w-[18px] h-[18px] text-gray-400" />
//             <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-red-500 rounded-full ring-2 ring-white" />
//           </button>

//           {showNotifications && (
//             <>
//               <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
//               <div className="absolute right-0 top-full mt-2 w-[340px] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
//                 <div className="p-4 border-b border-gray-50 flex items-center justify-between">
//                   <h3 className="font-semibold text-[14px] text-gray-900">Notifications</h3>
//                   <span className="px-2 py-0.5 bg-[#247BF7]/10 text-[#247BF7] text-[11px] font-semibold rounded-full">3 new</span>
//                 </div>
//                 <div className="max-h-[320px] overflow-y-auto">
//                   {[
//                     { title: 'Application update', desc: 'Your application is now under review', time: '2 min ago', unread: true },
//                     { title: 'Document verified', desc: 'Your academic transcript has been verified', time: '1 hour ago', unread: true },
//                     { title: 'Scholarship match', desc: 'New scholarship matches your profile', time: '3 hours ago', unread: false },
//                     { title: 'UPI Progress', desc: 'You completed Module 3. Great job!', time: '5 hours ago', unread: false },
//                   ].map((n, i) => (
//                     <div
//                       key={i}
//                       className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer transition-colors ${
//                         n.unread ? 'bg-[#F8FAFF]' : ''
//                       }`}
//                     >
//                       <div className="flex gap-3">
//                         <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
//                           n.unread ? 'bg-[#247BF7]' : 'bg-gray-200'
//                         }`} />
//                         <div>
//                           <p className="text-[13px] font-medium text-gray-900">{n.title}</p>
//                           <p className="text-[12px] text-gray-500 mt-0.5">{n.desc}</p>
//                           <p className="text-[11px] text-gray-400 mt-1.5">{n.time}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <Link
//                   href="/dashboard/notifications"
//                   className="block text-center p-3 text-[13px] text-[#247BF7] font-medium hover:bg-gray-50 transition-colors border-t border-gray-50"
//                 >
//                   View all notifications
//                 </Link>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Messages */}
//         <Link href="/dashboard/messages" className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
//           <MessageSquare className="w-[18px] h-[18px] text-gray-400" />
//         </Link>

//         {/* Divider */}
//         <div className="w-px h-6 bg-gray-200 mx-1" />

//         {/* User */}
//         <div className="relative">
//           <button
//             onClick={() => setShowUserMenu(!showUserMenu)}
//             className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-50 transition-colors"
//           >
//             <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-[12px] flex items-center justify-center shadow-sm shadow-[#247BF7]/15">
//               <span className="text-white text-[13px] font-semibold">
//                 {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
//               </span>
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-[13px] font-semibold text-gray-900 leading-tight">
//                 {user?.firstName} {user?.lastName}
//               </p>
//               <p className="text-[11px] text-gray-400 capitalize">{user?.role?.replace(/_/g, ' ')}</p>
//             </div>
//             <ChevronDown className={cn(
//               'hidden md:block w-3.5 h-3.5 text-gray-400 transition-transform',
//               showUserMenu && 'rotate-180'
//             )} />
//           </button>

//           {showUserMenu && (
//             <>
//               <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
//               <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
//                 <div className="p-3 border-b border-gray-50">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center">
//                       <span className="text-white text-sm font-semibold">
//                         {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-[13px] font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
//                       <p className="text-[11px] text-gray-400">{user?.email}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-2">
//                   {[
//                     { icon: User, label: 'Profile', href: '/dashboard/profile' },
//                     { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
//                     { icon: HelpCircle, label: 'Help Center', href: '/help' },
//                   ].map((item) => (
//                     <Link
//                       key={item.label}
//                       href={item.href}
//                       onClick={() => setShowUserMenu(false)}
//                       className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
//                     >
//                       <item.icon className="w-4 h-4 text-gray-400" />
//                       {item.label}
//                     </Link>
//                   ))}
//                 </div>
//                 <div className="p-2 border-t border-gray-50">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors w-full"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }