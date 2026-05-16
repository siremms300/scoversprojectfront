'use client'

import { motion } from 'framer-motion'
import { Search, FileText, Users, CreditCard, MessageSquare, TrendingUp } from 'lucide-react'

const features = [
  {
    title: 'Smart Institution Search',
    description: 'Find the perfect institution with advanced filters by country, course, ranking, and tuition range.',
    icon: Search,
  },
  {
    title: 'Application Tracking',
    description: 'Track your applications in real-time with status updates, document management, and notifications.',
    icon: FileText,
  },
  {
    title: 'Scholarship Hub',
    description: 'Access hundreds of scholarship opportunities matched to your profile and academic background.',
    icon: Users,
  },
  {
    title: 'UPI Credit Transfer',
    description: 'Earn university credits that seamlessly transfer to partner institutions worldwide.',
    icon: CreditCard,
  },
  {
    title: 'Expert Guidance',
    description: 'Get personalized advice from education consultants and connect with current students.',
    icon: MessageSquare,
  },
  {
    title: 'Analytics Dashboard',
    description: 'Monitor application trends, conversion rates, and source tracking for data-driven decisions.',
    icon: TrendingUp,
  },
]

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for{' '}
            <span className="text-gradient">International Education</span>
          </h2>
          <p className="text-lg text-gray-600">
            From finding institutions to tracking applications, Scovers provides a complete 
            platform for your study abroad journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-[#247BF7]/5 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#247BF7]/10 to-[#1E40AF]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-[#247BF7]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}