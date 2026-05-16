'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Chioma Adebayo',
    role: 'UPI Graduate, now at University of Toronto',
    content: 'The UPI program was a game-changer. I earned credits from Nigeria and transferred seamlessly to Toronto. Saved me a full year of tuition.',
    avatar: 'CA',
    rating: 5,
  },
  {
    name: 'Emmanuel Osei',
    role: 'Full Scholarship Recipient',
    content: 'I found a scholarship I never knew existed through Scovers. Applied in minutes and got fully funded for my Masters in the UK.',
    avatar: 'EO',
    rating: 5,
  },
  {
    name: 'Fatima Ibrahim',
    role: 'Current Student, University of Cape Town',
    content: 'The platform made applying to multiple universities so easy. I compared programs side by side and made the best choice for my career.',
    avatar: 'FI',
    rating: 5,
  },
]

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)

  return (
    <section className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="badge-premium mb-4 inline-block">Testimonials</span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 tracking-tight">
          Loved by <span className="text-gradient">students</span>
        </h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="card-premium p-10 md:p-14"
            >
              <Quote className="w-10 h-10 text-gray-200 mx-auto mb-6" />
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                "{testimonials[current].content}"
              </p>
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-lg">
                  {testimonials[current].avatar}
                </span>
              </div>
              <p className="font-semibold text-gray-900">{testimonials[current].name}</p>
              <p className="text-sm text-gray-500">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-blue-500 w-6' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}