'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Download, Calendar, TrendingUp,
  Users, DollarSign, CreditCard, Target,
  ChevronRight, Star
} from 'lucide-react'
import toast from 'react-hot-toast'

const reportTypes = [
  {
    title: 'Application Summary',
    description: 'Overview of all applications with status breakdown and conversion metrics',
    icon: FileText,
    period: 'Monthly',
    format: 'PDF',
  },
  {
    title: 'Revenue Report',
    description: 'Detailed revenue analysis with trends and projections',
    icon: DollarSign,
    period: 'Monthly',
    format: 'PDF',
  },
  {
    title: 'Enrollment Report',
    description: 'UPI program enrollment statistics and growth metrics',
    icon: Users,
    period: 'Weekly',
    format: 'Excel',
  },
  {
    title: 'Source Attribution',
    description: 'Breakdown of application sources and channel performance',
    icon: Target,
    period: 'Monthly',
    format: 'PDF',
  },
  {
    title: 'Program Performance',
    description: 'Individual program metrics including completion rates and ratings',
    icon: CreditCard,
    period: 'Quarterly',
    format: 'PDF',
  },
  {
    title: 'Conversion Analytics',
    description: 'Application to enrollment conversion funnel analysis',
    icon: TrendingUp,
    period: 'Monthly',
    format: 'Excel',
  },
]

const recentReports = [
  { name: 'Application Summary - May 2026', date: '2026-05-01', size: '2.4 MB' },
  { name: 'Revenue Report - April 2026', date: '2026-04-30', size: '1.8 MB' },
  { name: 'Enrollment Report - Week 18', date: '2026-04-28', size: '1.2 MB' },
  { name: 'Source Attribution - April 2026', date: '2026-04-25', size: '3.1 MB' },
]

export default function InvestorReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null)

  const handleGenerate = async (reportName: string) => {
    setGenerating(reportName)
    setTimeout(() => {
      setGenerating(null)
      toast.success(`${reportName} generated successfully!`)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Reports</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Generate and download performance reports</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[20px] border border-gray-100/80 p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                <report.icon className="w-6 h-6 text-[#247BF7]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-medium text-gray-500">
                  {report.format}
                </span>
                <span className="px-2 py-1 bg-blue-50 rounded-lg text-[10px] font-medium text-blue-600">
                  {report.period}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-[12px] text-gray-500 mb-4">{report.description}</p>

            <button
              onClick={() => handleGenerate(report.title)}
              disabled={generating === report.title}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {generating === report.title ? 'Generating...' : 'Generate Report'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-[20px] border border-gray-100/80 overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900">Recent Reports</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentReports.map((report) => (
            <div key={report.name} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#247BF7]" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-900">{report.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(report.date).toLocaleDateString()} • {report.size}
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-[#247BF7] transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}