'use client'

import Link from 'next/link'
import { GraduationCap, Mail, MapPin, ArrowRight } from 'lucide-react'

const footerLinks = {
  platform: {
    title: 'Platform',
    links: [
      { name: 'Institutions', href: '/institutions' },
      { name: 'Courses', href: '/courses' },
      { name: 'UPI Program', href: '/upi-program' },
      { name: 'Scholarships', href: '/scholarships' },
      { name: 'Blog', href: '/blog' },
    ]
  },
  students: {
    title: 'For Students',
    links: [
      { name: 'Create Account', href: '/register' },
      { name: 'Track Applications', href: '/dashboard' },
      { name: 'Scholarship Search', href: '/scholarships' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'FAQ', href: '/faq' },
    ]
  },
  partners: {
    title: 'For Partners',
    links: [
      { name: 'University Portal', href: '/university' },
      { name: 'Investor Portal', href: '/investor' },
      { name: 'Partner With Us', href: '/partner' },
      { name: 'Agent Program', href: '/agent-program' },
      { name: 'Contact', href: '/contact' },
    ]
  }
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#247BF7] to-[#1E40AF] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Scovers</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your gateway to global education. Find institutions, secure scholarships, 
              and earn transferable credits.
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:support@scovers.org" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                support@scovers.org
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-1.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-white font-semibold text-sm mb-2">Stay updated</h3>
            <p className="text-sm text-gray-400 mb-3">Get scholarship alerts and study abroad tips.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#247BF7]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Scovers Education. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-gray-300 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}