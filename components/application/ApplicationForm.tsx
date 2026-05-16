'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, Book, FileText, Target, CheckCircle,
  ChevronRight, ChevronLeft, Upload
} from 'lucide-react';
import { ClassificationQuestions } from './ClassificationQuestions';
import { DocumentUpload } from './DocumentUpload';

const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  
  // Academic Background
  highestDegree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  graduationYear: z.number().min(2000).max(2030),
  gpa: z.number().min(0).max(4.0),
  
  // Target Program
  programType: z.enum(['UPI', 'direct', 'scholarship']),
  targetInstitution: z.string().optional(),
  targetCourse: z.string().optional(),
  
  // Source Tracking
  source: z.enum(['ads', 'agent', 'referral', 'organic', 'social_media']),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Academic Background', icon: Book },
  { id: 3, title: 'Program Selection', icon: Target },
  { id: 4, title: 'Classification', icon: FileText },
  { id: 5, title: 'Documents', icon: Upload },
  { id: 6, title: 'Review', icon: CheckCircle },
];

export const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({});
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange'
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                    backgroundColor: currentStep >= step.id ? '#1E3A8A' : '#E5E7EB'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep >= step.id ? 'text-white' : 'text-gray-400'}`}
                >
                  <step.icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs mt-2 ${
                  currentStep >= step.id ? 'text-[#1E3A8A] font-medium' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-[#1E3A8A]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="glass-effect rounded-2xl p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" className="space-y-6">
                <h2 className="text-2xl font-bold gradient-text">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      {...register('firstName')}
                      className="input-field"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      {...register('lastName')}
                      className="input-field"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-field"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      className="input-field"
                      placeholder="+234..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4">
                <ClassificationQuestions control={control} errors={errors} />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="step5">
                <DocumentUpload />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn-outline flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary flex items-center gap-2 ml-auto"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" className="btn-primary ml-auto">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};