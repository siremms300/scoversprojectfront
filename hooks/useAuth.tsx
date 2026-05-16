'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const roleDashboardMap: Record<string, string> = {
  student: '/dashboard',
  admin: '/admin',
  super_admin: '/admin',
  investor: '/investor',
  university_admin: '/university',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.data)
        else { localStorage.removeItem('token'); setUser(null) }
      })
      .catch(() => { localStorage.removeItem('token'); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  // Protect routes
  useEffect(() => {
    if (loading) return

    const protectedPaths = ['/dashboard', '/admin', '/investor', '/university']
    const isProtected = protectedPaths.some(p => pathname.startsWith(p))

    // If not logged in and on protected route, redirect to login
    if (!user && isProtected) {
      router.replace('/login')
      return
    }

    // If logged in, check role-based access
    if (user && isProtected) {
      const rolePaths: Record<string, string[]> = {
        student: ['/dashboard'],
        admin: ['/admin', '/dashboard'],
        super_admin: ['/admin', '/dashboard'],
        investor: ['/investor'],
        university_admin: ['/university'],
      }
      const allowed = rolePaths[user.role] || ['/dashboard']
      const hasAccess = allowed.some(p => pathname.startsWith(p))

      if (!hasAccess) {
        router.replace(roleDashboardMap[user.role] || '/dashboard')
      }
    }
  }, [user, loading, pathname, router])

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Invalid credentials')
    }

    const data = await response.json()
    localStorage.setItem('token', data.data.token)
    setUser(data.data.user)
    // Don't redirect here - login page handles the redirect with searchParams
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    router.replace('/login')
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}




































// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// const roleDashboardMap: Record<string, string> = {
//   student: '/dashboard',
//   admin: '/admin',
//   super_admin: '/admin',
//   investor: '/investor',
//   university_admin: '/university',
// }

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       setUser(null)
//       setLoading(false)
//       return
//     }

//     fetch(`${API_URL}/auth/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setUser(data.data)
//         else { localStorage.removeItem('token'); setUser(null) }
//       })
//       .catch(() => { localStorage.removeItem('token'); setUser(null) })
//       .finally(() => setLoading(false))
//   }, [])

//   // Only protect routes, don't auto-redirect logged-in users away from public pages
//   useEffect(() => {
//     if (loading) return

//     const protectedPaths = ['/dashboard', '/admin', '/investor', '/university']
//     const isProtected = protectedPaths.some(p => pathname.startsWith(p))

//     // If not logged in and on protected route, redirect to login
//     if (!user && isProtected) {
//       router.replace('/login')
//       return
//     }

//     // If logged in, check role-based access to protected routes
//     if (user && isProtected) {
//       const rolePaths: Record<string, string[]> = {
//         student: ['/dashboard'],
//         admin: ['/admin', '/dashboard'],
//         super_admin: ['/admin', '/dashboard'],
//         investor: ['/investor'],
//         university_admin: ['/university'],
//       }
//       const allowed = rolePaths[user.role] || ['/dashboard']
//       const hasAccess = allowed.some(p => pathname.startsWith(p))

//       if (!hasAccess) {
//         router.replace(roleDashboardMap[user.role] || '/dashboard')
//       }
//     }
//   }, [user, loading, pathname, router])

//   const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message || 'Invalid credentials')
//     }

//     const data = await response.json()
//     localStorage.setItem('token', data.data.token)
//     setUser(data.data.user)
//     router.replace(roleDashboardMap[data.data.user.role] || '/dashboard')
//   }

//   const logout = useCallback(() => {
//     localStorage.removeItem('token')
//     setUser(null)
//     router.replace('/login')
//   }, [router])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
//         <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
//   return context
// }








































// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   hasAccess: (allowedRoles: string[]) => boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// const publicRoutes = [
//   '/',
//   '/login',
//   '/register',
//   '/forgot-password',
//   '/institutions',
//   '/courses',
//   '/scholarships',
//   '/upi-program',
//   '/blog',
//   '/how-it-works',
//   '/contact',
//   '/faq',
//   '/privacy',
//   '/terms',
// ]

// const protectedRoutes = ['/dashboard', '/admin', '/investor', '/university']

// const roleRedirectMap: Record<string, string> = {
//   student: '/dashboard',
//   admin: '/admin',
//   super_admin: '/admin',
//   investor: '/investor',
//   university_admin: '/university',
// }

// const roleAccessMap: Record<string, string[]> = {
//   student: ['/dashboard'],
//   admin: ['/admin', '/dashboard'],
//   super_admin: ['/admin', '/dashboard'],
//   investor: ['/investor'],
//   university_admin: ['/university'],
// }

// function isProtectedRoute(pathname: string): boolean {
//   return protectedRoutes.some(route => pathname.startsWith(route))
// }

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         setUser(null)
//         setLoading(false)
//         return
//       }

//       const response = await fetch(`${API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.data)
//       } else {
//         localStorage.removeItem('token')
//         setUser(null)
//       }
//     } catch (error) {
//       localStorage.removeItem('token')
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const hasAccess = useCallback((allowedRoles: string[]) => {
//     if (!user) return false
//     return allowedRoles.includes(user.role)
//   }, [user])

//   // Handle routing after auth state is determined
//   useEffect(() => {
//     if (loading) return

//     // If NOT logged in and trying to access protected route
//     if (!user && isProtectedRoute(pathname)) {
//       router.replace('/login')
//       return
//     }

//     // If logged in
//     if (user) {
//       const allowedPaths = roleAccessMap[user.role] || ['/dashboard']
      
//       // Check protected route access
//       if (isProtectedRoute(pathname)) {
//         const canAccess = allowedPaths.some(p => pathname.startsWith(p))
        
//         if (!canAccess) {
//           router.replace(roleRedirectMap[user.role] || '/dashboard')
//           return
//         }
//       }

//       // If on auth pages while logged in, redirect to dashboard
//       if (pathname === '/login' || pathname === '/register') {
//         router.replace(roleRedirectMap[user.role] || '/dashboard')
//         return
//       }
//     }
//   }, [user, loading, pathname, router])

//   const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message || 'Invalid credentials')
//     }

//     const data = await response.json()
//     localStorage.setItem('token', data.data.token)
//     setUser(data.data.user)

//     const redirectUrl = roleRedirectMap[data.data.user.role] || '/dashboard'
//     router.push(redirectUrl)
//   }

//   const logout = useCallback(() => {
//     localStorage.removeItem('token')
//     setUser(null)
//     // Force redirect to home immediately
//     window.location.href = '/'
//   }, [])

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//     hasAccess,
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
//         <div className="text-center">
//           <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//           <p className="text-sm text-gray-500">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }







































// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   hasAccess: (allowedRoles: string[]) => boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// // Public routes that don't need auth
// const publicRoutes = [
//   '/',
//   '/login',
//   '/register',
//   '/forgot-password',
//   '/institutions',
//   '/courses',
//   '/scholarships',
//   '/upi-program',
//   '/blog',
//   '/how-it-works',
//   '/contact',
//   '/faq',
//   '/privacy',
//   '/terms',
// ]

// // Protected routes
// const protectedRoutes = ['/dashboard', '/admin', '/investor', '/university']

// // Role to route mapping
// const roleRedirectMap: Record<string, string> = {
//   student: '/dashboard',
//   admin: '/admin',
//   super_admin: '/admin',
//   investor: '/investor',
//   university_admin: '/university',
// }

// const roleAccessMap: Record<string, string[]> = {
//   student: ['/dashboard'],
//   admin: ['/admin', '/dashboard'],
//   super_admin: ['/admin', '/dashboard'],
//   investor: ['/investor'],
//   university_admin: ['/university'],
// }

// function isPublicRoute(pathname: string): boolean {
//   return publicRoutes.some(route => 
//     pathname === route || pathname.startsWith(route + '/') || pathname.startsWith(route + '?')
//   )
// }

// function isProtectedRoute(pathname: string): boolean {
//   return protectedRoutes.some(route => pathname.startsWith(route))
// }

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   // Check auth on mount
//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         setUser(null)
//         setLoading(false)
//         return
//       }

//       const response = await fetch(`${API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.data)
//       } else {
//         localStorage.removeItem('token')
//         setUser(null)
//       }
//     } catch (error) {
//       localStorage.removeItem('token')
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const hasAccess = useCallback((allowedRoles: string[]) => {
//     if (!user) return false
//     return allowedRoles.includes(user.role)
//   }, [user])

//   // Handle routing after auth state is determined
//   useEffect(() => {
//     if (loading) return

//     // If no user and trying to access protected route -> redirect to login
//     if (!user && isProtectedRoute(pathname)) {
//       router.replace('/login')
//       return
//     }

//     // If user exists, check if they can access current route
//     if (user) {
//       const allowedPaths = roleAccessMap[user.role] || ['/dashboard']
      
//       // Check if current path is protected and not allowed for this role
//       if (isProtectedRoute(pathname)) {
//         const hasAccess = allowedPaths.some(path => pathname.startsWith(path))
        
//         if (!hasAccess) {
//           // Redirect to their correct dashboard
//           router.replace(roleRedirectMap[user.role] || '/dashboard')
//           return
//         }
//       }

//       // If on login/register while authenticated, redirect to dashboard
//       if (pathname === '/login' || pathname === '/register') {
//         router.replace(roleRedirectMap[user.role] || '/dashboard')
//         return
//       }
//     }
//   }, [user, loading, pathname, router])

//   const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message || 'Invalid credentials')
//     }

//     const data = await response.json()
//     localStorage.setItem('token', data.data.token)
//     setUser(data.data.user)

//     // Redirect based on role
//     const redirectUrl = roleRedirectMap[data.data.user.role] || '/dashboard'
//     router.push(redirectUrl)
//   }

//   const logout = useCallback(() => {
//     localStorage.removeItem('token')
//     setUser(null)
//     router.push('/')
//   }, [router])

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//     hasAccess,
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
//         <div className="text-center">
//           <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//           <p className="text-sm text-gray-500">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }












































// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   hasAccess: (allowedRoles: string[]) => boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// // Define which routes each role can access
// const roleRouteMap: Record<string, string[]> = {
//   student: ['/dashboard'],
//   admin: ['/admin', '/dashboard'],
//   super_admin: ['/admin', '/dashboard'],
//   investor: ['/investor'],
//   university_admin: ['/university'],
// }

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   // Check auth on mount
//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         setUser(null)
//         setLoading(false)
//         return
//       }

//       const response = await fetch(`${API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.data)
//       } else {
//         localStorage.removeItem('token')
//         setUser(null)
//       }
//     } catch (error) {
//       localStorage.removeItem('token')
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Check if user has access to current route
//   const hasAccess = useCallback((allowedRoles: string[]) => {
//     if (!user) return false
//     return allowedRoles.includes(user.role)
//   }, [user])

//   // Protect routes - redirect unauthorized users
//   useEffect(() => {
//     if (loading || !user) return

//     const currentRole = user.role
//     const allowedPaths = roleRouteMap[currentRole] || ['/dashboard']
    
//     // Check if current path is allowed for this role
//     const isAllowed = allowedPaths.some(path => pathname.startsWith(path))
    
//     // Also allow public routes
//     const publicRoutes = ['/', '/login', '/register', '/institutions', '/courses', '/scholarships', '/upi-program', '/blog']
//     const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

//     if (!isAllowed && !isPublic) {
//       // Redirect to their correct dashboard
//       const redirectMap: Record<string, string> = {
//         student: '/dashboard',
//         admin: '/admin',
//         super_admin: '/admin',
//         investor: '/investor',
//         university_admin: '/university',
//       }
//       router.replace(redirectMap[currentRole] || '/dashboard')
//     }
//   }, [user, loading, pathname, router])

//   // Redirect to login if not authenticated and trying to access protected route
//   useEffect(() => {
//     if (loading) return

//     const protectedRoutes = ['/dashboard', '/admin', '/investor', '/university']
//     const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

//     if (!user && isProtected) {
//       router.replace('/login')
//     }
//   }, [user, loading, pathname, router])

//   const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message || 'Invalid credentials')
//     }

//     const data = await response.json()
//     localStorage.setItem('token', data.data.token)
//     setUser(data.data.user)

//     // Redirect based on role
//     const role = data.data.user.role
//     const redirectMap: Record<string, string> = {
//       student: '/dashboard',
//       admin: '/admin',
//       super_admin: '/admin',
//       investor: '/investor',
//       university_admin: '/university',
//     }
//     router.push(redirectMap[role] || '/dashboard')
//   }

//   const logout = useCallback(() => {
//     localStorage.removeItem('token')
//     setUser(null)
//     router.push('/')
//   }, [router])

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//     hasAccess,
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
//         <div className="text-center">
//           <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//           <p className="text-sm text-gray-500">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }








// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   // Check auth on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         if (!token) {
//           setUser(null)
//           setLoading(false)
//           return
//         }

//         const response = await fetch(`${API_URL}/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         if (response.ok) {
//           const data = await response.json()
//           setUser(data.data)
//         } else {
//           localStorage.removeItem('token')
//           setUser(null)
//         }
//       } catch (error) {
//         localStorage.removeItem('token')
//         setUser(null)
//       } finally {
//         setLoading(false)
//       }
//     }

//     checkAuth()
//   }, [])

//     const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || 'Invalid credentials')
//     }

//     const data = await response.json()
//     localStorage.setItem('token', data.data.token)
//     setUser(data.data.user)

//     // Redirect based on role
//     const role = data.data.user.role
//     switch (role) {
//         case 'admin':
//         case 'super_admin':
//         router.push('/admin')
//         break
//         case 'investor':
//         router.push('/investor')
//         break
//         case 'university_admin':
//         router.push('/university')
//         break
//         default:
//         router.push('/dashboard')
//     }
//     }

//   const logout = useCallback(() => {
//     localStorage.removeItem('token')
//     setUser(null)
//     router.push('/')
//   }, [router])

//   // Protect routes - redirect to login if not authenticated
//   useEffect(() => {
//     if (!loading && !user) {
//       const protectedRoutes = ['/dashboard', '/admin', '/investor', '/university']
//       const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
//       if (isProtected) {
//         router.replace('/login')
//       }
//     }
//   }, [loading, user, pathname, router])

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//   }

//   // Show nothing while checking auth on protected routes
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
//         <div className="text-center">
//           <div className="w-10 h-10 border-2 border-[#247BF7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//           <p className="text-sm text-gray-500">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }


















































































// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
// import { useRouter, usePathname } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// // Listen for storage changes (for multi-tab support)
// function useStorageListener(logout: () => void) {
//   useEffect(() => {
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'token' && !e.newValue) {
//         logout()
//       }
//     }
//     window.addEventListener('storage', handleStorageChange)
//     return () => window.removeEventListener('storage', handleStorageChange)
//   }, [logout])
// }

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()

//   const checkAuth = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         setUser(null)
//         setLoading(false)
//         return
//       }

//       const response = await fetch(`${API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.data)
//       } else {
//         localStorage.removeItem('token')
//         setUser(null)
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error)
//       localStorage.removeItem('token')
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Check auth on mount and when token changes
//   useEffect(() => {
//     checkAuth()
//   }, [checkAuth])

//     const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || 'Invalid credentials')
//     }

//     const data = await response.json()
    
//     // Set token in localStorage
//     localStorage.setItem('token', data.data.token)
    
//     // Also set as cookie for middleware
//     document.cookie = `token=${data.data.token}; path=/; max-age=2592000; SameSite=Lax`
    
//     setUser(data.data.user)
//     }

//     const logout = useCallback(() => {
//     // Clear localStorage
//     localStorage.removeItem('token')
    
//     // Clear cookie
//     document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
//     // Clear user state
//     setUser(null)
    
//     // Redirect to home
//     router.push('/')
//     }, [router])

//   // Listen for storage events
//   useStorageListener(logout)

//   // Redirect to login if accessing dashboard without auth
//   useEffect(() => {
//     if (!loading && !user) {
//       const protectedRoutes = ['/dashboard', '/admin', '/investor', '/university']
//       const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
//       if (isProtected) {
//         router.push('/login')
//       }
//     }
//   }, [loading, user, pathname, router])

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }














































































// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
// import { useRouter } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   setUser: (user: User | null) => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   // Check auth on mount
//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (token) {
//         const response = await fetch(`${API_URL}/auth/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         if (response.ok) {
//           const data = await response.json()
//           setUser(data.data)
//         } else {
//           // Token invalid, clear it
//           localStorage.removeItem('token')
//           setUser(null)
//         }
//       } else {
//         setUser(null)
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error)
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message || 'Invalid credentials')
//     }

//     const data = await response.json()
//     localStorage.setItem('token', data.data.token)
//     setUser(data.data.user)
//   }

//   const logout = useCallback(() => {
//     // Clear token
//     localStorage.removeItem('token')
//     // Clear user state immediately
//     setUser(null)
//     // Navigate to home
//     router.push('/')
//   }, [router])

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//     setUser,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }


























































// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { useRouter } from 'next/navigation'

// interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   role: 'student' | 'admin' | 'super_admin' | 'investor' | 'university_admin'
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   isAuthenticated: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (token) {
//         const response = await fetch(`${API_URL}/auth/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         if (response.ok) {
//           const data = await response.json()
//           setUser(data.data)
//         } else {
//           localStorage.removeItem('token')
//         }
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })

//     if (!response.ok) {
//       const error = await response.json()
//       throw new Error(error.message)
//     }

//     const data = await response.json()
//     localStorage.setItem('token', data.data.token)
//     setUser(data.data.user)
//     router.push('/dashboard')
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     setUser(null)
//     router.push('/')
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         logout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }