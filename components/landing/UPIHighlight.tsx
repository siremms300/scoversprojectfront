'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react'

export function UPIHighlight() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="order-2 lg:order-1"
          >
            <span className="badge-premium mb-4 md:mb-6 inline-flex items-center gap-2 text-xs md:text-sm">
              <CreditCard className="w-3 h-3 md:w-3.5 md:h-3.5" />
              Featured Program
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
              Earn credits.
              <br />
              <span className="text-gradient">Transfer anywhere.</span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-500 mb-6 md:mb-8 leading-relaxed">
              The UPI Program lets you earn university credits that transfer to 500+ 
              partner institutions. Start your degree from anywhere.
            </p>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                'Transfer credits to top universities',
                'Study online at your own pace',
                'Affordable tuition with scholarships',
                'Full academic support throughout',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/upi-program" className="btn-primary inline-flex items-center gap-2 text-sm md:text-base px-6 py-3 w-full sm:w-auto justify-center">
              Explore UPI Program
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 shadow-2xl max-w-sm mx-auto lg:max-w-none">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-400" />
              </div>
              
              <div className="space-y-4 md:space-y-6">
                {[
                  { label: 'Program', value: 'UPI Business Administration' },
                  { label: 'Credits', value: '60 Credits' },
                  { label: 'Duration', value: '12 Months' },
                  { label: 'Transfer To', value: '500+ Institutions' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-white">
                    <span className="text-xs md:text-sm opacity-60">{item.label}</span>
                    <span className="font-semibold text-sm md:text-base">{item.value}</span>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-xs md:text-sm">Progress</span>
                    <span className="text-xs md:text-sm font-semibold">75%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating card - hidden on small screens */}
            <div className="hidden md:block absolute -bottom-6 -right-6 card-premium p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Credits Verified</p>
                  <p className="text-xs text-gray-500">Ready for transfer</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}