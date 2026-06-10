import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, User, Lock, Bell, Shield, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { toast } from 'sonner'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [saving, setSaving] = useState(false)
  
  // Profile state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  
  // Security state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [invoiceNotifications, setInvoiceNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setCompany(user.company_name || '')
      fetchNotificationSettings()
    }
  }, [user, isOpen])

  const fetchNotificationSettings = async () => {
    if (!user) return
    const { data } = await supabase.from('profiles').select('notification_settings').eq('id', user.id).single()
    if (data?.notification_settings) {
      const settings = data.notification_settings
      setEmailNotifications(settings.email ?? true)
      setProjectUpdates(settings.projects ?? true)
      setInvoiceNotifications(settings.invoices ?? true)
      setMarketingEmails(settings.marketing ?? false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      name,
      phone,
      company_name: company,
      updated_at: new Date().toISOString()
    }).eq('id', user.id)
    
    if (error) {
      toast.error('Failed to update profile')
    } else {
      await refreshUser()
      toast.success('Profile updated successfully')
    }
    setSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    
    if (error) {
      toast.error('Failed to change password')
    } else {
      toast.success('Password changed successfully')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSaving(false)
  }

  const handleUpdateNotifications = async () => {
    if (!user) return
    
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      notification_settings: {
        email: emailNotifications,
        projects: projectUpdates,
        invoices: invoiceNotifications,
        marketing: marketingEmails
      }
    }).eq('id', user.id)
    
    if (error) {
      toast.error('Failed to update preferences')
    } else {
      toast.success('Notification preferences saved')
    }
    setSaving(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl glass-neon rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === tab.id 
                  ? 'text-pink-400 border-b-2 border-pink-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Save Changes
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                <p className="text-sm text-yellow-400">
                  <strong>Tip:</strong> Use a strong password with at least 8 characters including numbers and symbols.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                disabled={saving || !newPassword || !confirmPassword}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Change Password
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="font-semibold text-white">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="font-semibold text-white">Project Updates</p>
                  <p className="text-sm text-slate-400">Get notified about project progress</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectUpdates}
                    onChange={(e) => setProjectUpdates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="font-semibold text-white">Invoice Notifications</p>
                  <p className="text-sm text-slate-400">Get notified about new invoices and payments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invoiceNotifications}
                    onChange={(e) => setInvoiceNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="font-semibold text-white">Marketing Emails</p>
                  <p className="text-sm text-slate-400">Receive tips, offers, and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <button
                onClick={handleUpdateNotifications}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
