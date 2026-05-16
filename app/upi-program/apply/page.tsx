'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, ArrowRight, CheckCircle2, User, BookOpen,
  Target, FileText, Upload, CreditCard, ChevronRight,
  GraduationCap, Shield, Clock
} from 'lucide-react'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { AcademicStep } from './steps/AcademicStep'
import { ProgramStep } from './steps/ProgramStep'
import { ClassificationStep } from './steps/ClassificationStep'
import { DocumentsStep } from './steps/DocumentsStep'
import { ReviewStep } from './steps/ReviewStep'
import toast from 'react-hot-toast'

// Define types
interface PersonalInfo {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  nationality?: string
  currentCountry?: string
  state?: string
  city?: string
  address?: string
  gender?: string
}

interface AcademicEntry {
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string
  graduationYear?: string
  gpa?: string
  gradingScale?: string
}

interface ProgramSelection {
  programId?: string
  programName?: string
  programSlug?: string
}

interface ClassificationResponse {
  questionId: string
  question: string
  answer: string
  category: string
  weight: number
  score: number
}

interface UploadedDocument {
  type: string
  label: string
  file?: File
  name?: string
}

interface FormData {
  personalInfo: PersonalInfo
  academicBackground: AcademicEntry[]
  programSelection: ProgramSelection
  classificationResponses: ClassificationResponse[]
  documents: UploadedDocument[]
  source: string
}

const steps = [
  { id: 1, title: 'Personal', subtitle: 'Your information', icon: User },
  { id: 2, title: 'Academic', subtitle: 'Education history', icon: BookOpen },
  { id: 3, title: 'Program', subtitle: 'Choose program', icon: Target },
  { id: 4, title: 'Assessment', subtitle: 'Classification', icon: FileText },
  { id: 5, title: 'Documents', subtitle: 'Upload files', icon: Upload },
  { id: 6, title: 'Review', subtitle: 'Submit', icon: CheckCircle2 },
]

export default function UPIApplyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Try to restore saved form data
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pendingApplication')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          // ignore
        }
      }
    }
    return {
      personalInfo: {},
      academicBackground: [],
      programSelection: {},
      classificationResponses: [],
      documents: [],
      source: 'organic',
    }
  })

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => {
      const updated = { ...prev, [step]: data }
      // Save to localStorage as backup
      localStorage.setItem('pendingApplication', JSON.stringify(updated))
      return updated
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      toast.error('Please sign in to submit your application')
      localStorage.setItem('pendingApplication', JSON.stringify(formData))
      setTimeout(() => {
        router.push('/login?redirect=/upi-program/apply')
      }, 1500)
      return
    }

    try {
      setIsSubmitting(true)
      
      const applicationData = {
        programType: 'UPI',
        source: formData.source || 'organic',
        personalInfo: formData.personalInfo,
        academicBackground: formData.academicBackground,
        classificationResponses: formData.classificationResponses,
        targetCourse: formData.programSelection?.programId || undefined,
        status: 'submitted'
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit application')
      }
      
      const data = await response.json()
      
      if (formData.documents && formData.documents.length > 0) {
        for (const doc of formData.documents) {
          if (doc.file) {
            const formDataUpload = new FormData()
            formDataUpload.append('document', doc.file)
            formDataUpload.append('documentType', doc.type)
            
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${data.data._id}/documents`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formDataUpload,
            })
          }
        }
      }

      localStorage.removeItem('pendingApplication')
      toast.success('Application submitted successfully!')
      router.push(`/dashboard/applications/${data.data._id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData('personalInfo', data)}
            onNext={handleNext}
          />
        )
      case 2:
        return (
          <AcademicStep
            data={formData.academicBackground}
            onUpdate={(data) => updateFormData('academicBackground', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <ProgramStep
            data={formData.programSelection}
            onUpdate={(data) => updateFormData('programSelection', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <ClassificationStep
            data={formData.classificationResponses}
            onUpdate={(data) => updateFormData('classificationResponses', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 5:
        return (
          <DocumentsStep
            data={formData.documents}
            onUpdate={(data) => updateFormData('documents', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 6:
        return (
          <ReviewStep
            data={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* <Link 
              href="/upi-program" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to UPI Program
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              Secure Application
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                    ${currentStep > step.id 
                      ? 'bg-emerald-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-300 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {steps[currentStep - 1].title}
          </h1>
          <p className="text-gray-500 mt-1">{steps[currentStep - 1].subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}








































// 'use client'

// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { 
//   ArrowLeft, ArrowRight, CheckCircle2, User, BookOpen,
//   Target, FileText, Upload, CreditCard, ChevronRight,
//   GraduationCap, Shield, Clock
// } from 'lucide-react'
// import { PersonalInfoStep } from './steps/PersonalInfoStep'
// import { AcademicStep } from './steps/AcademicStep'
// import { ProgramStep } from './steps/ProgramStep'
// import { ClassificationStep } from './steps/ClassificationStep'
// import {DocumentsStep} from './steps/DocumentsStep'
// import { ReviewStep } from './steps/ReviewStep'
// import toast from 'react-hot-toast'

// const steps = [
//   { id: 1, title: 'Personal', subtitle: 'Your information', icon: User },
//   { id: 2, title: 'Academic', subtitle: 'Education history', icon: BookOpen },
//   { id: 3, title: 'Program', subtitle: 'Choose program', icon: Target },
//   { id: 4, title: 'Assessment', subtitle: 'Classification', icon: FileText },
//   { id: 5, title: 'Documents', subtitle: 'Upload files', icon: Upload },
//   { id: 6, title: 'Review', subtitle: 'Submit', icon: CheckCircle2 },
// ]

// export default function UPIApplyPage() {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formData, setFormData] = useState({
//     personalInfo: {},
//     academicBackground: [],
//     programSelection: {},
//     classificationResponses: [],
//     documents: [],
//     source: 'organic',
//   })
//   const router = useRouter()

//   const updateFormData = (step: string, data: any) => {
//     setFormData(prev => ({ ...prev, [step]: data }))
//   }

//   const handleNext = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(prev => prev + 1)
//       window.scrollTo({ top: 0, behavior: 'smooth' })
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(prev => prev - 1)
//       window.scrollTo({ top: 0, behavior: 'smooth' })
//     }
//   }

//   // const handleSubmit = async () => {
//   //   try {
//   //     setIsSubmitting(true)
//   //     const token = localStorage.getItem('token')
      
//   //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify({
//   //         ...formData,
//   //         programType: 'UPI',
//   //       }),
//   //     })

//   //     if (!response.ok) {
//   //       throw new Error('Failed to submit application')
//   //     }

//   //     const data = await response.json()
      
//   //     // Upload documents if any
//   //     if (formData.documents.length > 0) {
//   //       for (const doc of formData.documents) {
//   //         if (doc.file) {
//   //           const formDataUpload = new FormData()
//   //           formDataUpload.append('document', doc.file)
//   //           formDataUpload.append('documentType', doc.type)
            
//   //           await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${data.data._id}/documents`, {
//   //             method: 'POST',
//   //             headers: {
//   //               Authorization: `Bearer ${token}`,
//   //             },
//   //             body: formDataUpload,
//   //           })
//   //         }
//   //       }
//   //     }

//   //     toast.success('Application submitted successfully!')
//   //     router.push(`/dashboard/applications/${data.data._id}`)
//   //   } catch (error: any) {
//   //     toast.error(error.message || 'Failed to submit application')
//   //   } finally {
//   //     setIsSubmitting(false)
//   //   }
//   // }

//   const handleSubmit = async () => {
//     // Check if user is authenticated
//     const token = localStorage.getItem('token')
    
//     if (!token) {
//       toast.error('Please sign in to submit your application')
//       // Save current form data to localStorage before redirecting
//       localStorage.setItem('pendingApplication', JSON.stringify(formData))
//       // Redirect to login with return URL
//       setTimeout(() => {
//         router.push('/login?redirect=/upi-program/apply')
//       }, 1500)
//       return
//     }

//     try {
//       setIsSubmitting(true)
      
//       // Step 1: Create the application
//       const applicationData = {
//         programType: 'UPI',
//         source: formData.source || 'organic',
//         personalInfo: formData.personalInfo,
//         academicBackground: formData.academicBackground,
//         classificationResponses: formData.classificationResponses,
//         targetCourse: formData.programSelection?.programId,
//         status: 'submitted'
//       }

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(applicationData),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || 'Failed to submit application')
//       }
      
//       const data = await response.json()
      
//       // Step 2: Upload documents if any
//       if (formData.documents && formData.documents.length > 0) {
//         for (const doc of formData.documents) {
//           if (doc.file) {
//             const formDataUpload = new FormData()
//             formDataUpload.append('document', doc.file)
//             formDataUpload.append('documentType', doc.type)
            
//             await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${data.data._id}/documents`, {
//               method: 'POST',
//               headers: { Authorization: `Bearer ${token}` },
//               body: formDataUpload,
//             })
//           }
//         }
//       }

//       // Clear pending application
//       localStorage.removeItem('pendingApplication')
      
//       toast.success('Application submitted successfully!')
//       router.push(`/dashboard/applications/${data.data._id}`)
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to submit application')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <PersonalInfoStep
//             data={formData.personalInfo}
//             onUpdate={(data) => updateFormData('personalInfo', data)}
//             onNext={handleNext}
//           />
//         )
//       case 2:
//         return (
//           <AcademicStep
//             data={formData.academicBackground}
//             onUpdate={(data) => updateFormData('academicBackground', data)}
//             onNext={handleNext}
//             onBack={handleBack}
//           />
//         )
//       case 3:
//         return (
//           <ProgramStep
//             data={formData.programSelection}
//             onUpdate={(data) => updateFormData('programSelection', data)}
//             onNext={handleNext}
//             onBack={handleBack}
//           />
//         )
//       case 4:
//         return (
//           <ClassificationStep
//             data={formData.classificationResponses}
//             onUpdate={(data) => updateFormData('classificationResponses', data)}
//             onNext={handleNext}
//             onBack={handleBack}
//           />
//         )
//       case 5:
//         return (
//           <DocumentsStep
//             data={formData.documents}
//             onUpdate={(data) => updateFormData('documents', data)}
//             onNext={handleNext}
//             onBack={handleBack}
//           />
//         )
//       case 6:
//         return (
//           <ReviewStep
//             data={formData}
//             onSubmit={handleSubmit}
//             onBack={handleBack}
//             isSubmitting={isSubmitting}
//           />
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#FAFBFC]">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* <Link 
//               href="/upi-program" 
//               className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to UPI Program
//             </Link> */}
//             {/* <div className="flex items-center gap-2 text-sm text-gray-400">
//               <Shield className="w-4 h-4" />
//               Secure Application
//             </div> */}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//         {/* Progress Steps */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between">
//             {steps.map((step, index) => (
//               <div key={step.id} className="flex items-center flex-1">
//                 <div className="flex flex-col items-center">
//                   <div className={`
//                     w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
//                     ${currentStep > step.id 
//                       ? 'bg-emerald-500 text-white' 
//                       : currentStep === step.id 
//                         ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
//                         : 'bg-gray-100 text-gray-400'
//                     }
//                   `}>
//                     {currentStep > step.id ? (
//                       <CheckCircle2 className="w-5 h-5" />
//                     ) : (
//                       <step.icon className="w-5 h-5" />
//                     )}
//                   </div>
//                   <span className={`text-xs mt-2 font-medium hidden sm:block ${
//                     currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
//                   }`}>
//                     {step.title}
//                   </span>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-300 ${
//                     currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Form Title */}
//         <div className="mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             {steps[currentStep - 1].title}
//           </h1>
//           <p className="text-gray-500 mt-1">{steps[currentStep - 1].subtitle}</p>
//         </div>

//         {/* Step Content */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentStep}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.2 }}
//           >
//             {renderStep()}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }