import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { createCheckoutSession } from '../lib/stripe'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'
import { 
  FileText, CreditCard, MessageSquare, CheckCircle2, 
  Clock, Download, LogOut, User, Loader2, Send, Settings,
  Github, CalendarDays, ChevronDown, ChevronUp, Paperclip, X, FileIcon, Target,
  FolderOpen, AlertTriangle, HelpCircle, ExternalLink
} from 'lucide-react'
import { NotificationBell } from '../components/Notifications'
import SettingsModal from '../components/SettingsModal'

interface Project {
  id: string
  name: string
  status: 'in_progress' | 'review' | 'completed' | 'on_hold'
  progress: number
  deadline: string
  description?: string
  github_repo_url?: string
}

interface ProjectSummary {
  id: string
  project_id: string
  summary: string
  commit_count: number
  date: string
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  date: string
  due_date: string
}

interface Message {
  id: string
  client_id: string
  sender: 'client' | 'admin'
  content: string
  read: boolean
  created_at: string
  file_url?: string
  file_name?: string
  file_type?: string
}

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices' | 'messages' | 'files' | 'support'>('projects')
  const [showSettings, setShowSettings] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [clientAttachment, setClientAttachment] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<Record<string, ProjectSummary[]>>({})
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [projectMilestones, setProjectMilestones] = useState<Record<string, any[]>>({})
  const [projectFiles, setProjectFiles] = useState<any[]>([])
  const [supportSubject, setSupportSubject] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [sendingSupport, setSendingSupport] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()

      // Real-time subscriptions
      const channels = [
        supabase.channel('client-projects-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `client_id=eq.${user.id}` }, fetchData)
          .subscribe(),
        supabase.channel('client-invoices-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices', filter: `client_id=eq.${user.id}` }, fetchData)
          .subscribe(),
        supabase.channel('client-messages-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `client_id=eq.${user.id}` }, fetchData)
          .subscribe()
      ]

      return () => {
        channels.forEach(channel => supabase.removeChannel(channel))
      }
    }
  }, [user])

  const fetchData = async () => {
    if (!user?.id) return
    setLoading(true)
    const [{ data: projectsData }, { data: invoicesData }, { data: messagesData }] = await Promise.all([
      supabase.from('projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
      supabase.from('messages').select('*').eq('client_id', user.id).order('created_at', { ascending: true })
    ])
    setProjects(projectsData || [])
    setInvoices(invoicesData || [])
    setMessages(messagesData || [])
    setLoading(false)

    // Fetch summaries and milestones for all projects
    const projectIds = (projectsData || []).map((p: Project) => p.id).filter(Boolean)
    if (projectIds.length > 0) {
      const [{ data: summaryData }, { data: milestoneData }, { data: filesData }] = await Promise.all([
        supabase.from('project_summaries').select('*').in('project_id', projectIds).order('date', { ascending: false }).limit(100),
        supabase.from('project_milestones').select('*').in('project_id', projectIds).order('sort_order'),
        supabase.from('project_files').select('*').in('project_id', projectIds).order('created_at', { ascending: false })
      ])
      setProjectFiles(filesData || [])
      
      if (summaryData) {
        const grouped: Record<string, ProjectSummary[]> = {}
        summaryData.forEach((s: ProjectSummary) => {
          if (!grouped[s.project_id]) grouped[s.project_id] = []
          grouped[s.project_id].push(s)
        })
        setSummaries(grouped)
      }
      if (milestoneData) {
        const grouped: Record<string, any[]> = {}
        milestoneData.forEach((m: any) => {
          if (!grouped[m.project_id]) grouped[m.project_id] = []
          grouped[m.project_id].push(m)
        })
        setProjectMilestones(grouped)
      }
    }
  }

  const handlePayInvoice = async (invoiceId: string) => {
    setPayingInvoice(invoiceId)
    try {
      const url = await createCheckoutSession(invoiceId)
      if (url) {
        window.location.href = url
      } else {
        toast.error('Payment service unavailable. Please try again later.')
      }
    } catch {
      toast.error('Failed to initiate payment.')
    }
    setPayingInvoice(null)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && !clientAttachment) || !user) return
    
    let file_url = null, file_name = null, file_type = null
    if (clientAttachment) {
      const ext = clientAttachment.name.split('.').pop()
      const path = `chat/${user.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('project-files').upload(path, clientAttachment)
      if (upErr) { toast.error('Failed to upload file'); return }
      const { data: urlData } = supabase.storage.from('project-files').getPublicUrl(path)
      file_url = urlData.publicUrl
      file_name = clientAttachment.name
      file_type = clientAttachment.type
    }
    
    await supabase.from('messages').insert({
      client_id: user.id,
      sender: 'client',
      content: newMessage.trim() || (file_name ? `Sent a file: ${file_name}` : ''),
      file_url, file_name, file_type
    })
    setNewMessage('')
    setClientAttachment(null)
    fetchData()
  }

  const handleDownloadInvoice = async (invoice: Invoice) => {
    const doc = new jsPDF()
    const pw = 210
    const pink = [255, 0, 110] as const
    const dark = [30, 30, 30] as const
    const grey = [120, 120, 120] as const
    const light = [180, 180, 180] as const

    // Header bar
    doc.setFillColor(...pink)
    doc.rect(0, 0, pw, 4, 'F')

    // Company info
    doc.setTextColor(...dark)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('SITES THAT SLAP', 20, 22)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grey)
    doc.text('Gedker Ltd  •  Leeds, West Yorkshire', 20, 28)
    doc.text('hello@sitesthatslap.com  •  www.sitesthatslap.com', 20, 33)

    // INVOICE title
    doc.setTextColor(...pink)
    doc.setFontSize(32)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', pw - 20, 22, { align: 'right' })

    // Invoice meta
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grey)
    doc.text(`Invoice:  ${invoice.invoice_number}`, pw - 20, 30, { align: 'right' })
    doc.text(`Date:  ${new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, pw - 20, 35, { align: 'right' })
    doc.text(`Due:  ${new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, pw - 20, 40, { align: 'right' })

    // Divider
    doc.setDrawColor(230, 230, 230)
    doc.line(20, 46, pw - 20, 46)

    // Bill To
    doc.setTextColor(...light)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO', 20, 55)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    doc.setFontSize(11)
    doc.text(user?.name || 'Client', 20, 62)
    if (user?.email) { doc.setFontSize(9); doc.setTextColor(...grey); doc.text(user.email, 20, 68) }
    if (user?.company_name) { doc.setFontSize(9); doc.setTextColor(...grey); doc.text(user.company_name, 20, 74) }

    // Status badge
    const statusColors: Record<string, [number, number, number]> = { paid: [16, 185, 129], pending: [245, 158, 11], overdue: [239, 68, 68] }
    const sc = statusColors[invoice.status] || [120, 120, 120]
    doc.setFillColor(...sc)
    doc.roundedRect(pw - 55, 52, 35, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(invoice.status.toUpperCase(), pw - 37.5, 58.5, { align: 'center' })

    // Fetch line items
    const { data: items } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id).order('created_at')
    const lineItems = items || []

    // Table header
    let y = 88
    doc.setFillColor(245, 245, 250)
    doc.rect(20, y - 5, pw - 40, 10, 'F')
    doc.setTextColor(...grey)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('DESCRIPTION', 24, y + 1)
    doc.text('QTY', 120, y + 1, { align: 'center' })
    doc.text('RATE', 145, y + 1, { align: 'right' })
    doc.text('AMOUNT', pw - 24, y + 1, { align: 'right' })
    y += 12

    // Table rows
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    if (lineItems.length > 0) {
      lineItems.forEach((item: any) => {
        doc.setTextColor(...dark)
        doc.text(item.description || '', 24, y)
        doc.text(String(item.quantity), 120, y, { align: 'center' })
        doc.text(`£${Number(item.rate).toLocaleString()}`, 145, y, { align: 'right' })
        doc.text(`£${Number(item.amount).toLocaleString()}`, pw - 24, y, { align: 'right' })
        doc.setDrawColor(240, 240, 240)
        doc.line(20, y + 3, pw - 20, y + 3)
        y += 10
      })
    } else {
      doc.setTextColor(...dark)
      doc.text('Web design & development services', 24, y)
      doc.text('1', 120, y, { align: 'center' })
      doc.text(`£${invoice.amount.toLocaleString()}`, 145, y, { align: 'right' })
      doc.text(`£${invoice.amount.toLocaleString()}`, pw - 24, y, { align: 'right' })
      y += 10
    }

    // Totals
    y += 5
    doc.setDrawColor(200, 200, 200)
    doc.line(120, y, pw - 20, y)
    y += 8
    doc.setTextColor(...grey)
    doc.setFontSize(9)
    doc.text('Subtotal', 130, y)
    doc.setTextColor(...dark)
    doc.text(`£${invoice.amount.toLocaleString()}`, pw - 24, y, { align: 'right' })
    y += 7
    doc.setTextColor(...grey)
    doc.text('VAT (0%)', 130, y)
    doc.setTextColor(...dark)
    doc.text('£0.00', pw - 24, y, { align: 'right' })
    y += 3
    doc.setDrawColor(...pink)
    doc.setLineWidth(0.5)
    doc.line(120, y, pw - 20, y)
    y += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...pink)
    doc.text('TOTAL', 130, y)
    doc.text(`£${invoice.amount.toLocaleString()}`, pw - 24, y, { align: 'right' })

    // Footer
    const fy = 265
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(0.3)
    doc.line(20, fy, pw - 20, fy)
    doc.setTextColor(...light)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Payment is due within 14 days of the invoice date.', 20, fy + 6)
    doc.text('Bank: Gedker Ltd  •  Sort: Please contact for details', 20, fy + 11)
    doc.setTextColor(...pink)
    doc.setFont('helvetica', 'bold')
    doc.text('Thank you for choosing Sites That Slap!', pw / 2, fy + 20, { align: 'center' })

    doc.save(`${invoice.invoice_number}.pdf`)
  }

  const handleSupportRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supportSubject.trim() || !supportMessage.trim() || !user) return
    setSendingSupport(true)
    
    await supabase.from('messages').insert({
      client_id: user.id,
      sender: 'client',
      content: `🎫 Support Request: ${supportSubject}\n\n${supportMessage}`
    })
    toast.success('Support request sent! We\'ll get back to you shortly.')
    setSupportSubject('')
    setSupportMessage('')
    setSendingSupport(false)
    fetchData()
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const unreadCount = messages.filter((m: Message) => m.sender === 'admin' && !m.read).length

  const getDaysUntilDeadline = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff
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
            <NotificationBell />
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
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
            { 
              label: 'Active Projects', 
              value: projects.filter((p: Project) => ['in_progress', 'review'].includes(p.status)).length.toString(), 
              icon: CheckCircle2, 
              color: 'text-green-400' 
            },
            { 
              label: 'Pending Invoices', 
              value: '£' + invoices.filter((i: Invoice) => i.status === 'pending').reduce((sum: number, i: Invoice) => sum + i.amount, 0).toLocaleString(), 
              icon: Clock, 
              color: 'text-yellow-400' 
            },
            { 
              label: 'Total Spent', 
              value: '£' + invoices.filter((i: Invoice) => i.status === 'paid').reduce((sum: number, i: Invoice) => sum + i.amount, 0).toLocaleString(), 
              icon: CreditCard, 
              color: 'text-cyan-400' 
            },
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

        {/* Tabs - Mobile Scrollable */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {([
            { key: 'projects' as const, label: 'Projects', icon: CheckCircle2 },
            { key: 'invoices' as const, label: 'Invoices', icon: FileText },
            { key: 'messages' as const, label: 'Messages', icon: MessageSquare },
            { key: 'files' as const, label: 'Files', icon: FolderOpen },
            { key: 'support' as const, label: 'Support', icon: HelpCircle },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={async () => {
                setActiveTab(tab.key)
                if (tab.key === 'messages' && user) {
                  await supabase.from('messages').update({ read: true }).eq('client_id', user.id).eq('sender', 'admin').eq('read', false)
                  await supabase.from('notifications').delete().eq('user_id', user.id).ilike('title', '%message%')
                  fetchData()
                }
              }}
              className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.key === 'messages' && unreadCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-neon rounded-2xl p-6">
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Your Projects</h2>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                </div>
              ) : projects.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No projects yet</p>
              ) : (
                projects.map((project: Project) => {
                  const projectSummaries = summaries[project.id] || []
                  const isExpanded = expandedProject === project.id
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-white">{project.name}</h3>
                            {project.github_repo_url && (
                              <a
                                href={project.github_repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                                title="View on GitHub"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            project.status === 'review' ? 'bg-blue-500/20 text-blue-400' :
                            project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {project.status.replace('_', ' ')}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-slate-400 mb-3">{project.description}</p>
                        )}
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                          <div 
                            className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>{project.progress}% Complete</span>
                          {(() => {
                            const days = getDaysUntilDeadline(project.deadline)
                            if (project.status === 'completed') return <span className="text-green-400">✓ Completed</span>
                            if (days < 0) return <span className="text-red-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {Math.abs(days)} days overdue</span>
                            if (days <= 7) return <span className="text-yellow-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {days} day{days !== 1 ? 's' : ''} left</span>
                            return <span>Due: {new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          })()}
                        </div>

                        {/* Milestones */}
                        {(projectMilestones[project.id] || []).length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            <p className="text-xs text-slate-500 font-bold flex items-center gap-1"><Target className="w-3 h-3" /> Milestones</p>
                            {(projectMilestones[project.id] || []).map((m: any) => (
                              <div key={m.id} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center ${m.status === 'completed' ? 'bg-green-500' : 'border border-white/20'}`}>
                                  {m.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-sm ${m.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{m.title}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Daily Updates Toggle */}
                        {projectSummaries.length > 0 && (
                          <button
                            onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                            className="mt-3 flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors"
                          >
                            <CalendarDays className="w-4 h-4" />
                            Daily Updates ({projectSummaries.length})
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      {/* Expanded Daily Summaries */}
                      {isExpanded && projectSummaries.length > 0 && (
                        <div className="border-t border-white/10 bg-white/[0.02]">
                          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                            {projectSummaries.slice(0, 14).map((s) => (
                              <div key={s.id} className="relative pl-6">
                                <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                                <div className="absolute left-[5px] top-4 w-[2px] h-[calc(100%+8px)] bg-white/10 last:hidden" />
                                <p className="text-xs text-slate-500 mb-1">
                                  {new Date(s.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                                  {s.commit_count > 0 && (
                                    <span className="ml-2 text-pink-400/60">{s.commit_count} update{s.commit_count === 1 ? '' : 's'}</span>
                                  )}
                                </p>
                                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{s.summary}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Invoices</h2>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                </div>
              ) : invoices.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No invoices yet</p>
              ) : (
                invoices.map((invoice: Invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      invoice.status === 'overdue' ? 'bg-red-500/5 border-red-500/30' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        invoice.status === 'overdue' ? 'bg-red-500/10' : 'bg-white/5'
                      }`}>
                        {invoice.status === 'overdue' ? (
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        ) : (
                          <FileText className="w-6 h-6 text-pink-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">{invoice.invoice_number}</p>
                        <p className="text-sm text-slate-400">{new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        {invoice.status !== 'paid' && (
                          <p className={`text-xs mt-0.5 ${invoice.status === 'overdue' ? 'text-red-400' : 'text-slate-500'}`}>
                            Due: {new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xl font-black text-white">£{invoice.amount.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' : 
                          invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button 
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status !== 'paid' && (
                          <button 
                            onClick={() => handlePayInvoice(invoice.id)}
                            disabled={payingInvoice === invoice.id}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold disabled:opacity-50"
                          >
                            {payingInvoice === invoice.id ? '...' : 'Pay'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-col h-[calc(100vh-280px)]">
              <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
              
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No messages yet</p>
                    <p className="text-slate-500 text-sm mt-2">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((message: Message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'client' 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md' 
                          : 'bg-white/10 text-white rounded-bl-md'
                      }`}>
                        {message.file_url && (
                          message.file_type?.startsWith('image/') ? (
                            <a href={message.file_url} target="_blank" rel="noopener noreferrer">
                              <img src={message.file_url} alt={message.file_name} className="max-w-[300px] rounded-lg mb-2 hover:opacity-80 transition-opacity" />
                            </a>
                          ) : (
                            <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-black/20 mb-2 hover:bg-black/30 transition-colors">
                              <FileIcon className="w-4 h-4 shrink-0" />
                              <span className="text-sm truncate">{message.file_name}</span>
                              <Download className="w-3.5 h-3.5 shrink-0 ml-auto" />
                            </a>
                          )
                        )}
                        {message.content && !message.content.startsWith('Sent a file:') && <p>{message.content}</p>}
                        <p className={`text-xs mt-1 ${message.sender === 'client' ? 'text-white/70' : 'text-slate-400'}`}>
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {message.sender === 'admin' && !message.read && (
                            <span className="ml-2 text-pink-400">• New</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div>
                {clientAttachment && (
                  <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/5">
                    <Paperclip className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-slate-300 truncate flex-1">{clientAttachment.name}</span>
                    <button onClick={() => setClientAttachment(null)} className="text-slate-400 hover:text-red-400"><X className="w-4 h-4" /></button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <label className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                    <Paperclip className="w-5 h-5" />
                    <input type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setClientAttachment(e.target.files[0]) }} />
                  </label>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() && !clientAttachment}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Project Files</h2>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                </div>
              ) : projectFiles.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No files shared yet</p>
                  <p className="text-slate-500 text-sm mt-2">Files uploaded by the team will appear here</p>
                </div>
              ) : (
                projects.map((project: Project) => {
                  const files = projectFiles.filter((f: any) => f.project_id === project.id)
                  if (files.length === 0) return null
                  return (
                    <div key={project.id}>
                      <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{project.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {files.map((file: any) => {
                          const { data: urlData } = supabase.storage.from('project-files').getPublicUrl(file.file_path)
                          const isImage = file.file_name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
                          return (
                            <a
                              key={file.id}
                              href={urlData.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                {isImage ? (
                                  <img src={urlData.publicUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                ) : (
                                  <FileIcon className="w-5 h-5 text-pink-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{file.file_name}</p>
                                <p className="text-xs text-slate-500">{new Date(file.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-2">Support Request</h2>
              <p className="text-slate-400 text-sm">Need help? Submit a request and we'll respond within 24 hours.</p>
              
              <form onSubmit={handleSupportRequest} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="e.g. Change to homepage design"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-1.5">Message</label>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe what you need..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingSupport || !supportSubject.trim() || !supportMessage.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingSupport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sendingSupport ? 'Sending...' : 'Send Request'}
                </button>
              </form>

              <div className="border-t border-white/10 pt-6 mt-6">
                <h3 className="font-bold text-white mb-3">Other ways to reach us</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a href="mailto:hello@sitesthatslap.com" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-pink-400" /></div>
                    <div>
                      <p className="text-sm font-semibold text-white">Email Us</p>
                      <p className="text-xs text-slate-400">hello@sitesthatslap.com</p>
                    </div>
                  </a>
                  <button onClick={() => setActiveTab('messages')} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Send className="w-5 h-5 text-purple-400" /></div>
                    <div>
                      <p className="text-sm font-semibold text-white">Live Chat</p>
                      <p className="text-xs text-slate-400">Send us a direct message</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
