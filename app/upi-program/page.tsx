'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { 
  GraduationCap, CreditCard, Globe, Clock, CheckCircle2,
  ArrowRight, BookOpen, Users, Star, Shield, Trophy,
  ChevronRight, Play, Sparkles, Zap, Building2,
  BarChart3, MessageSquare, FileText, Award
} from 'lucide-react'

export default function UPIProgramPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/upi`)
      const data = await response.json()
      setPrograms(data.data || [])
    } catch (error) {
      console.error('Failed to fetch programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    { icon: CreditCard, title: 'Transferable Credits', desc: 'Earn credits that transfer to 500+ partner institutions across 50 countries' },
    { icon: Clock, title: 'Flexible Schedule', desc: 'Study at your own pace with full-time and part-time options available' },
    { icon: Shield, title: 'Fully Accredited', desc: 'All programs meet international academic standards and are quality assured' },
    { icon: Globe, title: 'Global Recognition', desc: 'Credits recognized by universities in North America, Europe, Asia, and Africa' },
  ]

  const howItWorks = [
    { step: '01', title: 'Choose Program', desc: 'Browse our curated selection of university pathway programs', color: 'from-blue-500 to-blue-600' },
    { step: '02', title: 'Apply Online', desc: 'Submit your application with required documents in minutes', color: 'from-indigo-500 to-indigo-600' },
    { step: '03', title: 'Start Learning', desc: 'Get instant access to course materials and begin your studies', color: 'from-violet-500 to-violet-600' },
    { step: '04', title: 'Earn Credits', desc: 'Complete modules and earn credits that transfer seamlessly', color: 'from-purple-500 to-purple-600' },
    { step: '05', title: 'Transfer', desc: 'Move your credits to a partner university and continue your degree', color: 'from-fuchsia-500 to-fuchsia-600' },
  ]

  const features = [
    { icon: BookOpen, title: 'Comprehensive Curriculum', desc: 'Industry-aligned courses designed by academic experts' },
    { icon: Users, title: 'Dedicated Support', desc: 'Personal academic advisor throughout your journey' },
    { icon: MessageSquare, title: 'Live Sessions', desc: 'Interactive online classes with experienced instructors' },
    { icon: FileText, title: 'Easy Assessment', desc: 'Regular assessments to track your progress' },
    { icon: Award, title: 'Certification', desc: 'Receive certificates for completed modules' },
    { icon: BarChart3, title: 'Progress Tracking', desc: 'Real-time dashboard to monitor your advancement' },
  ]

  const stats = [
    { value: '10K+', label: 'Students Enrolled' },
    { value: '500+', label: 'Partner Universities' },
    { value: '95%', label: 'Transfer Success' },
    { value: '4.9/5', label: 'Student Rating' },
  ]

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300 font-medium">Featured Program</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6"
              >
                University Pathway
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  International
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg"
              >
                Earn university credits from anywhere and transfer them to top institutions worldwide. 
                Start your degree journey with confidence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/upi-program/apply"
                  className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2 group"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-all inline-flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  How It Works
                </Link>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Program', value: 'Business Administration' },
                    { label: 'Credits', value: '60 Credits' },
                    { label: 'Duration', value: '12 Months' },
                    { label: 'Mode', value: 'Online' },
                    { label: 'Transfer To', value: '500+ Universities' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-white">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className="font-semibold text-sm">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-400 mb-2">Available Intakes</div>
                    <div className="flex gap-2">
                      {['Jan 2026', 'May 2026', 'Sep 2026'].map((date) => (
                        <span key={date} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white">{date}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-sm">95% Success Rate</p>
                    <p className="text-xs text-white/80">Credit transfer approved</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-1 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVAILABLE PROGRAMS - MOVED UP */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge-premium mb-3 inline-block">Programs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available{' '}
              <span className="text-gradient">Programs</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Choose from our accredited programs and start earning transferable credits today
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program: any, index: number) => (
                <motion.div
                  key={program._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-premium p-6 h-full flex flex-col group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-[#247BF7]" />
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium capitalize">
                        {program.mode?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{program.name}</h3>
                    {program.institution && (
                      <p className="text-sm text-gray-500 mb-4">{program.institution.name}</p>
                    )}

                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        {program.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
                        {program.credits} Credits
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                        {program.transferableTo?.length || 0} Transfer Partners
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/upi-program/${program.slug}`}
                        className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Learn More
                      </Link>
                      <Link
                        href={`/upi-program/apply?program=${program._id}`}
                        className="flex-1 text-center py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No programs available yet</h3>
              <p className="text-gray-400">Check back soon for upcoming programs</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">Why UPI</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose the{' '}
              <span className="text-gradient">UPI Program</span>
            </h2>
            <p className="text-gray-500">
              Designed to give you the best pathway to international education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 text-center group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-[#247BF7]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500">Five simple steps to start your journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="card-premium p-6 text-center h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What our{' '}
              <span className="text-gradient">students say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Chioma A.', role: 'Transferred to University of Toronto', content: 'The UPI program gave me a head start. I completed my first year online and transferred seamlessly to Toronto.', rating: 5 },
              { name: 'Emmanuel K.', role: 'Now studying at Melbourne University', content: 'Saved money and time. The credits transferred without any issues. Best decision I made for my education.', rating: 5 },
              { name: 'Fatima B.', role: 'Accepted to University of Cape Town', content: 'The flexibility allowed me to work while studying. Support team was amazing throughout the process.', rating: 5 },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-premium mb-4 inline-block">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked{' '}
              <span className="text-gradient">questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'How do credits transfer?', a: 'Credits earned through UPI are recognized by our 500+ partner institutions. We handle the transfer process seamlessly.' },
              { q: 'What is the program duration?', a: 'Programs typically range from 6-18 months depending on credits and your pace of study.' },
              { q: 'Are the programs accredited?', a: 'Yes, all UPI programs are fully accredited and meet international academic standards.' },
              { q: 'Can I work while studying?', a: 'Absolutely! The flexible online format allows you to balance work and studies.' },
            ].map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium group"
              >
                <summary className="p-5 cursor-pointer list-none flex items-center justify-between font-medium text-gray-900">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-5 text-sm text-gray-500">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to start your{' '}
              <span className="text-gradient">journey</span>?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Join thousands of students who have accelerated their education through the UPI Program.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upi-program/apply"
                className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all inline-flex items-center gap-2 group"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-all inline-flex items-center gap-2"
              >
                Talk to an advisor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}





































// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, useScroll, useTransform } from 'framer-motion'
// import Link from 'next/link'
// import { 
//   GraduationCap, CreditCard, Globe, Clock, CheckCircle2,
//   ArrowRight, BookOpen, Users, Star, Shield, Trophy,
//   ChevronRight, Play, Download, Sparkles, Zap, Building2,
//   BarChart3, MessageSquare, FileText, Award
// } from 'lucide-react'

// export default function UPIProgramPage() {
//   const [programs, setPrograms] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('overview')

//   const { scrollY } = useScroll()
//   const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
//   const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

//   useEffect(() => {
//     fetchPrograms()
//   }, [])

//   const fetchPrograms = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upi`)
//       const data = await response.json()
//       setPrograms(data.data || [])
//     } catch (error) {
//       console.error('Failed to fetch programs:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const benefits = [
//     { icon: CreditCard, title: 'Transferable Credits', desc: 'Earn credits that transfer to 500+ partner institutions across 50 countries' },
//     { icon: Clock, title: 'Flexible Schedule', desc: 'Study at your own pace with full-time and part-time options available' },
//     { icon: Shield, title: 'Fully Accredited', desc: 'All programs meet international academic standards and are quality assured' },
//     { icon: Globe, title: 'Global Recognition', desc: 'Credits recognized by universities in North America, Europe, Asia, and Africa' },
//   ]

//   const howItWorks = [
//     { step: '01', title: 'Choose Program', desc: 'Browse our curated selection of university pathway programs', color: 'from-blue-500 to-blue-600' },
//     { step: '02', title: 'Apply Online', desc: 'Submit your application with required documents in minutes', color: 'from-indigo-500 to-indigo-600' },
//     { step: '03', title: 'Start Learning', desc: 'Get instant access to course materials and begin your studies', color: 'from-violet-500 to-violet-600' },
//     { step: '04', title: 'Earn Credits', desc: 'Complete modules and earn credits that transfer seamlessly', color: 'from-purple-500 to-purple-600' },
//     { step: '05', title: 'Transfer', desc: 'Move your credits to a partner university and continue your degree', color: 'from-fuchsia-500 to-fuchsia-600' },
//   ]

//   const features = [
//     { icon: BookOpen, title: 'Comprehensive Curriculum', desc: 'Industry-aligned courses designed by academic experts' },
//     { icon: Users, title: 'Dedicated Support', desc: 'Personal academic advisor throughout your journey' },
//     { icon: MessageSquare, title: 'Live Sessions', desc: 'Interactive online classes with experienced instructors' },
//     { icon: FileText, title: 'Easy Assessment', desc: 'Regular assessments to track your progress' },
//     { icon: Award, title: 'Certification', desc: 'Receive certificates for completed modules' },
//     { icon: BarChart3, title: 'Progress Tracking', desc: 'Real-time dashboard to monitor your advancement' },
//   ]

//   const stats = [
//     { value: '10K+', label: 'Students Enrolled' },
//     { value: '500+', label: 'Partner Universities' },
//     { value: '95%', label: 'Transfer Success' },
//     { value: '4.9/5', label: 'Student Rating' },
//   ]

//   return (
//     <div className="min-h-screen bg-[#FAFBFC]">
//       {/* Hero Section */}
//       <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
//         <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
//         <motion.div 
//           style={{ opacity: heroOpacity, scale: heroScale }}
//           className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//             <div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6"
//               >
//                 <Sparkles className="w-4 h-4 text-blue-400" />
//                 <span className="text-sm text-gray-300 font-medium">Featured Program</span>
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6"
//               >
//                 University Pathway
//                 <br />
//                 <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
//                   International
//                 </span>
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg"
//               >
//                 Earn university credits from anywhere and transfer them to top institutions worldwide. 
//                 Start your degree journey with confidence.
//               </motion.p>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="flex flex-col sm:flex-row gap-4"
//               >
//                 <Link
//                   href="/upi-program/apply"
//                   className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2 group"
//                 >
//                   Apply Now
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//                 <Link
//                   href="#how-it-works"
//                   className="border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-all inline-flex items-center justify-center gap-2"
//                 >
//                   <Play className="w-5 h-5" />
//                   How It Works
//                 </Link>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="flex items-center gap-6 mt-8 text-sm text-gray-500"
//               >
//                 <div className="flex items-center gap-2">
//                   <Shield className="w-4 h-4" />
//                   Accredited
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Zap className="w-4 h-4" />
//                   Fast Track
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                   4.9/5 Rating
//                 </div>
//               </motion.div>
//             </div>

//             {/* Hero Visual */}
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="relative"
//             >
//               <div className="relative rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 shadow-2xl">
//                 <div className="flex items-center gap-2 mb-6">
//                   <div className="w-3 h-3 rounded-full bg-red-400" />
//                   <div className="w-3 h-3 rounded-full bg-amber-400" />
//                   <div className="w-3 h-3 rounded-full bg-emerald-400" />
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between text-white">
//                     <span className="text-sm text-gray-400">Program</span>
//                     <span className="font-semibold text-sm">Business Administration</span>
//                   </div>
//                   <div className="flex items-center justify-between text-white">
//                     <span className="text-sm text-gray-400">Credits</span>
//                     <span className="font-semibold text-sm">60 Credits</span>
//                   </div>
//                   <div className="flex items-center justify-between text-white">
//                     <span className="text-sm text-gray-400">Duration</span>
//                     <span className="font-semibold text-sm">12 Months</span>
//                   </div>
//                   <div className="flex items-center justify-between text-white">
//                     <span className="text-sm text-gray-400">Mode</span>
//                     <span className="font-semibold text-sm">Online</span>
//                   </div>
//                   <div className="flex items-center justify-between text-white">
//                     <span className="text-sm text-gray-400">Transfer To</span>
//                     <span className="font-semibold text-sm">500+ Universities</span>
//                   </div>

//                   <div className="pt-4 border-t border-white/10">
//                     <div className="text-sm text-gray-400 mb-2">Available Intakes</div>
//                     <div className="flex gap-2">
//                       {['Jan 2025', 'May 2025', 'Sep 2025'].map((date) => (
//                         <span key={date} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white">
//                           {date}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Floating cards */}
//               <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white rounded-2xl p-4 shadow-xl">
//                 <div className="flex items-center gap-3">
//                   <CheckCircle2 className="w-5 h-5" />
//                   <div>
//                     <p className="font-semibold text-sm">95% Success Rate</p>
//                     <p className="text-xs text-white/80">Credit transfer approved</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-3 shadow-xl">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <Trophy className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-xs text-gray-900">Top Rated</p>
//                     <div className="flex items-center gap-0.5">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </section>

//       {/* Stats Bar */}
//       <section className="relative -mt-1 bg-white border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {stats.map((stat) => (
//               <div key={stat.label} className="text-center">
//                 <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
//                 <div className="text-sm text-gray-500">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Benefits */}
//       <section className="py-20 md:py-28 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-2xl mx-auto mb-16">
//             <span className="badge-premium mb-4 inline-block">Why UPI</span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Why choose the{' '}
//               <span className="text-gradient">UPI Program</span>
//             </h2>
//             <p className="text-gray-500">
//               Designed to give you the best pathway to international education
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {benefits.map((benefit, index) => (
//               <motion.div
//                 key={benefit.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="card-premium p-6 text-center group"
//               >
//                 <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
//                   <benefit.icon className="w-7 h-7 text-[#247BF7]" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
//                 <p className="text-sm text-gray-500 leading-relaxed">{benefit.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="py-20 md:py-28 bg-[#FAFBFC]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-2xl mx-auto mb-16">
//             <span className="badge-premium mb-4 inline-block">Process</span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
//             <p className="text-gray-500">Five simple steps to start your journey</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
//             {howItWorks.map((step, index) => (
//               <motion.div
//                 key={step.step}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="relative"
//               >
//                 <div className="card-premium p-6 text-center h-full">
//                   <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
//                     <span className="text-xl font-bold text-white">{step.step}</span>
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
//                   <p className="text-sm text-gray-500">{step.desc}</p>
//                 </div>
//                 {index < howItWorks.length - 1 && (
//                   <div className="hidden lg:block absolute top-1/2 -right-3 w-6">
//                     <ChevronRight className="w-6 h-6 text-gray-300" />
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-20 md:py-28 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-2xl mx-auto mb-16">
//             <span className="badge-premium mb-4 inline-block">Features</span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Everything you need to{' '}
//               <span className="text-gradient">succeed</span>
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.05 }}
//                 className="card-premium p-6 flex gap-4 group"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
//                   <feature.icon className="w-6 h-6 text-[#247BF7]" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
//                   <p className="text-sm text-gray-500">{feature.desc}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Available Programs */}
//       <section className="py-20 md:py-28 bg-[#FAFBFC]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-12">
//             <div>
//               <span className="badge-premium mb-3 inline-block">Programs</span>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//                 Available{' '}
//                 <span className="text-gradient">Programs</span>
//               </h2>
//             </div>
//             <Link
//               href="/upi-program/all"
//               className="hidden md:inline-flex items-center gap-2 text-[#247BF7] font-medium hover:underline"
//             >
//               View all programs
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl" />
//               ))}
//             </div>
//           ) : programs.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {programs.map((program: any, index: number) => (
//                 <motion.div
//                   key={program._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <div className="card-premium p-6 h-full flex flex-col group">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
//                         <GraduationCap className="w-6 h-6 text-[#247BF7]" />
//                       </div>
//                       <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
//                         {program.mode}
//                       </span>
//                     </div>

//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>
//                     {program.institution && (
//                       <p className="text-sm text-gray-500 mb-4">{program.institution.name}</p>
//                     )}

//                     <div className="space-y-2 mb-6 flex-1">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
//                         {program.duration}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-600">
//                         <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
//                         {program.credits} Credits
//                       </div>
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
//                         {program.transferableTo?.length || 0} Transfer Partners
//                       </div>
//                     </div>

//                     <Link
//                       href={`/upi-program/${program.slug}`}
//                       className="w-full bg-gray-900 text-white text-center py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2"
//                     >
//                       Learn More
//                       <ArrowRight className="w-4 h-4" />
//                     </Link>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-600 mb-2">No programs available yet</h3>
//               <p className="text-gray-400">Check back soon for upcoming programs</p>
//             </div>
//           )}

//           <div className="mt-8 text-center md:hidden">
//             <Link
//               href="/upi-program/all"
//               className="inline-flex items-center gap-2 text-[#247BF7] font-medium"
//             >
//               View all programs
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-20 md:py-28 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-2xl mx-auto mb-16">
//             <span className="badge-premium mb-4 inline-block">Testimonials</span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               What our{' '}
//               <span className="text-gradient">students say</span>
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               {
//                 name: 'Chioma A.',
//                 role: 'Transferred to University of Toronto',
//                 content: 'The UPI program gave me a head start. I completed my first year online and transferred seamlessly to Toronto.',
//                 rating: 5,
//               },
//               {
//                 name: 'Emmanuel K.',
//                 role: 'Now studying at Melbourne University',
//                 content: 'Saved money and time. The credits transferred without any issues. Best decision I made for my education.',
//                 rating: 5,
//               },
//               {
//                 name: 'Fatima B.',
//                 role: 'Accepted to University of Cape Town',
//                 content: 'The flexibility allowed me to work while studying. Support team was amazing throughout the process.',
//                 rating: 5,
//               },
//             ].map((testimonial, index) => (
//               <motion.div
//                 key={testimonial.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="card-premium p-6"
//               >
//                 <div className="flex items-center gap-1 mb-4">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                   ))}
//                 </div>
//                 <p className="text-gray-600 text-sm mb-6 leading-relaxed">"{testimonial.content}"</p>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
//                     <span className="text-white font-semibold text-sm">
//                       {testimonial.name.split(' ')[0].charAt(0)}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm text-gray-900">{testimonial.name}</p>
//                     <p className="text-xs text-gray-500">{testimonial.role}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="py-20 md:py-28 bg-[#FAFBFC]">
//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <span className="badge-premium mb-4 inline-block">FAQ</span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Frequently asked{' '}
//               <span className="text-gradient">questions</span>
//             </h2>
//           </div>

//           <div className="space-y-3">
//             {[
//               { q: 'How do credits transfer?', a: 'Credits earned through UPI are recognized by our 500+ partner institutions. We handle the transfer process seamlessly.' },
//               { q: 'What is the program duration?', a: 'Programs typically range from 6-18 months depending on the number of credits and your pace of study.' },
//               { q: 'Are the programs accredited?', a: 'Yes, all UPI programs are fully accredited and meet international academic standards.' },
//               { q: 'Can I work while studying?', a: 'Absolutely! The flexible online format allows you to balance work and studies.' },
//             ].map((faq, index) => (
//               <motion.details
//                 key={index}
//                 initial={{ opacity: 0, y: 10 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="card-premium group"
//               >
//                 <summary className="p-5 cursor-pointer list-none flex items-center justify-between font-medium text-gray-900">
//                   {faq.q}
//                   <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
//                 </summary>
//                 <p className="px-5 pb-5 text-sm text-gray-500">{faq.a}</p>
//               </motion.details>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-20 md:py-28 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />

//         <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
//               <Sparkles className="w-4 h-4 text-blue-400" />
//               <span className="text-sm text-gray-300">Limited spots available</span>
//             </div>

//             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
//               Ready to start your{' '}
//               <span className="text-gradient">journey</span>?
//             </h2>

//             <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
//               Join thousands of students who have accelerated their education through the UPI Program.
//             </p>

//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//               <Link
//                 href="/upi-program/apply"
//                 className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all inline-flex items-center gap-2 group"
//               >
//                 Apply Now
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Link>
//               <Link
//                 href="/contact"
//                 className="border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-all inline-flex items-center gap-2"
//               >
//                 Talk to an advisor
//               </Link>
//             </div>

//             <p className="text-sm text-gray-500 mt-6">
//               No commitment required • Free consultation
//             </p>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   )
// }