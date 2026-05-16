'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, User, Shield, Bell, Globe,
  Mail, Lock, Save
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Settings saved successfully')
    }, 1000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900">Settings</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Manage platform configuration</p>
      </div>

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

      {activeTab === 'general' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Platform Name</label>
            <input type="text" defaultValue="Scovers Education" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Support Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" defaultValue="support@scovers.org" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Application Fee (NGN)</label>
            <input type="number" defaultValue="5000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
          </div>
          <button onClick={handleSave} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#247BF7] transition-all" />
            </div>
          </div>
          <button onClick={handleSave} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Update Password
          </button>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-[20px] border border-gray-100/80 p-6 space-y-4">
          {[
            { label: 'New application alerts', desc: 'Get notified when a new application is submitted' },
            { label: 'Status change notifications', desc: 'Get notified when application status changes' },
            { label: 'Weekly report', desc: 'Receive weekly summary of platform activity' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-[13px] font-medium text-gray-900">{item.label}</p>
                <p className="text-[11px] text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#247BF7] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}