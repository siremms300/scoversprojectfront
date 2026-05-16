'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Chidi Okafor',
    role: 'UPI Program Graduate',
    content: 'The UPI program changed my life. I earned credits that transferred to the University of Toronto, saving me a year of tuition. The support team was incredible throughout the process.',
    rating: 5,
    avatar: '/testimonials/chidi.jpg',
  },
  {
    name: 'Amina Ibrahim',
    role: 'Scholarship Recipient',
    content: 'I found a full scholarship through Scovers that I never knew existed. The application process was smooth, and I got accepted to study in the UK. Thank you Scovers!',
    rating: 5,
    avatar: '/testimonials/amina.jpg',
  },
  {
    name: 'David Mensah',
    role: 'Masters Student',
    content: 'The institution directory helped me compare universities easily. I applied to 3 schools through the platform and got accepted to all of them. Highly recommended!',
    rating: 5,
    avatar: '/testimonials/david.jpg',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our{' '}
            <span className="text-gradient">Students Say</span>
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of students who have successfully achieved their 
            international education dreams with Scovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-[#247BF7]/20 mb-4" />
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}