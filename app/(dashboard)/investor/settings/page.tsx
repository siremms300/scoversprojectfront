'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, User, Bell, Shield, Lock,
  Mail, Save, Globe, Eye, EyeOff, Building2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function InvestorSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Settings saved successfully')
    }, 1000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Settings</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Manage your investor account settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#247BF7] to-[#6366F1] rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-semibold">IN</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Investor Name</h3>
              <p className="text-[12px] text-gray-500">investor@example.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" defaultValue="John" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" defaultValue="Doe" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" defaultValue="investor@example.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" defaultValue="Investment Corp" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-4">
          {[
            { title: 'Weekly performance digest', description: 'Receive weekly summary of key metrics and trends' },
            { title: 'Application milestone alerts', description: 'Get notified when applications reach key milestones' },
            { title: 'Revenue threshold alerts', description: 'Alert when revenue exceeds or drops below thresholds' },
            { title: 'Program update notifications', description: 'Updates on new programs, changes, or closures' },
            { title: 'Monthly investor report', description: 'Receive comprehensive monthly performance report' },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-[13px] font-medium text-gray-900">{item.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#247BF7] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" placeholder="Enter current password" className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" placeholder="Enter new password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Two-Factor Authentication</label>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-[13px] text-gray-600">Enable 2FA for added security</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#247BF7] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          </div>
          <button onClick={handleSave} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Update Security
          </button>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Default Time Period</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Currency Display</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <button onClick={handleSave} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      )}
    </div>
  )
}
