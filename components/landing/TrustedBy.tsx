'use client'

import { motion } from 'framer-motion'

const institutions = [
  'University of Toronto',
  'Melbourne University',
  'University of Lagos',
  'Cape Town University',
  'Ghana University',
  'Harvard University',
]

export function TrustedBy() {
  return (
    <section className="py-16 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
          Partnering with top institutions worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {institutions.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-gray-300 font-semibold text-lg hover:text-gray-400 transition-colors cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}