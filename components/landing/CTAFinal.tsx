'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTAFinal() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Free to get started</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Your future starts
            <br />
            <span className="text-gradient">right now</span>
          </h2>

          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Join thousands of students who have found their path to international 
            education through Scovers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl inline-flex items-center gap-2 hover:bg-gray-100 transition-all"
            >
              Create your free account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 inline-flex items-center gap-2 hover:bg-white/5 transition-all"
            >
              Talk to us
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            No credit card required • 2-minute setup
          </p>
        </motion.div>
      </div>
    </section>
  )
}