'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Search, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-[#247BF7]/5 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-50" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#247BF7]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], rotate: [45, 0, 45] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#1E40AF]/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-[#247BF7]/10 border border-[#247BF7]/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-[#247BF7] rounded-full animate-pulse" />
            <span className="text-sm text-[#247BF7] font-medium">
              UPI Program Now Available - Earn Transferable Credits
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            <span className="text-gray-900">Your Gateway to</span>
            <br />
            <span className="text-gradient">Global Education</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-gray-600 leading-relaxed"
          >
            Discover world-class institutions, secure scholarships, and transfer 
            credits seamlessly with our innovative UPI program. Scovers Education 
            helps Nigerian and African students achieve their international 
            education dreams.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="group">
              <Link href="/get-started" className="flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg">
              <Link href="/how-it-works" className="flex items-center">
                <Play className="mr-2 h-5 w-5" />
                How It Works
              </Link>
            </Button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex items-center bg-white rounded-2xl shadow-lg shadow-[#247BF7]/10 border border-gray-100 p-2">
              <Search className="ml-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for institutions, courses, or scholarships..."
                className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <Button>
                <GraduationCap className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center space-x-6 text-sm text-gray-500"
          >
            <span>✓ Trusted by 10,000+ students</span>
            <span>✓ 500+ partner institutions</span>
            <span>✓ 50+ countries</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}