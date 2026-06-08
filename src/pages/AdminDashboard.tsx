import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { 
  Users, FileText, Plus, LogOut, DollarSign, TrendingUp,
  CheckCircle, XCircle, Clock, Send, Trash2, Edit2,
  ChevronDown, ChevronUp, Search, Filter, Download, Menu, X, TrendingUpIcon
} from 'lucide-react'

// Mock admin data
const MOCK_CLIENTS = [
  { id: 1, name: 'John Client', email: 'client@example.com', company: 'Client Co', totalSpent: 4300, activeProjects: 2 },
  { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', company: 'TechCorp', totalSpent: 8500, activeProjects: 1 },
  { id: 3, name: 'Mike Johnson', email: 'mike@startup.io', company: 'StartupIO', totalSpent: 1200, activeProjects: 0 },
]

const MOCK_ALL_INVOICES = [
  { id: 'INV-001', client: 'John Client', amount: 2500, status: 'paid', date: '2026-05-01', dueDate: '2026-05-15' },
  { id: 'INV-002', client: 'John Client', amount: 1800, status: 'pending', date: '2026-05-15', dueDate: '2026-05-29' },
  { id: 'INV-003', client: 'Jane Smith', amount: 4500, status: 'paid', date: '2026-04-20', dueDate: '2026-05-05' },
  { id: 'INV-004', client: 'Jane Smith', amount: 4000, status: 'overdue', date: '2026-04-01', dueDate: '2026-04-15' },
]

const MOCK_PROJECTS = [
  { id: 1, name: 'E-Commerce Platform', client: 'John Client', status: 'in_progress', budget: 5000, progress: 75 },
  { id: 2, name: 'Mobile App Design', client: 'John Client', status: 'review', budget: 2000, progress: 90 },
  { id: 3, name: 'SaaS Dashboard', client: 'Jane Smith', status: 'in_progress', budget: 8000, progress: 45 },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'invoices' | 'projects'>('overview')
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const stats = {
    totalRevenue: MOCK_ALL_INVOICES.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: MOCK_ALL_INVOICES.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    overdueAmount: MOCK_ALL_INVOICES.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
    totalClients: MOCK_CLIENTS.length,
    activeProjects: MOCK_PROJECTS.filter(p => p.status === 'in_progress').length,
  }

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-neon border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-black text-lg">J</span>
              </div>
              <div>
                <p className="text-white font-bold">Joto Admin</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button className="hidden md:flex p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm items-center gap-2">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Invoice</span>
              </button>
              <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
              {/* Mobile Hamburger */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
                <div className="absolute inset-[2px] rounded-xl bg-[#0a0a1a]" />
                <div className="relative z-10">
                  {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 bottom-0 w-64 z-40 lg:hidden glass-neon border-l border-white/10"
            style={{ background: 'rgba(10,10,30,0.98)' }}
          >
            <div className="p-4 space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'invoices', label: 'Invoices', icon: FileText },
                { id: 'projects', label: 'Projects', icon: CheckCircle },
              ].map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </motion.button>
              ))}
              <div className="pt-4 border-t border-white/10">
                <button className="w-full p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> New Invoice
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar + Content */}
      <div className="pt-16 flex">
        {/* Sidebar - Desktop */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 glass-neon border-r border-white/10 hidden lg:block">
          <div className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'projects', label: 'Projects', icon: CheckCircle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6 w-full">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white">Dashboard Overview</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Total Revenue', value: `£${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
                  { label: 'Pending', value: `£${stats.pendingAmount.toLocaleString()}`, icon: Clock, color: 'from-yellow-500 to-orange-500' },
                  { label: 'Overdue', value: `£${stats.overdueAmount.toLocaleString()}`, icon: XCircle, color: 'from-red-500 to-pink-500' },
                  { label: 'Total Clients', value: stats.totalClients.toString(), icon: Users, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Active Projects', value: stats.activeProjects.toString(), icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
                  { label: 'Avg Project Value', value: '£4,200', icon: TrendingUp, color: 'from-cyan-500 to-blue-500' },
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
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="glass-neon rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Invoices</h2>
                <div className="space-y-3">
                  {MOCK_ALL_INVOICES.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{invoice.id}</p>
                          <p className="text-sm text-slate-400">{invoice.client}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">£{invoice.amount.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Invoices</h1>
                <button 
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Create Invoice
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl neon-input bg-[#0a0a1a] text-white"
                  />
                </div>
                <button className="px-4 py-3 rounded-xl glass-neon text-slate-400 flex items-center gap-2">
                  <Filter className="w-5 h-5" /> Filter
                </button>
                <button className="px-4 py-3 rounded-xl glass-neon text-slate-400 flex items-center gap-2">
                  <Download className="w-5 h-5" /> Export
                </button>
              </div>

              {/* Invoice List */}
              <div className="glass-neon rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-left text-slate-400 text-sm">
                      <th className="p-4 font-semibold">Invoice #</th>
                      <th className="p-4 font-semibold">Client</th>
                      <th className="p-4 font-semibold">Amount</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ALL_INVOICES.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                        <td className="p-4 text-white font-bold">{invoice.id}</td>
                        <td className="p-4 text-slate-300">{invoice.client}</td>
                        <td className="p-4 text-white font-bold">£{invoice.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                            invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-sm">{invoice.date}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clients & Projects tabs would go here - truncated for brevity */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white">Clients</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_CLIENTS.map((client) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-neon rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                        {client.name.charAt(0)}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-400">
                        {client.activeProjects} projects
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-lg">{client.name}</h3>
                    <p className="text-slate-400 text-sm">{client.company}</p>
                    <p className="text-slate-500 text-xs mt-1">{client.email}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Total Spent</span>
                      <span className="text-xl font-black text-white">£{client.totalSpent.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white">Projects</h1>
              <div className="space-y-4">
                {MOCK_PROJECTS.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-neon rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg">{project.name}</h3>
                        <p className="text-slate-400">{project.client}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        project.status === 'review' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{project.progress}% Complete</span>
                      <span className="text-slate-400">Budget: £{project.budget.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
