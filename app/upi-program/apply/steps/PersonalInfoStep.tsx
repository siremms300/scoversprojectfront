'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MapPin, Flag, Calendar, ArrowRight } from 'lucide-react'
import { COUNTRIES } from '@/lib/constants'

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone number required'),
  dateOfBirth: z.string().min(1, 'Date of birth required'),
  nationality: z.string().min(1, 'Nationality required'),
  currentCountry: z.string().min(1, 'Current country required'),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
})

type FormData = z.infer<typeof personalInfoSchema>

interface Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function PersonalInfoStep({ data, onUpdate, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  })

  const onSubmit = (formData: FormData) => {
    onUpdate(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card-premium p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('firstName')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
                placeholder="John"
              />
            </div>
            {errors.firstName && <p className="text-sm text-red-500 mt-1.5">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('lastName')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
                placeholder="Doe"
              />
            </div>
            {errors.lastName && <p className="text-sm text-red-500 mt-1.5">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('phone')}
                type="tel"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
                placeholder="+234 800 000 0000"
              />
            </div>
            {errors.phone && <p className="text-sm text-red-500 mt-1.5">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('dateOfBirth')}
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
              />
            </div>
            {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1.5">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
            <div className="relative">
              <Flag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                {...register('nationality')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
              >
                <option value="">Select nationality</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {errors.nationality && <p className="text-sm text-red-500 mt-1.5">{errors.nationality.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Country *</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                {...register('currentCountry')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
              >
                <option value="">Select country</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {errors.currentCountry && <p className="text-sm text-red-500 mt-1.5">{errors.currentCountry.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('state')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
                placeholder="Lagos"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('city')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400"
                placeholder="Ikeja"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            {...register('address')}
            rows={2}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all placeholder:text-gray-400 resize-none"
            placeholder="Enter your full address"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-gray-900 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}