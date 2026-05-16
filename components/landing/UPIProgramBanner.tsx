'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CreditCard, ArrowRight, CheckCircle, Globe, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function UPIProgramBanner() {
  return (
    <section className="py-24 bg-gradient-to-r from-[#247BF7] to-[#1E40AF] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-white" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">Featured Program</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              UPI Program - Earn Transferable Credits
            </h2>

            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Take university courses and earn credits that transfer to credible 
              institutions worldwide. Start your international education journey 
              with confidence.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Earn credits from accredited institutions',
                'Seamless transfer to partner universities',
                'Flexible online and in-person options',
                'Affordable tuition with scholarship opportunities',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/upi-program">
                <Button
                  size="lg"
                  className="bg-white text-[#247BF7] hover:bg-gray-100 hover:shadow-xl"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/upi-program/apply">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Apply Now
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Globe, label: '50+', sublabel: 'Partner Countries' },
              { icon: CreditCard, label: '100%', sublabel: 'Credit Transfer' },
              { icon: Clock, label: '24/7', sublabel: 'Support Available' },
              { icon: CheckCircle, label: '95%', sublabel: 'Success Rate' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-white/80">{stat.sublabel}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}