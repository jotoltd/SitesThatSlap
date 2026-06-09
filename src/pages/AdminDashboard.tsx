import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { jsPDF } from 'jspdf'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts'
import { 
  Users, FileText, Plus, LogOut, DollarSign, TrendingUp,
  CheckCircle, XCircle, Clock, Send, Trash2, Edit2,
  Search, Filter, Download, Menu, X, Loader2, MessageSquare, Upload
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  phone?: string
  address?: string
  company_name?: string
  website?: string
  notes?: string
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

interface Message {
  id: string
  client_id: string
  sender: 'client' | 'admin'
  content: string
  read: boolean
  created_at: string
  client?: Client
}

interface ProjectFile {
  id: string
  project_id: string
  file_name: string
  file_path: string
  file_size: number
  created_at: string
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'invoices' | 'projects' | 'messages'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClientForMessages, setSelectedClientForMessages] = useState<string | null>(null)
  const [newAdminMessage, setNewAdminMessage] = useState('')
  const [selectedProjectForFiles, setSelectedProjectForFiles] = useState<string | null>(null)
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    fetchData()

    // Real-time subscriptions
    const channels = [
      supabase.channel('invoices-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchData)
        .subscribe(),
      supabase.channel('projects-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchData)
        .subscribe(),
      supabase.channel('messages-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchData)
        .subscribe(),
      supabase.channel('clients-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchData)
        .subscribe()
    ]

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel))
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: clientsData }, { data: invoicesData }, { data: projectsData }, { data: messagesData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*, client:profiles(name, email)').order('created_at', { ascending: false }),
      supabase.from('projects').select('*, client:profiles(name, email)').order('created_at', { ascending: false }),
      supabase.from('messages').select('*, client:profiles(name, email)').order('created_at', { ascending: true })
    ])
    setClients(clientsData || [])
    setInvoices(invoicesData || [])
    setProjects(projectsData || [])
    setMessages(messagesData || [])
    setLoading(false)
  }

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminMessage.trim() || !selectedClientForMessages) return
    
    await supabase.from('messages').insert({
      client_id: selectedClientForMessages,
      sender: 'admin',
      content: newAdminMessage.trim()
    })
    setNewAdminMessage('')
    fetchData()
  }

  const fetchProjectFiles = async (projectId: string) => {
    const { data } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    setProjectFiles(data || [])
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    const filePath = `${projectId}/${Date.now()}_${file.name}`
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file)
    
    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      setUploadingFile(false)
      return
    }
    
    // Save file record
    await supabase.from('project_files').insert({
      project_id: projectId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size
    })
    
    await fetchProjectFiles(projectId)
    setUploadingFile(false)
  }

  const handleDeleteFile = async (file: ProjectFile) => {
    if (!confirm(`Delete ${file.file_name}?`)) return
    
    // Delete from storage
    await supabase.storage.from('project-files').remove([file.file_path])
    
    // Delete record
    await supabase.from('project_files').delete().eq('id', file.id)
    
    if (selectedProjectForFiles) {
      fetchProjectFiles(selectedProjectForFiles)
    }
  }

  const handleDownloadFile = async (file: ProjectFile) => {
    const { data } = await supabase.storage.from('project-files').download(file.file_path)
    if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const unreadCount = messages.filter((m: Message) => m.sender === 'client' && !m.read).length

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    await supabase.from('invoices').delete().eq('id', id)
    fetchData()
  }

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Delete client "${name}"?\n\nThis will also delete all their projects, invoices, and messages. This cannot be undone.`)) return
    
    // Delete related data first (due to foreign key constraints)
    await supabase.from('messages').delete().eq('client_id', id)
    await supabase.from('invoices').delete().eq('client_id', id)
    await supabase.from('projects').delete().eq('client_id', id)
    
    // Delete the client profile
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    
    if (error) {
      alert('Error deleting client: ' + error.message)
    } else {
      fetchData()
    }
  }

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClient) return
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const updates = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      address: formData.get('address') as string || null,
      company_name: formData.get('company_name') as string || null,
      website: formData.get('website') as string || null,
      notes: formData.get('notes') as string || null,
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', editingClient.id)

    if (error) {
      alert('Error updating client: ' + error.message)
    } else {
      setEditingClient(null)
      fetchData()
    }
  }

  const handleDownloadInvoice = (invoice: Invoice, clientName: string) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFillColor(255, 0, 110)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('Sites That Slap', 20, 25)
    doc.setFontSize(12)
    doc.text('Joto Ltd', 20, 32)
    
    // Invoice Title
    doc.setTextColor(255, 0, 110)
    doc.setFontSize(28)
    doc.text('INVOICE', 140, 25)
    
    // Invoice Details
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Invoice #: ${invoice.invoice_number}`, 140, 32)
    doc.text(`Date: ${invoice.date}`, 140, 37)
    
    // Bill To
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.text('Bill To:', 20, 60)
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(clientName || 'Client', 20, 68)
    
    // Amount Box
    doc.setFillColor(248, 249, 250)
    doc.roundedRect(120, 55, 70, 35, 3, 3, 'F')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text('Amount Due', 130, 68)
    doc.setTextColor(255, 0, 110)
    doc.setFontSize(20)
    doc.text(`£${invoice.amount.toLocaleString()}`, 130, 80)
    
    // Status
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 100)
    doc.text(`Due Date: ${invoice.due_date}`, 20, 107)
    
    // Footer
    doc.setDrawColor(255, 0, 110)
    doc.line(20, 250, 190, 250)
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text('Thank you for your business!', 20, 260)
    doc.text('Sites That Slap - hello@sitesthatslap.com', 20, 267)
    
    doc.save(`${invoice.invoice_number}.pdf`)
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

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingClient(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const company_name = formData.get('company_name') as string
    const website = formData.get('website') as string
    const notes = formData.get('notes') as string

    try {
      // Save admin's current session before creating client
      // signUp() will switch session to the new user, so we need to restore it
      const { data: { session: adminSession } } = await supabase.auth.getSession()
      
      if (!adminSession) {
        alert('Error: Admin session not found. Please login again.')
        setCreatingClient(false)
        return
      }

      // Create auth user - profile will be created by trigger
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'client'
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      })

      if (authError) {
        // Restore admin session on error
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token
        })
        alert('Error creating client: ' + authError.message)
        setCreatingClient(false)
        return
      }

      if (!authData.user) {
        // Restore admin session on error
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token
        })
        alert('Error: No user returned from signup')
        setCreatingClient(false)
        return
      }

      // Restore admin's session immediately after creating client
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token
      })

      if (sessionError) {
        console.error('Error restoring admin session:', sessionError)
        alert('Client created but session error occurred. Please refresh the page.')
        setCreatingClient(false)
        return
      }

      // Wait for trigger to create profile, then update with additional fields
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone: phone || null,
          address: address || null,
          company_name: company_name || null,
          website: website || null,
          notes: notes || null
        })
        .eq('id', authData.user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
      }

      // Show success message
      if (authData.session) {
        // User can login immediately (email confirmation disabled)
        alert(`Client "${name}" created successfully!\n\nThey can now login with:\nEmail: ${email}\nPassword: ${password}`)
      } else {
        // Email confirmation required
        alert(`Client "${name}" created successfully!\n\nIMPORTANT: An email confirmation has been sent to ${email}. The client must click the link in the email before they can login.\n\nEmail: ${email}\nPassword: ${password}`)
      }

      setShowClientModal(false)
      form.reset()
      fetchData()
    } catch (err) {
      console.error('Error creating client:', err)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setCreatingClient(false)
    }
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
                <p className="text-white font-bold">Sites That Slap Admin</p>
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
              <button onClick={() => setShowClientModal(true)} className="hidden md:flex p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm items-center gap-2">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Client</span>
              </button>
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
                { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
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
                  <span className="flex-1 text-left">{item.label}</span>
                  {(item as any).badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold">
                      {(item as any).badge}
                    </span>
                  )}
                </motion.button>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button onClick={() => { setShowClientModal(true); setMobileMenuOpen(false); }} className="w-full p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> New Client
                </button>
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
              { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
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
                <span className="flex-1 text-left">{item.label}</span>
                {(item as any).badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold">
                    {(item as any).badge}
                  </span>
                )}
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

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-neon rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-white mb-4">Invoice Status</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Paid', value: invoices.filter((i: Invoice) => i.status === 'paid').length, color: '#10B981' },
                          { name: 'Pending', value: invoices.filter((i: Invoice) => i.status === 'pending').length, color: '#F59E0B' },
                          { name: 'Overdue', value: invoices.filter((i: Invoice) => i.status === 'overdue').length, color: '#EF4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Paid', value: invoices.filter((i: Invoice) => i.status === 'paid').length, color: '#10B981' },
                          { name: 'Pending', value: invoices.filter((i: Invoice) => i.status === 'pending').length, color: '#F59E0B' },
                          { name: 'Overdue', value: invoices.filter((i: Invoice) => i.status === 'overdue').length, color: '#EF4444' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {[
                      { label: 'Paid', color: '#10B981', count: invoices.filter((i: Invoice) => i.status === 'paid').length },
                      { label: 'Pending', color: '#F59E0B', count: invoices.filter((i: Invoice) => i.status === 'pending').length },
                      { label: 'Overdue', color: '#EF4444', count: invoices.filter((i: Invoice) => i.status === 'overdue').length },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-400">{item.label} ({item.count})</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Project Status Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-neon rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-white mb-4">Project Status</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'In Progress', count: projects.filter((p: Project) => p.status === 'in_progress').length, fill: '#3B82F6' },
                      { name: 'Review', count: projects.filter((p: Project) => p.status === 'review').length, fill: '#8B5CF6' },
                      { name: 'Completed', count: projects.filter((p: Project) => p.status === 'completed').length, fill: '#10B981' },
                      { name: 'On Hold', count: projects.filter((p: Project) => p.status === 'on_hold').length, fill: '#6B7280' },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
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
                              <button 
                                onClick={() => handleDownloadInvoice(invoice, invoice.client?.name || 'Client')}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white" 
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
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
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Clients</h1>
                <button 
                  onClick={() => setShowClientModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add Client
                </button>
              </div>
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
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setEditingClient(client)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                            title="Edit client"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClient(client.id, client.name)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400"
                            title="Delete client"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-white text-lg">{client.name}</h3>
                      {client.company_name && (
                        <p className="text-slap-pink text-sm font-medium">{client.company_name}</p>
                      )}
                      <p className="text-slate-400 text-sm mt-1">{client.email}</p>
                      
                      {/* Additional Info */}
                      <div className="mt-4 space-y-2 pt-4 border-t border-white/10">
                        {client.phone && (
                          <p className="text-slate-400 text-xs flex items-center gap-2">
                            <span className="text-slate-500">Phone:</span> {client.phone}
                          </p>
                        )}
                        {client.address && (
                          <p className="text-slate-400 text-xs flex items-start gap-2">
                            <span className="text-slate-500">Address:</span> 
                            <span className="line-clamp-2">{client.address}</span>
                          </p>
                        )}
                        {client.website && (
                          <p className="text-slate-400 text-xs">
                            <span className="text-slate-500">Website:</span>{' '}
                            <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-slap-cyan hover:underline">
                              {client.website.replace(/^https?:\/\//, '')}
                            </a>
                          </p>
                        )}
                        {client.notes && (
                          <p className="text-slate-500 text-xs italic mt-2 line-clamp-2">
                            "{client.notes}"
                          </p>
                        )}
                      </div>
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
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-slate-400">{project.progress}% Complete</span>
                        <span className="text-slate-400">Due: {project.deadline}</span>
                      </div>

                      {/* File Upload */}
                      <div className="border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-white">Files</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProjectForFiles(project.id)
                                fetchProjectFiles(project.id)
                              }}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              {selectedProjectForFiles === project.id ? 'Hide' : 'View'} Files
                            </button>
                            <label className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer" title="Upload file">
                              <Upload className="w-4 h-4" />
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, project.id)}
                                disabled={uploadingFile}
                              />
                            </label>
                          </div>
                        </div>
                        
                        {selectedProjectForFiles === project.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                          >
                            {uploadingFile && (
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </div>
                            )}
                            {projectFiles.length === 0 ? (
                              <p className="text-sm text-slate-500">No files uploaded</p>
                            ) : (
                              projectFiles.map((file: ProjectFile) => (
                                <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-sm text-white truncate">{file.file_name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => handleDownloadFile(file)}
                                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                                      title="Download"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFile(file)}
                                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-red-400"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Messages</h1>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-bold">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                </div>
              ) : clients.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No clients to message</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
                  {/* Client List */}
                  <div className="glass-neon rounded-2xl p-4 overflow-y-auto">
                    <h2 className="text-lg font-bold text-white mb-4">Clients</h2>
                    <div className="space-y-2">
                      {clients.map((client: Client) => {
                        const clientMessages = messages.filter((m: Message) => m.client_id === client.id)
                        const unreadClient = clientMessages.filter((m: Message) => m.sender === 'client' && !m.read).length
                        const lastMessage = clientMessages[clientMessages.length - 1]
                        
                        return (
                          <button
                            key={client.id}
                            onClick={() => setSelectedClientForMessages(client.id)}
                            className={`w-full p-3 rounded-xl text-left transition-all ${
                              selectedClientForMessages === client.id
                                ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">{client.name}</span>
                              {unreadClient > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold">
                                  {unreadClient}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-sm text-slate-400 truncate mt-1">
                                {lastMessage.content}
                              </p>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="lg:col-span-2 glass-neon rounded-2xl p-4 flex flex-col">
                    {selectedClientForMessages ? (
                      <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                          <div>
                            <h2 className="font-bold text-white">
                              {clients.find((c: Client) => c.id === selectedClientForMessages)?.name}
                            </h2>
                            <p className="text-sm text-slate-400">
                              {clients.find((c: Client) => c.id === selectedClientForMessages)?.email}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedClientForMessages(null)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-4 my-4">
                          {messages
                            .filter((m: Message) => m.client_id === selectedClientForMessages)
                            .map((message: Message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                  message.sender === 'admin' 
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md' 
                                    : 'bg-white/10 text-white rounded-bl-md'
                                }`}>
                                  <p>{message.content}</p>
                                  <p className={`text-xs mt-1 ${message.sender === 'admin' ? 'text-white/70' : 'text-slate-400'}`}>
                                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          {messages.filter((m: Message) => m.client_id === selectedClientForMessages).length === 0 && (
                            <div className="text-center py-12">
                              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                              <p className="text-slate-400">No messages yet</p>
                              <p className="text-slate-500 text-sm mt-1">Start the conversation</p>
                            </div>
                          )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendAdminMessage} className="flex gap-2 pt-4 border-t border-white/10">
                          <input
                            type="text"
                            value={newAdminMessage}
                            onChange={(e) => setNewAdminMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                          />
                          <button
                            type="submit"
                            disabled={!newAdminMessage.trim()}
                            className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400">Select a client to view messages</p>
                        </div>
                      </div>
                    )}
                  </div>
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

        {/* Create Client Modal */}
        {showClientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowClientModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white mb-2">Create Client</h2>
              <p className="text-xs text-slate-400 mb-4">
                Client will receive an account with login credentials. 
                <span className="text-slap-pink">*</span> Required fields
              </p>
              <form onSubmit={handleCreateClient} className="space-y-4">
                {/* Required Fields */}
                <div className="border-b border-white/10 pb-4">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Required</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Name *</label>
                      <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Client name" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Email *</label>
                      <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="client@example.com" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Password *</label>
                      <input name="password" type="password" required minLength={6} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Min 6 characters" />
                    </div>
                  </div>
                </div>

                {/* Optional Fields */}
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Additional Info (Optional)</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Company Name</label>
                      <input name="company_name" type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Company Ltd" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Phone</label>
                      <input name="phone" type="tel" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="+44 123 456 7890" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Address</label>
                      <textarea name="address" rows={2} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" placeholder="123 Street, City, Postcode" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Website</label>
                      <input name="website" type="url" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="https://example.com" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Notes</label>
                      <textarea name="notes" rows={2} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" placeholder="Any additional notes..." />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" disabled={creatingClient} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold disabled:opacity-50">
                    {creatingClient ? 'Creating...' : 'Create'}
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

        {/* Edit Client Modal */}
        {editingClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setEditingClient(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white mb-6">Edit Client</h2>
              <form onSubmit={handleEditClient} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Name</label>
                  <input name="name" type="text" required defaultValue={editingClient.name} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Email</label>
                  <input name="email" type="email" required defaultValue={editingClient.email} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Company Name</label>
                  <input name="company_name" type="text" defaultValue={editingClient.company_name || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Company Ltd" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Phone</label>
                  <input name="phone" type="tel" defaultValue={editingClient.phone || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="+44 123 456 7890" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Address</label>
                  <textarea name="address" rows={2} defaultValue={editingClient.address || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" placeholder="123 Street, City, Postcode" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Website</label>
                  <input name="website" type="url" defaultValue={editingClient.website || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="https://example.com" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Notes</label>
                  <textarea name="notes" rows={2} defaultValue={editingClient.notes || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" placeholder="Any additional notes..." />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditingClient(null)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
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
