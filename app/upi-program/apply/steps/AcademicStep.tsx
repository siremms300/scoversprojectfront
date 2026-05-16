'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, ArrowRight, ArrowLeft, GraduationCap, Building2 } from 'lucide-react'

const academicSchema = z.object({
  education: z.array(z.object({
    institution: z.string().min(2, 'Institution name required'),
    degree: z.string().min(1, 'Degree required'),
    fieldOfStudy: z.string().min(2, 'Field of study required'),
    startDate: z.string().min(1, 'Start date required'),
    endDate: z.string().optional(),
    graduationYear: z.string().optional(),
    gpa: z.string().optional(),
    gradingScale: z.string().optional(),
  })).min(1, 'At least one education entry required'),
})

type FormData = z.infer<typeof academicSchema>

const degreeOptions = [
  'High School Diploma',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Professional Certificate',
  'Other',
]

interface Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function AcademicStep({ data, onUpdate, onNext, onBack }: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      education: data?.length ? data : [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', graduationYear: '', gpa: '', gradingScale: '4.0' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  })

  const onSubmit = (formData: FormData) => {
    onUpdate(formData.education)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="card-premium p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#247BF7]" />
              Education {index + 1}
            </h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register(`education.${index}.institution`)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
                  placeholder="University of Lagos"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <select
                {...register(`education.${index}.degree`)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
              >
                <option value="">Select degree</option>
                {degreeOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study *</label>
              <input
                {...register(`education.${index}.fieldOfStudy`)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                {...register(`education.${index}.startDate`)}
                type="date"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date (or expected)</label>
              <input
                {...register(`education.${index}.endDate`)}
                type="date"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
              <input
                {...register(`education.${index}.gpa`)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#247BF7] focus:ring-2 focus:ring-[#247BF7]/10 transition-all"
                placeholder="3.5"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', graduationYear: '', gpa: '', gradingScale: '4.0' })}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-500 hover:border-[#247BF7] hover:text-[#247BF7] transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Another Education
      </button>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="submit"
          className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}