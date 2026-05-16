'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  GraduationCap, Mail, Lock, Eye, EyeOff, 
  ArrowRight, ArrowLeft, User, Chrome, CheckCircle2 
} from 'lucide-react'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const steps = [
  { id: 1, title: 'Account', subtitle: 'Your basic information' },
  { id: 2, title: 'Password', subtitle: 'Create a secure password' },
  { id: 3, title: 'Done', subtitle: 'You\'re all set' },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const password = watch('password')

  const passwordStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 8) score++
    if (pass.match(/[A-Z]/)) score++
    if (pass.match(/[0-9]/)) score++
    if (pass.match(/[^A-Za-z0-9]/)) score++
    return score
  }

  const strength = password ? passwordStrength(password) : 0
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400']

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger(['firstName', 'lastName', 'email'])
      if (valid) setStep(2)
    } else if (step === 2) {
      const valid = await trigger(['password', 'confirmPassword'])
      if (valid) setStep(3)
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const result = await response.json()
      localStorage.setItem('token', result.data.token)
      
      toast.success('Account created! Welcome to Scovers.')
      
      // Redirect to the original destination
      if (redirectUrl && redirectUrl !== '/dashboard') {
        router.push(redirectUrl)
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      setStep(2)
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
            
            <h2 className="text-4xl font-bold text-white mb-4">Start your journey</h2>
            <p className="text-lg text-gray-400 max-w-sm mx-auto mb-12">
              Join 10,000+ students who have found their path to international education.
            </p>

            <div className="space-y-4 text-left max-w-xs mx-auto">
              {[
                'Access 500+ partner institutions',
                'Apply for matched scholarships',
                'Track applications in real-time',
                'Earn transferable UPI credits',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#FAFBFC]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500">Get started in just a few steps</p>
            {redirectUrl?.includes('upi-program') && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                <span className="text-blue-600 text-sm flex-shrink-0 mt-0.5">ℹ</span>
                <p className="text-[12px] text-blue-700">
                  Create an account to complete your UPI program application.
                </p>
              </div>
            )}
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step > s.id 
                    ? 'bg-emerald-500 text-white' 
                    : step === s.id 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded transition-all ${
                    step > s.id ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Account Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="John" {...register('firstName')}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400" />
                    </div>
                    {errors.firstName && <p className="text-sm text-red-500 mt-1.5">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Doe" {...register('lastName')}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400" />
                    </div>
                    {errors.lastName && <p className="text-sm text-red-500 mt-1.5">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" placeholder="you@example.com" {...register('email')}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400" />
                  </div>
                  {errors.email && <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>}
                </div>

                <button type="button" onClick={handleNext}
                  className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" {...register('password')}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>}
                  
                  {password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                            i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                          }`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Strength: <span className="font-medium">{strengthLabels[strength - 1] || 'Weak'}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" {...register('confirmPassword')}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400" />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500 mt-1.5">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={handleNext}
                    className="flex-1 bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Submit */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">You're all set!</h3>
                  <p className="text-sm text-gray-500">Click below to create your account</p>
                </div>

                <div className="bg-white rounded-xl p-4 space-y-2 text-sm border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium">{watch('firstName')} {watch('lastName')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium">{watch('email')}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex-1 bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#FAFBFC] text-gray-400">or</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>
            </>
          )}

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-[#247BF7] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}






















































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
//   ArrowRight, ArrowLeft, User, Chrome, CheckCircle2 
// } from 'lucide-react'
// import toast from 'react-hot-toast'

// const registerSchema = z.object({
//   firstName: z.string().min(2, 'First name is required'),
//   lastName: z.string().min(2, 'Last name is required'),
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ['confirmPassword'],
// })

// type RegisterFormData = z.infer<typeof registerSchema>

// const steps = [
//   { id: 1, title: 'Account', subtitle: 'Your basic information' },
//   { id: 2, title: 'Password', subtitle: 'Create a secure password' },
//   { id: 3, title: 'Done', subtitle: 'You\'re all set' },
// ]

// export default function RegisterPage() {
//   const [step, setStep] = useState(1)
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     watch,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     mode: 'onChange',
//   })

//   const password = watch('password')

//   const passwordStrength = (pass: string) => {
//     let score = 0
//     if (pass.length >= 8) score++
//     if (pass.match(/[A-Z]/)) score++
//     if (pass.match(/[0-9]/)) score++
//     if (pass.match(/[^A-Za-z0-9]/)) score++
//     return score
//   }

//   const strength = password ? passwordStrength(password) : 0
//   const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
//   const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400']

//   const handleNext = async () => {
//     if (step === 1) {
//       const valid = await trigger(['firstName', 'lastName', 'email'])
//       if (valid) setStep(2)
//     } else if (step === 2) {
//       const valid = await trigger(['password', 'confirmPassword'])
//       if (valid) setStep(3)
//     }
//   }

//   const onSubmit = async (data: RegisterFormData) => {
//     try {
//       setIsLoading(true)
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//           password: data.password,
//         }),
//       })
      
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message)
//       }

//       const result = await response.json()
//       localStorage.setItem('token', result.data.token)
//       toast.success('Account created! Welcome to Scovers.')
//       router.push('/dashboard')
//     } catch (error: any) {
//       toast.error(error.message || 'Registration failed')
//       setStep(2)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Left - Visual */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden items-center justify-center">
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
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
//               Start your journey
//             </h2>
//             <p className="text-lg text-gray-400 max-w-sm mx-auto mb-12">
//               Join 10,000+ students who have found their path to international education.
//             </p>

//             <div className="space-y-4 text-left max-w-xs mx-auto">
//               {[
//                 'Access 500+ partner institutions',
//                 'Apply for matched scholarships',
//                 'Track applications in real-time',
//                 'Earn transferable UPI credits',
//               ].map((benefit) => (
//                 <div key={benefit} className="flex items-center gap-3">
//                   <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
//                   <span className="text-gray-300 text-sm">{benefit}</span>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Right - Form */}
//       <div className="flex-1 flex items-center justify-center mt-5 px-4 sm:px-6 lg:px-8 py-12 bg-[#FAFBFC]">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
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
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
//             <p className="text-gray-500">Get started in just a few steps</p>
//           </div>

//           {/* Steps indicator */}
//           <div className="flex items-center gap-2 mb-8">
//             {steps.map((s, i) => (
//               <div key={s.id} className="flex items-center gap-2 flex-1">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
//                   step > s.id 
//                     ? 'bg-emerald-500 text-white' 
//                     : step === s.id 
//                     ? 'bg-gray-900 text-white' 
//                     : 'bg-gray-100 text-gray-400'
//                 }`}>
//                   {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
//                 </div>
//                 {i < steps.length - 1 && (
//                   <div className={`flex-1 h-0.5 rounded transition-all ${
//                     step > s.id ? 'bg-emerald-500' : 'bg-gray-200'
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Step 1: Account Info */}
//             {step === 1 && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="space-y-5"
//               >
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
//                     <div className="relative">
//                       <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         placeholder="John"
//                         {...register('firstName')}
//                         className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
//                       />
//                     </div>
//                     {errors.firstName && (
//                       <p className="text-sm text-red-500 mt-1.5">{errors.firstName.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
//                     <div className="relative">
//                       <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         placeholder="Doe"
//                         {...register('lastName')}
//                         className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
//                       />
//                     </div>
//                     {errors.lastName && (
//                       <p className="text-sm text-red-500 mt-1.5">{errors.lastName.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                   <div className="relative">
//                     <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type="email"
//                       placeholder="you@example.com"
//                       {...register('email')}
//                       className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>
//                   )}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
//                 >
//                   Continue
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </motion.div>
//             )}

//             {/* Step 2: Password */}
//             {step === 2 && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="space-y-5"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Min. 8 characters"
//                       {...register('password')}
//                       className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>
//                   )}
                  
//                   {/* Password strength */}
//                   {password && (
//                     <div className="mt-3">
//                       <div className="flex gap-1 mb-1">
//                         {[...Array(4)].map((_, i) => (
//                           <div
//                             key={i}
//                             className={`h-1.5 flex-1 rounded-full transition-all ${
//                               i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <p className="text-xs text-gray-500">
//                         Strength: <span className="font-medium">{strengthLabels[strength - 1] || 'Weak'}</span>
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Repeat your password"
//                       {...register('confirmPassword')}
//                       className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
//                     />
//                   </div>
//                   {errors.confirmPassword && (
//                     <p className="text-sm text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
//                   )}
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setStep(1)}
//                     className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleNext}
//                     className="flex-1 bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
//                   >
//                     Continue
//                     <ArrowRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </motion.div>
//             )}

//             {/* Step 3: Submit */}
//             {step === 3 && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="space-y-5"
//               >
//                 <div className="bg-emerald-50 rounded-2xl p-6 text-center">
//                   <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <CheckCircle2 className="w-7 h-7 text-emerald-500" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-1">You're all set!</h3>
//                   <p className="text-sm text-gray-500">Click below to create your account</p>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Name</span>
//                     <span className="font-medium">{watch('firstName')} {watch('lastName')}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Email</span>
//                     <span className="font-medium">{watch('email')}</span>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setStep(2)}
//                     className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="flex-1 bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                         </svg>
//                         Creating account...
//                       </>
//                     ) : (
//                       'Create account'
//                     )}
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </form>

//           {step === 1 && (
//             <>
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-[#FAFBFC] text-gray-400">or</span>
//                 </div>
//               </div>

//               <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium">
//                 <Chrome className="w-5 h-5" />
//                 Continue with Google
//               </button>
//             </>
//           )}

//           <p className="text-center mt-6 text-sm text-gray-500">
//             Already have an account?{' '}
//             <Link href="/login" className="text-[#247BF7] font-medium hover:underline">
//               Sign in
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   )
// }