'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  GraduationCap, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Chrome 
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectUrl)
    }
  }, [isAuthenticated, redirectUrl, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
      toast.success('Welcome back!')
      // login() in useAuth already handles redirect based on role
      // But we need to override with the return URL if coming from UPI apply
      if (redirectUrl && redirectUrl !== '/dashboard') {
        setTimeout(() => {
          router.push(redirectUrl)
        }, 500)
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="relative text-center px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/" className="inline-flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">Scovers</span>
            </Link>
            
            {redirectUrl?.includes('upi-program') ? (
              <>
                <h2 className="text-4xl font-bold text-white mb-4">Complete Your Application</h2>
                <p className="text-lg text-gray-400 max-w-sm mx-auto">
                  Sign in to continue your UPI program application where you left off.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-white mb-4">Welcome back</h2>
                <p className="text-lg text-gray-400 max-w-sm mx-auto">
                  Sign in to access your applications, track progress, and explore opportunities.
                </p>
              </>
            )}

            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              {[
                { value: '10K+', label: 'Students' },
                { value: '500+', label: 'Institutions' },
                { value: '50+', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#FAFBFC]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-500">
              {redirectUrl?.includes('upi-program') 
                ? 'Sign in to complete your UPI application' 
                : 'Welcome back to your account'}
            </p>
            {redirectUrl?.includes('upi-program') && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs">ℹ</span>
                </div>
                <p className="text-[12px] text-blue-700">
                  You were applying for a UPI program. Sign in to continue where you left off.
                </p>
              </div>
            )}
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors mb-6 font-medium">
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#FAFBFC] text-gray-400">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="you@example.com" {...register('email')}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400" />
              </div>
              {errors.email && <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-sm text-[#247BF7] hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="text-[#247BF7] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}










































// // client/app/(auth)/login/page.tsx
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { 
//   GraduationCap, Mail, Lock, Eye, EyeOff, 
//   ArrowRight, ArrowLeft, Chrome 
// } from 'lucide-react'
// import { useAuth } from '@/hooks/useAuth'
// import toast from 'react-hot-toast'

// const loginSchema = z.object({
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// })

// type LoginFormData = z.infer<typeof loginSchema>

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const { login } = useAuth()
//   const router = useRouter()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   })

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       setIsLoading(true)
//       await login(data.email, data.password)
//       // Remove router.push here - login() already handles redirect
//       toast.success('Welcome back!')
//     } catch (error: any) {
//       toast.error(error.message || 'Invalid credentials')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Left - Visual */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden items-center justify-center">
//         {/* Background pattern */}
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
//         {/* Glow */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        
//         <div className="relative text-center px-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <Link href="/" className="inline-flex items-center space-x-3 mb-8">
//               <div className="w-12 h-12 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-2xl flex items-center justify-center">
//                 <GraduationCap className="w-7 h-7 text-white" />
//               </div>
//               <span className="text-3xl font-bold text-white">Scovers</span>
//             </Link>
            
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Welcome back
//             </h2>
//             <p className="text-lg text-gray-400 max-w-sm mx-auto">
//               Sign in to access your applications, track progress, and explore opportunities.
//             </p>

//             <div className="mt-12 grid grid-cols-3 gap-4 text-center">
//               {[
//                 { value: '10K+', label: 'Students' },
//                 { value: '500+', label: 'Institutions' },
//                 { value: '50+', label: 'Countries' },
//               ].map((stat) => (
//                 <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
//                   <div className="text-2xl font-bold text-white">{stat.value}</div>
//                   <div className="text-sm text-gray-400">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Right - Form */}
//       <div className="flex-1 flex items-center mt-5 justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#FAFBFC]">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="w-full max-w-md"
//         >
//           {/* Mobile logo */}
//           <div className="lg:hidden text-center mb-8">
//             {/* <Link href="/" className="inline-flex items-center space-x-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-xl flex items-center justify-center">
//                 <GraduationCap className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold text-gradient">Scovers</span>
//             </Link> */}
//           </div>

//           <div className="mb-8">
//             {/* <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
//               <ArrowLeft className="w-4 h-4" />
//               Back to home
//             </Link> */}
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
//             <p className="text-gray-500">Welcome back to your account</p>
//           </div>

//           {/* Social login */}
//           <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors mb-6 font-medium">
//             <Chrome className="w-5 h-5" />
//             Continue with Google
//           </button>

//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-4 bg-[#FAFBFC] text-gray-400">or continue with email</span>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="email"
//                   placeholder="you@example.com"
//                   {...register('email')}
//                   className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>
//               )}
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="block text-sm font-medium text-gray-700">Password</label>
//                 <Link href="/forgot-password" className="text-sm text-[#247BF7] hover:underline">
//                   Forgot?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="••••••••"
//                   {...register('password')}
//                   className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 id="remember"
//                 className="w-4 h-4 rounded border-gray-300 text-[#247BF7] focus:ring-[#247BF7]"
//               />
//               <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   Sign in
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>
//           </form>

//           <p className="text-center mt-6 text-sm text-gray-500">
//             Don't have an account?{' '}
//             <Link href="/register" className="text-[#247BF7] font-medium hover:underline">
//               Create one
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   )
// }