'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Star, Shield, Zap } from 'lucide-react'

export function PremiumHero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#FAFBFC]">
      {/* Subtle gradient orbs - hidden on mobile */}
      <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-full blur-3xl opacity-60" />
      <div className="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-violet-50 to-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:64px_64px]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm mb-6 md:mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" />
            <span className="text-xs md:text-sm font-medium text-gray-600">
              Trusted by 10,000+ students worldwide
            </span>
            <span className="hidden sm:flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-4 md:mb-6 px-2"
          >
            Your education,
            <br />
            <span className="text-gradient">without borders</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4"
          >
            Discover world-class institutions, earn transferable credits, and access 
            life-changing scholarships. All from one beautiful platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16 px-4"
          >
            <Link href="/register" className="btn-primary inline-flex items-center justify-center gap-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto">
              Start your journey
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            <Link href="/upi-program" className="btn-secondary inline-flex items-center justify-center gap-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto">
              Enroll in UPI Program
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-gray-400 px-4"
          >
            <div className="flex items-center gap-1.5 md:gap-2">
              <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Secure & Trusted
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Fast Applications
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4" />
              4.9/5 Rating
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}