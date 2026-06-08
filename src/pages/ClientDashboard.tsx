import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { 
  FileText, CreditCard, MessageSquare, CheckCircle2, 
  Clock, Download, LogOut, User, ChevronRight, Star
} from 'lucide-react'

// Mock data - replace with Supabase
const MOCK_PROJECTS = [
  { id: 1, name: 'E-Commerce Platform', status: 'in_progress', progress: 75, deadline: '2026-06-15' },
  { id: 2, name: 'Mobile App Design', status: 'review', progress: 90, deadline: '2026-05-30' },
]

const MOCK_INVOICES = [
  { id: 'INV-001', amount: 2500, status: 'paid', date: '2026-05-01', dueDate: '2026-05-15' },
  { id: 'INV-002', amount: 1800, status: 'pending', date: '2026-05-15', dueDate: '2026-05-29' },
]

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices' | 'messages'>('projects')

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-neon border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">{user?.name}</p>
                <p className="text-xs text-slate-400">Client Portal</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Projects', value: '2', icon: CheckCircle2, color: 'text-green-400' },
            { label: 'Pending Invoices', value: '£1,800', icon: Clock, color: 'text-yellow-400' },
            { label: 'Total Spent', value: '£4,300', icon: CreditCard, color: 'text-cyan-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-neon rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['projects', 'invoices', 'messages'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-neon rounded-2xl p-6">
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Your Projects</h2>
              {MOCK_PROJECTS.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      project.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      project.status === 'review' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{project.progress}% Complete</span>
                    <span>Due: {project.deadline}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Invoices</h2>
              {MOCK_INVOICES.map((invoice) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slap-pink" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{invoice.id}</p>
                      <p className="text-sm text-slate-400">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white">£{invoice.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {invoice.status}
                      </span>
                      {invoice.status === 'paid' ? (
                        <button className="text-slate-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No new messages</p>
              <button className="mt-4 px-6 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors">
                Start a Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
