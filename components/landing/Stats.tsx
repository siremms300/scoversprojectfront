'use client'

import { motion } from 'framer-motion'
import { Users, GraduationCap, Globe, Award } from 'lucide-react'

const stats = [
  { value: '10K+', label: 'Students Placed', icon: Users },
  { value: '500+', label: 'Partner Institutions', icon: GraduationCap },
  { value: '50+', label: 'Countries', icon: Globe },
  { value: '95%', label: 'Success Rate', icon: Award },
]

export function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#247BF7]/10 to-[#1E40AF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-[#247BF7]" />
              </div>
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}