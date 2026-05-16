'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, ChevronDown, GraduationCap, BookOpen, Award, Newspaper,
  User, LayoutDashboard, Settings, LogOut, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const navigation = [
  {
    name: 'Institutions',
    href: '/institutions',
    children: [
      { name: 'Universities', href: '/institutions?type=university' },
      { name: 'Colleges', href: '/institutions?type=college' },
      { name: 'All Institutions', href: '/institutions' },
    ],
  },
  { name: 'Courses', href: '/courses' },
  { name: 'UPI Program', href: '/upi-program', highlight: true },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Blog', href: '/blog' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close all menus on route change
  useEffect(() => {
    setIsOpen(false)
    setExpandedSection(null)
    setShowUserMenu(false)
  }, [pathname])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleLogout = () => {
    setShowUserMenu(false)
    setIsOpen(false)
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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#247BF7] to-[#6366F1] bg-clip-text text-transparent">
              Scovers
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                  item.highlight
                    ? 'bg-[#247BF7] text-white hover:bg-[#1E40AF] shadow-sm'
                    : pathname.startsWith(item.href)
                    ? 'text-[#247BF7] bg-[#247BF7]/5'
                    : 'text-gray-600 hover:text-[#247BF7] hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Link 
                  href="/dashboard/notifications" 
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                </Link>

                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUserMenu(!showUserMenu)
                    }}
                    className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-gray-500 capitalize">{user.role?.replace(/_/g, ' ')}</p>
                    </div>
                    <ChevronDown className={cn(
                      'w-4 h-4 text-gray-400 transition-transform',
                      showUserMenu && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="p-4 border-b border-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href={getDashboardLink()}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-gray-50">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-[#247BF7] px-3 py-2 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 -mr-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-14 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-2xl z-40 overflow-y-auto"
            >
              <div className="pt-16 pb-6 px-4 space-y-1">
                {/* Mobile user info */}
                {isAuthenticated && user && (
                  <div className="p-4 mb-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsOpen(false)}
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-[#247BF7] text-white rounded-xl text-sm font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Go to Dashboard
                    </Link>
                  </div>
                )}

                {/* Navigation links */}
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setExpandedSection(expandedSection === item.name ? null : item.name)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-900 font-medium rounded-xl"
                        >
                          {item.name}
                          <ChevronDown className={cn(
                            'w-4 h-4 transition-transform',
                            expandedSection === item.name && 'rotate-180'
                          )} />
                        </button>
                        <AnimatePresence>
                          {expandedSection === item.name && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden ml-4"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  onClick={() => setIsOpen(false)}
                                  className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl"
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl font-medium',
                          item.highlight
                            ? 'bg-[#247BF7] text-white'
                            : 'text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile auth buttons */}
                <div className="pt-6 mt-6 border-t border-gray-100 space-y-3">
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-5 h-5" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-5 h-5" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="block text-center py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="block text-center py-3 rounded-xl bg-gray-900 text-white font-medium"
                      >
                        Get started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}















































// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Menu, X, ChevronDown, GraduationCap, BookOpen, Award, Newspaper,
//   User, LayoutDashboard, Settings, LogOut, Bell
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { useAuth } from '@/hooks/useAuth'

// const navigation = [
//   {
//     name: 'Institutions',
//     href: '/institutions',
//     children: [
//       { name: 'Universities', href: '/institutions?type=university' },
//       { name: 'Colleges', href: '/institutions?type=college' },
//       { name: 'All Institutions', href: '/institutions' },
//     ],
//   },
//   { name: 'Courses', href: '/courses' },
//   { name: 'UPI Program', href: '/upi-program', highlight: true },
//   { name: 'Scholarships', href: '/scholarships' },
//   { name: 'Blog', href: '/blog' },
// ]

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [scrolled, setScrolled] = useState(false)
//   const [expandedSection, setExpandedSection] = useState<string | null>(null)
//   const [showUserMenu, setShowUserMenu] = useState(false)
//   const pathname = usePathname()
//   const router = useRouter()
//   const { user, logout, isAuthenticated } = useAuth()

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10)
//     window.addEventListener('scroll', handleScroll, { passive: true })
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   useEffect(() => {
//     setIsOpen(false)
//     setExpandedSection(null)
//     setShowUserMenu(false)
//   }, [pathname])

//   useEffect(() => {
//     document.body.style.overflow = isOpen ? 'hidden' : ''
//     return () => { document.body.style.overflow = '' }
//   }, [isOpen])

//   const handleLogout = () => {
//     logout()
//     setShowUserMenu(false)
//     router.push('/')
//   }

//   const getDashboardLink = () => {
//     switch (user?.role) {
//       case 'admin':
//       case 'super_admin':
//         return '/admin'
//       case 'investor':
//         return '/investor'
//       case 'university_admin':
//         return '/university'
//       default:
//         return '/dashboard'
//     }
//   }

//   return (
//     <nav
//       className={cn(
//         'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
//         scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
//       )}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-14 md:h-16 lg:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
//             <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-xl flex items-center justify-center shadow-sm">
//               <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
//             </div>
//             <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#247BF7] to-[#6366F1] bg-clip-text text-transparent">
//               Scovers
//             </span>
//           </Link>

//           {/* Desktop nav */}
//           <div className="hidden lg:flex items-center gap-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={cn(
//                   'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
//                   item.highlight
//                     ? 'bg-[#247BF7] text-white hover:bg-[#1E40AF] shadow-sm'
//                     : pathname.startsWith(item.href)
//                     ? 'text-[#247BF7] bg-[#247BF7]/5'
//                     : 'text-gray-600 hover:text-[#247BF7] hover:bg-gray-50'
//                 )}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>

//           {/* Desktop right */}
//           <div className="hidden lg:flex items-center gap-3">
//             {isAuthenticated && user ? (
//               <>
//                 {/* Notifications */}
//                 <Link href="/dashboard/notifications" className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
//                   <Bell className="w-5 h-5" />
//                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
//                 </Link>

//                 {/* User Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="w-9 h-9 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center shadow-sm">
//                       <span className="text-white text-sm font-semibold">
//                         {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
//                       </span>
//                     </div>
//                     <div className="text-left hidden xl:block">
//                       <p className="text-sm font-semibold text-gray-900 leading-tight">
//                         {user.firstName} {user.lastName}
//                       </p>
//                       <p className="text-[11px] text-gray-500 capitalize">{user.role?.replace(/_/g, ' ')}</p>
//                     </div>
//                     <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', showUserMenu && 'rotate-180')} />
//                   </button>

//                   {showUserMenu && (
//                     <>
//                       <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
//                       <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
//                         {/* User Info */}
//                         <div className="p-4 border-b border-gray-50">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center">
//                               <span className="text-white font-semibold">
//                                 {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
//                               </span>
//                             </div>
//                             <div>
//                               <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
//                               <p className="text-xs text-gray-500">{user.email}</p>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Menu Items */}
//                         <div className="p-2">
//                           <Link
//                             href={getDashboardLink()}
//                             onClick={() => setShowUserMenu(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
//                           >
//                             <LayoutDashboard className="w-4 h-4" />
//                             Dashboard
//                           </Link>
//                           <Link
//                             href="/dashboard/profile"
//                             onClick={() => setShowUserMenu(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
//                           >
//                             <User className="w-4 h-4" />
//                             Profile
//                           </Link>
//                           <Link
//                             href="/dashboard/settings"
//                             onClick={() => setShowUserMenu(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
//                           >
//                             <Settings className="w-4 h-4" />
//                             Settings
//                           </Link>
//                         </div>

//                         {/* Logout */}
//                         <div className="p-2 border-t border-gray-50">
//                           <button
//                             onClick={handleLogout}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
//                           >
//                             <LogOut className="w-4 h-4" />
//                             Sign out
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#247BF7] px-3 py-2 transition-colors">
//                   Sign in
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
//                 >
//                   Get started
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile hamburger */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="lg:hidden p-2 -mr-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="lg:hidden fixed inset-0 top-14 bg-black/30 backdrop-blur-sm z-40"
//               onClick={() => setIsOpen(false)}
//             />
//             <motion.div
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               exit={{ x: '100%' }}
//               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//               className="lg:hidden fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-2xl z-40 overflow-y-auto"
//             >
//               <div className="pt-16 pb-6 px-4 space-y-1">
//                 {/* Mobile user info if logged in */}
//                 {isAuthenticated && user && (
//                   <div className="p-4 mb-4 bg-gray-50 rounded-2xl">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-xl flex items-center justify-center">
//                         <span className="text-white font-semibold text-lg">
//                           {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
//                         <p className="text-sm text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                     <Link
//                       href={getDashboardLink()}
//                       onClick={() => setIsOpen(false)}
//                       className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-[#247BF7] text-white rounded-xl text-sm font-medium"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       Go to Dashboard
//                     </Link>
//                   </div>
//                 )}

//                 {/* Navigation links */}
//                 {navigation.map((item) => (
//                   <div key={item.name}>
//                     {item.children ? (
//                       <>
//                         <button
//                           onClick={() => setExpandedSection(expandedSection === item.name ? null : item.name)}
//                           className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-900 font-medium rounded-xl"
//                         >
//                           {item.name}
//                           <ChevronDown className={cn('w-4 h-4 transition-transform', expandedSection === item.name && 'rotate-180')} />
//                         </button>
//                         <AnimatePresence>
//                           {expandedSection === item.name && (
//                             <motion.div
//                               initial={{ height: 0 }}
//                               animate={{ height: 'auto' }}
//                               exit={{ height: 0 }}
//                               className="overflow-hidden ml-4"
//                             >
//                               {item.children.map((child) => (
//                                 <Link
//                                   key={child.name}
//                                   href={child.href}
//                                   onClick={() => setIsOpen(false)}
//                                   className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl"
//                                 >
//                                   {child.name}
//                                 </Link>
//                               ))}
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </>
//                     ) : (
//                       <Link
//                         href={item.href}
//                         onClick={() => setIsOpen(false)}
//                         className={cn(
//                           'block px-4 py-3 rounded-xl font-medium',
//                           item.highlight
//                             ? 'bg-[#247BF7] text-white'
//                             : 'text-gray-900 hover:bg-gray-50'
//                         )}
//                       >
//                         {item.name}
//                       </Link>
//                     )}
//                   </div>
//                 ))}

//                 {/* Mobile auth */}
//                 <div className="pt-6 mt-6 border-t border-gray-100 space-y-3">
//                   {isAuthenticated && user ? (
//                     <>
//                       <Link
//                         href="/dashboard/profile"
//                         onClick={() => setIsOpen(false)}
//                         className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
//                       >
//                         <User className="w-5 h-5" />
//                         Profile
//                       </Link>
//                       <Link
//                         href="/dashboard/settings"
//                         onClick={() => setIsOpen(false)}
//                         className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
//                       >
//                         <Settings className="w-5 h-5" />
//                         Settings
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full"
//                       >
//                         <LogOut className="w-5 h-5" />
//                         Sign out
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <Link
//                         href="/login"
//                         onClick={() => setIsOpen(false)}
//                         className="block text-center py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
//                       >
//                         Sign in
//                       </Link>
//                       <Link
//                         href="/register"
//                         onClick={() => setIsOpen(false)}
//                         className="block text-center py-3 rounded-xl bg-gray-900 text-white font-medium"
//                       >
//                         Get started
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </nav>
//   )
// }