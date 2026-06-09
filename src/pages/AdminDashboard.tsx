import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { 
  Users, FileText, Plus, LogOut, DollarSign, TrendingUp,
  CheckCircle, XCircle, Clock, Send, Trash2, Edit2,
  Search, Filter, Download, Menu, X, Loader2
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  date: string
  due_date: string
  client?: Client
}

interface Project {
  id: string
  client_id: string
  name: string
  description: string
  status: 'in_progress' | 'review' | 'completed' | 'on_hold'
  progress: number
  deadline: string
  client?: Client
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'invoices' | 'projects'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: clientsData }, { data: invoicesData }, { data: projectsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*, client:profiles(name, email)').order('created_at', { ascending: false }),
      supabase.from('projects').select('*, client:profiles(name, email)').order('created_at', { ascending: false })
    ])
    setClients(clientsData || [])
    setInvoices(invoicesData || [])
    setProjects(projectsData || [])
    setLoading(false)
  }

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    await supabase.from('invoices').delete().eq('id', id)
    fetchData()
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const newInvoice = {
      client_id: formData.get('client_id') as string,
      invoice_number: formData.get('invoice_number') as string,
      amount: Number(formData.get('amount')),
      status: formData.get('status') as 'paid' | 'pending' | 'overdue',
      date: formData.get('date') as string,
      due_date: formData.get('due_date') as string
    }
    
    await supabase.from('invoices').insert(newInvoice)
    setShowInvoiceModal(false)
    fetchData()
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newProject = {
      client_id: formData.get('client_id') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as 'in_progress' | 'review' | 'completed' | 'on_hold',
      progress: Number(formData.get('progress')),
      deadline: formData.get('deadline') as string
    }

    await supabase.from('projects').insert(newProject)
    setShowProjectModal(false)
    fetchData()
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchData()
  }

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const updates = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as 'in_progress' | 'review' | 'completed' | 'on_hold',
      progress: Number(formData.get('progress')),
      deadline: formData.get('deadline') as string
    }

    await supabase.from('projects').update(updates).eq('id', editingProject.id)
    setEditingProject(null)
    fetchData()
  }

  const handleEditInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInvoice) return
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const updates = {
      invoice_number: formData.get('invoice_number') as string,
      amount: Number(formData.get('amount')),
      status: formData.get('status') as 'paid' | 'pending' | 'overdue',
      date: formData.get('date') as string,
      due_date: formData.get('due_date') as string
    }

    await supabase.from('invoices').update(updates).eq('id', editingInvoice.id)
    setEditingInvoice(null)
    fetchData()
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const stats = {
    totalRevenue: invoices.filter((i: Invoice) => i.status === 'paid').reduce((sum: number, i: Invoice) => sum + i.amount, 0),
    pendingAmount: invoices.filter((i: Invoice) => i.status === 'pending').reduce((sum: number, i: Invoice) => sum + i.amount, 0),
    overdueAmount: invoices.filter((i: Invoice) => i.status === 'overdue').reduce((sum: number, i: Invoice) => sum + i.amount, 0),
    totalClients: clients.length,
    activeProjects: projects.filter((p: Project) => p.status === 'in_progress').length,
  }

  // Filter data based on search term
  const searchLower = searchTerm.toLowerCase()
  const filteredClients = clients.filter((c: Client) => 
    c.name.toLowerCase().includes(searchLower) || 
    c.email.toLowerCase().includes(searchLower)
  )
  const filteredInvoices = invoices.filter((i: Invoice) => 
    i.invoice_number.toLowerCase().includes(searchLower) ||
    i.client?.name?.toLowerCase().includes(searchLower) ||
    i.client?.email?.toLowerCase().includes(searchLower)
  )
  const filteredProjects = projects.filter((p: Project) => 
    p.name.toLowerCase().includes(searchLower) ||
    p.description?.toLowerCase().includes(searchLower) ||
    p.client?.name?.toLowerCase().includes(searchLower)
  )

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
              {/* Search */}
              <div className="hidden md:flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-40 lg:w-56 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button onClick={() => setShowProjectModal(true)} className="hidden md:flex p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm items-center gap-2">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Project</span>
              </button>
              <button onClick={() => setShowInvoiceModal(true)} className="hidden md:flex p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm items-center gap-2">
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
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button onClick={() => { setShowProjectModal(true); setMobileMenuOpen(false); }} className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> New Project
                </button>
                <button onClick={() => { setShowInvoiceModal(true); setMobileMenuOpen(false); }} className="w-full p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2">
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
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                    </div>
                  ) : filteredInvoices.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No invoices yet</p>
                  ) : (
                    filteredInvoices.slice(0, 5).map((invoice: Invoice) => (
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
                            <p className="font-bold text-white">{invoice.invoice_number}</p>
                            <p className="text-sm text-slate-400">{invoice.client?.name || 'Unknown'}</p>
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
                    ))
                  )}
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
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                      </td></tr>
                    ) : filteredInvoices.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-slate-400">No invoices yet</td></tr>
                    ) : (
                      filteredInvoices.map((invoice: Invoice) => (
                        <tr key={invoice.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                          <td className="p-4 text-white font-bold">{invoice.invoice_number}</td>
                          <td className="p-4 text-slate-300">{invoice.client?.name || 'Unknown'}</td>
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
                              <button onClick={() => setEditingInvoice(invoice)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white" title="Edit invoice">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteInvoice(invoice.id)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400" title="Delete invoice">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white" title="Send invoice">
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clients & Projects tabs would go here - truncated for brevity */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white">Clients</h1>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                </div>
              ) : filteredClients.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No clients yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClients.map((client: Client) => (
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
                      </div>
                      <h3 className="font-bold text-white text-lg">{client.name}</h3>
                      <p className="text-slate-500 text-xs mt-1">{client.email}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white">Projects</h1>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                </div>
              ) : filteredProjects.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No projects yet</p>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project: Project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-neon rounded-2xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg">{project.name}</h3>
                          <p className="text-slate-400">{project.client?.name || 'Unknown'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                            project.status === 'review' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {project.status.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => setEditingProject(project)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Edit project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{project.progress}% Complete</span>
                        <span className="text-slate-400">Due: {project.deadline}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowInvoiceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white mb-6">Create Invoice</h2>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Client</label>
                  <select name="client_id" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <option value="">Select client</option>
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Invoice Number</label>
                  <input name="invoice_number" type="text" required placeholder="INV-003" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Amount (£)</label>
                  <input name="amount" type="number" required min="0" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Status</label>
                  <select name="status" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Date</label>
                    <input name="date" type="date" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Due Date</label>
                    <input name="due_date" type="date" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowInvoiceModal(false)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Project Modal */}
        {showProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowProjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white mb-6">Create Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Client</label>
                  <select name="client_id" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <option value="">Select client</option>
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Project Name</label>
                  <input name="name" type="text" required placeholder="Website Redesign" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Description</label>
                  <textarea name="description" rows={3} placeholder="Brief project description..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Status</label>
                  <select name="status" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Progress (%)</label>
                  <input name="progress" type="number" required min="0" max="100" defaultValue="0" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Deadline</label>
                  <input name="deadline" type="date" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Invoice Modal */}
        {editingInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setEditingInvoice(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white mb-6">Edit Invoice</h2>
              <form onSubmit={handleEditInvoice} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Invoice Number</label>
                  <input name="invoice_number" type="text" required defaultValue={editingInvoice.invoice_number} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Amount (£)</label>
                  <input name="amount" type="number" required min="0" defaultValue={editingInvoice.amount} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Status</label>
                  <select name="status" required defaultValue={editingInvoice.status} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Date</label>
                    <input name="date" type="date" required defaultValue={editingInvoice.date} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Due Date</label>
                    <input name="due_date" type="date" required defaultValue={editingInvoice.due_date} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingInvoice(null)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Project Modal */}
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setEditingProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white mb-6">Edit Project</h2>
              <form onSubmit={handleEditProject} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Project Name</label>
                  <input name="name" type="text" required defaultValue={editingProject.name} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Description</label>
                  <textarea name="description" rows={3} defaultValue={editingProject.description} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Status</label>
                  <select name="status" required defaultValue={editingProject.status} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Progress (%)</label>
                  <input name="progress" type="number" required min="0" max="100" defaultValue={editingProject.progress} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Deadline</label>
                  <input name="deadline" type="date" required defaultValue={editingProject.deadline} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingProject(null)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
