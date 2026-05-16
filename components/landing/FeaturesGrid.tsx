'use client'

import { motion } from 'framer-motion'
import { 
  Search, FileText, CreditCard, Shield, 
  Globe, TrendingUp 
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'AI-powered search to find the perfect institution and program for your goals.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: FileText,
    title: 'Seamless Applications',
    description: 'Apply to multiple institutions with one profile. Track everything in real-time.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: CreditCard,
    title: 'UPI Credit Transfer',
    description: 'Earn credits that seamlessly transfer to partner universities worldwide.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    icon: Shield,
    title: 'Verified Institutions',
    description: 'Every institution is vetted and accredited. Your education is in safe hands.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Globe,
    title: '50+ Countries',
    description: 'Access opportunities across North America, Europe, Asia, Africa, and beyond.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'Scholarship Matching',
    description: 'Get matched with scholarships based on your profile and academic background.',
    color: 'from-amber-500 to-amber-600',
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
          <span className="badge-premium mb-3 md:mb-4 inline-block text-xs md:text-sm">Why Scovers</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
            Everything you need,
            <br className="hidden sm:block" />
            <span className="text-gradient">all in one place</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 px-4">
            From finding the right institution to tracking your application, 
            we've built the complete platform for international education.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="card-premium p-5 md:p-8 group"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${feature.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}