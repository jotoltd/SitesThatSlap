import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { 
  Users, FileText, Plus, LogOut, DollarSign, TrendingUp,
  CheckCircle, XCircle, Clock, Send, Trash2, Edit2,
  Search, Filter, Download, Menu, X, Loader2, MessageSquare, Upload,
  CalendarDays, LayoutGrid, Github, Settings, Activity,
  KeyRound, Eye, EyeOff, Copy, Paperclip, FileIcon, Target, RefreshCw, Pause, Play, Phone, Mail, List
} from 'lucide-react'
import { NotificationBell } from '../components/Notifications'
import SettingsModal from '../components/SettingsModal'
import ActivityLog, { useActivityLog } from '../components/ActivityLog'
import { sendEmail, clientWelcomeEmail, invoiceNotificationEmail } from '../lib/email'

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

interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  amount: number
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
  items?: InvoiceItem[]
}

interface Project {
  id: string
  client_id: string
  name: string
  description: string
  status: 'in_progress' | 'review' | 'completed' | 'on_hold'
  progress: number
  deadline: string
  github_repo_url?: string
  github_branch?: string
  client?: Client
}

interface Lead {
  id: string
  name: string
  email?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted'
  source?: string
  notes?: string
  website?: string
  lead_type?: 'website_design' | 'website_redesign' | 'error_fixing' | 'maintenance' | 'consulting' | 'other'
  contact_method?: 'they_contacted_me' | 'i_found_them'
  how_found?: string
  estimated_value?: number
  follow_up_date?: string
  lead_score?: number
  assigned_to?: string
  conversion_probability?: number
  client_id?: string
  converted_to_project_id?: string
  created_at: string
  updated_at: string
  client?: Client
  assigned_user?: Client
  interactions?: LeadInteraction[]
}

interface LeadInteraction {
  id: string
  lead_id: string
  type: 'call' | 'email'
  outcome?: 'answered' | 'no_answer' | 'voicemail' | 'replied' | 'no_reply' | 'interested' | 'not_interested' | 'follow_up'
  notes?: string
  created_at: string
}

interface ProjectSummary {
  id: string
  project_id: string
  summary: string
  commit_count: number
  commits_data: any
  date: string
  created_at: string
}

interface Message {
  id: string
  client_id: string
  sender: 'client' | 'admin'
  content: string
  read: boolean
  created_at: string
  client?: Client
  file_url?: string
  file_name?: string
  file_type?: string
}

interface ProjectFile {
  id: string
  project_id: string
  file_name: string
  file_path: string
  file_size: number
  created_at: string
}

interface ProjectComment {
  id: string
  project_id: string
  user_id: string
  content: string
  type: 'comment' | 'status_change' | 'file_upload' | 'milestone'
  created_at: string
  user?: Client
}

interface Credential {
  id: string
  client_id: string
  label: string
  credential_type: 'api_key' | 'password' | 'token' | 'ssh_key' | 'hosting' | 'domain' | 'database' | 'email' | 'other'
  value: string
  username?: string
  url?: string
  notes?: string
  created_at: string
  updated_at: string
}

const credentialTypeLabels: Record<string, string> = {
  api_key: 'API Key',
  password: 'Password',
  token: 'Token',
  ssh_key: 'SSH Key',
  hosting: 'Hosting',
  domain: 'Domain',
  database: 'Database',
  email: 'Email',
  other: 'Other',
}

export default function AdminDashboard() {
  const { user, logout, setSuppressAuthChange } = useAuth()
  const { logActivity } = useActivityLog()
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'invoices' | 'projects' | 'messages' | 'calendar' | 'kanban' | 'activity' | 'quotes' | 'contacts' | 'recurring' | 'leads'>('overview')
  const [showSettings, setShowSettings] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showInteractionModal, setShowInteractionModal] = useState(false)
  const [interactionLead, setInteractionLead] = useState<Lead | null>(null)
  const [interactionType, setInteractionType] = useState<'call' | 'email'>('call')
  const [editingInteraction, setEditingInteraction] = useState<LeadInteraction | null>(null)
  const [leadSearchTerm, setLeadSearchTerm] = useState('')
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>('all')
  const [leadFilterType, setLeadFilterType] = useState<string>('all')
  const [expandedInteractions, setExpandedInteractions] = useState<Set<string>>(new Set())
  const [leadViewMode, setLeadViewMode] = useState<'list' | 'kanban'>('list')
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const [reportYear, setReportYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)
  const [invoiceItems, setInvoiceItems] = useState<{ description: string; quantity: number; rate: number }[]>([
    { description: '', quantity: 1, rate: 0 }
  ])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClientForMessages, setSelectedClientForMessages] = useState<string | null>(null)
  const [newAdminMessage, setNewAdminMessage] = useState('')
  const [selectedProjectForFiles, setSelectedProjectForFiles] = useState<string | null>(null)
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedProjectForComments, setSelectedProjectForComments] = useState<string | null>(null)
  const [projectComments, setProjectComments] = useState<ProjectComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [selectedProjectForGitHub, setSelectedProjectForGitHub] = useState<string | null>(null)
  const [projectSummaries, setProjectSummaries] = useState<ProjectSummary[]>([])
  const [githubLoading, setGithubLoading] = useState(false)
  const [githubToken, setGithubToken] = useState('')
  const [selectedProjectForCreds, setSelectedProjectForCreds] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [showAddCred, setShowAddCred] = useState(false)
  const [visibleCreds, setVisibleCreds] = useState<Set<string>>(new Set())
  const [adminAttachment, setAdminAttachment] = useState<File | null>(null)
  const [milestones, setMilestones] = useState<any[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([])
  const [quoteRequests, setQuoteRequests] = useState<any[]>([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [recurringPlans, setRecurringPlans] = useState<any[]>([])
  const [recurringLoading, setRecurringLoading] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [editingRecurring, setEditingRecurring] = useState<any | null>(null)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | string[]>('all')
  const [sendingBroadcast, setSendingBroadcast] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [editingClientNote, setEditingClientNote] = useState<string | null>(null)
  const [clientNoteValue, setClientNoteValue] = useState('')
  const [stripeMode, setStripeMode] = useState<'sandbox' | 'live'>('sandbox')
  const [savingStripeMode, setSavingStripeMode] = useState(false)

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

  useEffect(() => {
    if (activeTab === 'contacts') fetchContacts()
    if (activeTab === 'quotes') fetchQuotes()
    if (activeTab === 'recurring') fetchRecurringPlans()
    if (activeTab === 'leads') fetchLeads()
  }, [activeTab])

  useEffect(() => { fetchStripeMode() }, [])

  const fetchStripeMode = async () => {
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'stripe_mode').single()
    if (data?.value) setStripeMode(data.value as 'sandbox' | 'live')
  }

  const handleSaveStripeMode = async (mode: 'sandbox' | 'live') => {
    setSavingStripeMode(true)
    setStripeMode(mode)
    await supabase.from('app_settings').upsert({ key: 'stripe_mode', value: mode, updated_at: new Date().toISOString() })
    toast.success(`Stripe switched to ${mode === 'live' ? '🟢 Live' : '🟡 Sandbox'} mode`)
    setSavingStripeMode(false)
  }

  const fetchRecurringPlans = async () => {
    setRecurringLoading(true)
    const { data } = await supabase
      .from('recurring_plans')
      .select('*, project:projects(name), client:profiles(name, email)')
      .order('created_at', { ascending: false })
    setRecurringPlans(data || [])
    setRecurringLoading(false)
  }

  const handleSaveRecurring = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    const startDate = fd.get('start_date') as string
    const payload = {
      project_id: fd.get('project_id') as string,
      client_id: projects.find(p => p.id === (fd.get('project_id') as string))?.client_id || '',
      description: fd.get('description') as string,
      amount: Number(fd.get('amount')),
      interval: fd.get('interval') as string,
      start_date: startDate,
      next_invoice_date: startDate,
      end_date: (fd.get('end_date') as string) || null,
      status: 'active',
    }
    if (!payload.client_id) { toast.error('Project has no client assigned'); return }
    if (editingRecurring) {
      await supabase.from('recurring_plans').update(payload).eq('id', editingRecurring.id)
      toast.success('Recurring plan updated')
    } else {
      await supabase.from('recurring_plans').insert(payload)
      toast.success('Recurring plan created')
    }
    setShowRecurringModal(false)
    setEditingRecurring(null)
    form.reset()
    fetchRecurringPlans()
  }

  const handleToggleRecurring = async (plan: any) => {
    const newStatus = plan.status === 'active' ? 'paused' : 'active'
    await supabase.from('recurring_plans').update({ status: newStatus }).eq('id', plan.id)
    toast.success(`Plan ${newStatus}`)
    fetchRecurringPlans()
  }

  const handleCancelRecurring = async (id: string) => {
    if (!confirm('Cancel this recurring plan? This cannot be undone.')) return
    await supabase.from('recurring_plans').update({ status: 'cancelled' }).eq('id', id)
    toast.success('Recurring plan cancelled')
    fetchRecurringPlans()
  }

  const handleRunRecurringNow = async () => {
    const { error } = await supabase.functions.invoke('generate-recurring-invoices')
    if (error) toast.error('Failed to run: ' + error.message)
    else toast.success('Recurring invoices generated')
  }

  const fetchLeads = async () => {
    setLeadsLoading(true)
    const { data } = await supabase
      .from('leads')
      .select('*, client:profiles(name, email), assigned_user:profiles(name, email), interactions:lead_interactions(*)')
      .order('created_at', { ascending: false })
    setLeads(data || [])
    setLeadsLoading(false)
  }

  const handleSaveLead = async (formData: FormData) => {
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || null,
      company: formData.get('company') as string || null,
      status: formData.get('status') as string,
      source: formData.get('source') as string || null,
      notes: formData.get('notes') as string || null,
      website: formData.get('website') as string || null,
      lead_type: formData.get('lead_type') as string || null,
      contact_method: formData.get('contact_method') as string || null,
      how_found: formData.get('how_found') as string || null,
      estimated_value: formData.get('estimated_value') ? Number(formData.get('estimated_value')) : null,
      follow_up_date: formData.get('follow_up_date') as string || null,
      lead_score: formData.get('lead_score') ? Number(formData.get('lead_score')) : null,
      assigned_to: formData.get('assigned_to') as string || null,
      conversion_probability: formData.get('conversion_probability') ? Number(formData.get('conversion_probability')) : null,
      client_id: formData.get('client_id') as string || null,
    }
    
    let leadId = editingLead?.id
    let isConverting = payload.status === 'converted' && editingLead?.status !== 'converted'
    
    if (editingLead) {
      await supabase.from('leads').update(payload).eq('id', editingLead.id)
      toast.success('Lead updated')
    } else {
      const { data } = await supabase.from('leads').insert(payload).select().single()
      leadId = data?.id
      isConverting = payload.status === 'converted'
      toast.success('Lead created')
    }
    
    // Auto-create client and project when lead is converted
    if (isConverting && leadId) {
      let clientId = payload.client_id
      
      // Create client if not already linked
      if (!clientId && payload.email) {
        const { data: newClient } = await supabase.from('profiles').insert({
          name: payload.name,
          email: payload.email,
          role: 'client'
        }).select().single()
        clientId = newClient?.id
        
        // Update lead with client_id
        await supabase.from('leads').update({ client_id: clientId }).eq('id', leadId)
      }
      
      // Create project
      if (clientId) {
        await supabase.from('projects').insert({
          name: payload.company || `${payload.name}'s Project`,
          description: `Converted from lead: ${payload.notes || 'No notes'}`,
          client_id: clientId,
          status: 'in_progress',
          lead_id: leadId
        })
        toast.success('Client and project created from lead')
      }
    }
    
    setShowLeadModal(false)
    setEditingLead(null)
    fetchLeads()
    fetchData()
  }

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    toast.success('Lead deleted')
    fetchLeads()
  }

  const handleConvertToProject = async (lead: Lead) => {
    if (!confirm('Convert this lead to a project?')) return
    const { data: project } = await supabase.from('projects').insert({
      client_id: lead.client_id || null,
      name: lead.company || lead.name,
      description: lead.notes || '',
      status: 'in_progress',
      progress: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }).select().single()
    if (project) {
      await supabase.from('leads').update({ status: 'converted', converted_to_project_id: project.id }).eq('id', lead.id)
      toast.success('Lead converted to project')
      fetchLeads()
      const { data: projectsData } = await supabase.from('projects').select('*, client:profiles(name, email)').order('created_at', { ascending: false })
      setProjects(projectsData || [])
    }
  }

  const handleSaveInteraction = async (formData: FormData) => {
    if (!interactionLead) return
    const payload = {
      lead_id: interactionLead.id,
      type: interactionType,
      outcome: formData.get('outcome') as string || null,
      notes: formData.get('notes') as string || null,
    }
    if (editingInteraction) {
      await supabase.from('lead_interactions').update(payload).eq('id', editingInteraction.id)
      toast.success('Interaction updated')
    } else {
      await supabase.from('lead_interactions').insert(payload)
      toast.success(`${interactionType === 'call' ? 'Call' : 'Email'} logged`)
    }
    
    // Auto-update lead score based on interactions
    await autoUpdateLeadScore(interactionLead.id)
    
    setShowInteractionModal(false)
    setInteractionLead(null)
    setEditingInteraction(null)
    fetchLeads()
  }

  const autoUpdateLeadScore = async (leadId: string) => {
    const { data: interactions } = await supabase
      .from('lead_interactions')
      .select('*')
      .eq('lead_id', leadId)
    
    if (!interactions || interactions.length === 0) return
    
    let score = 1 // Base score
    
    interactions.forEach((interaction: any) => {
      // Positive outcomes increase score
      if (interaction.outcome === 'interested') score += 1
      if (interaction.outcome === 'answered') score += 0.5
      if (interaction.outcome === 'replied') score += 0.5
      
      // Negative outcomes decrease score
      if (interaction.outcome === 'not_interested') score -= 1
      if (interaction.outcome === 'no_answer') score -= 0.2
      if (interaction.outcome === 'no_reply') score -= 0.2
      
      // Follow-up indicates engagement
      if (interaction.outcome === 'follow_up') score += 0.3
    })
    
    // Cap score between 1 and 5
    score = Math.max(1, Math.min(5, Math.round(score * 10) / 10))
    
    await supabase.from('leads').update({ lead_score: score }).eq('id', leadId)
  }

  const handleDeleteInteraction = async (interactionId: string) => {
    if (!confirm('Delete this interaction?')) return
    await supabase.from('lead_interactions').delete().eq('id', interactionId)
    toast.success('Interaction deleted')
    fetchLeads()
  }

  const handleExportLeads = () => {
    const filteredLeads = leads.filter(lead => {
      const matchesSearch = !leadSearchTerm ||
        lead.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(leadSearchTerm.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(leadSearchTerm.toLowerCase()))
      const matchesStatus = leadFilterStatus === 'all' || lead.status === leadFilterStatus
      const matchesType = leadFilterType === 'all' || lead.lead_type === leadFilterType
      return matchesSearch && matchesStatus && matchesType
    })

    const headers = ['Name', 'Email', 'Company', 'Status', 'Lead Type', 'Contact Method', 'Source', 'Estimated Value', 'Lead Score', 'Conversion Probability', 'Follow-up Date', 'Assigned To', 'Notes', 'Created At']
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email || '',
      lead.company || '',
      lead.status,
      lead.lead_type || '',
      lead.contact_method || '',
      lead.source || '',
      lead.estimated_value || '',
      lead.lead_score || '',
      lead.conversion_probability || '',
      lead.follow_up_date || '',
      lead.assigned_user?.name || '',
      lead.notes || '',
      new Date(lead.created_at).toLocaleDateString('en-GB')
    ])

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Leads exported to CSV')
  }

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
    if ((!newAdminMessage.trim() && !adminAttachment) || !selectedClientForMessages) return
    
    let file_url = null, file_name = null, file_type = null
    if (adminAttachment) {
      const ext = adminAttachment.name.split('.').pop()
      const path = `chat/${selectedClientForMessages}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('project-files').upload(path, adminAttachment)
      if (upErr) { toast.error('Failed to upload file'); return }
      const { data: urlData } = supabase.storage.from('project-files').getPublicUrl(path)
      file_url = urlData.publicUrl
      file_name = adminAttachment.name
      file_type = adminAttachment.type
    }
    
    await supabase.from('messages').insert({
      client_id: selectedClientForMessages,
      sender: 'admin',
      content: newAdminMessage.trim() || (file_name ? `Sent a file: ${file_name}` : ''),
      file_url, file_name, file_type
    })
    logActivity('messaged', 'message', selectedClientForMessages, '', adminAttachment ? 'Sent file attachment' : 'Sent message')
    setNewAdminMessage('')
    setAdminAttachment(null)
    fetchData()
  }

  const fetchProjectComments = async (projectId: string) => {
    const { data } = await supabase
      .from('project_comments')
      .select('*, user:profiles(name)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
    setProjectComments(data || [])
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !selectedProjectForComments) return
    
    await supabase.from('project_comments').insert({
      project_id: selectedProjectForComments,
      user_id: user?.id,
      content: newComment.trim(),
      type: 'comment'
    })
    setNewComment('')
    fetchProjectComments(selectedProjectForComments)
    toast.success('Comment added')
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

  // GitHub Integration Functions
  const extractGitHubInfo = (repoUrl: string) => {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/)
    if (!match) return null
    return { owner: match[1], repo: match[2] }
  }

  const fetchGitHubCommits = async (project: Project, since?: string, until?: string) => {
    if (!project.github_repo_url) {
      toast.error('No GitHub repo linked to this project')
      return null
    }
    const repoInfo = extractGitHubInfo(project.github_repo_url)
    if (!repoInfo) {
      toast.error('Invalid GitHub repo URL')
      return null
    }
    setGithubLoading(true)
    try {
      let url = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?sha=${project.github_branch || 'main'}&per_page=100`
      if (since) url += `&since=${since}`
      if (until) url += `&until=${until}`
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(githubToken && { 'Authorization': `token ${githubToken}` })
        }
      })
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Repo not found. Check URL and make sure it\'s public or provide a GitHub token')
        } else if (response.status === 403) {
          toast.error('GitHub API rate limit exceeded. Please add a GitHub token')
        } else {
          toast.error('Failed to fetch commits from GitHub')
        }
        return null
      }
      const commits = await response.json()
      return commits
    } catch (err) {
      toast.error('Error fetching GitHub commits')
      return null
    } finally {
      setGithubLoading(false)
    }
  }

  const toPlainEnglish = (msg: string): string => {
    let text = msg
      .replace(/^\[.*?\]\s*/, '')
      .replace(/^[a-z]+(\(.*?\))?!?:\s*/i, '')
      .replace(/\(#\d+\)/g, '')
      .trim()
    if (text.length < 4) return ''

    // Remove technical jargon and rephrase
    const replacements: [RegExp, string][] = [
      [/\brefactor(ed|ing)?\b/gi, 'Improved'],
      [/\bimpl(ement|emented|ementing)?\b/gi, 'Added'],
      [/\bRLS\b/gi, 'security settings'],
      [/\bCRUD\b/gi, 'data management'],
      [/\bAPI\b/gi, 'backend'],
      [/\bCSS\b/gi, 'styling'],
      [/\bUI\b/gi, 'interface'],
      [/\bUX\b/gi, 'user experience'],
      [/\bSEO\b/gi, 'search engine visibility'],
      [/\bCI\/CD\b/gi, 'deployment pipeline'],
      [/\bdeps?\b/gi, 'dependencies'],
      [/\bnpm\b/gi, 'package'],
      [/\bcomponent(s)?\b/gi, 'section$1'],
      [/\bendpoint(s)?\b/gi, 'feature$1'],
      [/\bmigration(s)?\b/gi, 'database update$1'],
      [/\bschema\b/gi, 'database structure'],
      [/\bwebhook(s)?\b/gi, 'notification$1'],
      [/\bmerge(d)?\s+(branch|pr|pull\s*request)\b/gi, 'Combined latest changes'],
      [/\blint(ing|er)?\b/gi, 'code quality'],
      [/\btsx?\b/gi, 'code'],
      [/\benv\b/gi, 'configuration'],
    ]
    replacements.forEach(([pattern, replacement]) => {
      text = text.replace(pattern, replacement)
    })

    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const summarizeCommits = async (commits: any[]): Promise<string> => {
    if (commits.length === 0) return 'No updates today — the team is planning the next steps.'

    const buckets: Record<string, string[]> = {
      'New features': [],
      'Design & visual improvements': [],
      'Bugs fixed': [],
      'Performance improvements': [],
      'General improvements': [],
    }

    commits.forEach(c => {
      const raw = c.commit.message.split('\n')[0]
      const friendly = toPlainEnglish(raw)
      if (!friendly) return
      const lower = raw.toLowerCase()

      if (lower.match(/fix|bug|issue|resolve|patch|crash|error/)) {
        buckets['Bugs fixed'].push(friendly)
      } else if (lower.match(/style|css|ui|design|layout|color|font|responsive|mobile|animation/)) {
        buckets['Design & visual improvements'].push(friendly)
      } else if (lower.match(/feat|add|new|create|implement|introduce|build/)) {
        buckets['New features'].push(friendly)
      } else if (lower.match(/perf|speed|optimi|cache|lazy|bundle|compress|fast/)) {
        buckets['Performance improvements'].push(friendly)
      } else {
        buckets['General improvements'].push(friendly)
      }
    })

    const lines: string[] = []
    const totalAreas = Object.values(buckets).filter(b => b.length > 0).length

    if (commits.length === 1) {
      lines.push('We made a focused update to your project today.')
    } else if (commits.length <= 5) {
      lines.push(`Good progress today — ${commits.length} updates across ${totalAreas} area${totalAreas === 1 ? '' : 's'} of your project.`)
    } else {
      lines.push(`Big day! ${commits.length} updates shipped across ${totalAreas} area${totalAreas === 1 ? '' : 's'} of your project.`)
    }

    Object.entries(buckets).forEach(([label, items]) => {
      if (items.length === 0) return
      lines.push('')
      lines.push(`${label}:`)
      items.forEach(item => {
        lines.push(`  • ${item}`)
      })
    })

    return lines.join('\n')
  }

  const generateDailySummary = async (project: Project) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString()
    const commits = await fetchGitHubCommits(project, startOfDay, endOfDay)
    if (!commits) return
    const summary = await summarizeCommits(commits)
    const { error } = await supabase.from('project_summaries').insert({
      project_id: project.id,
      summary,
      commit_count: commits.length,
      commits_data: commits.slice(0, 50),
      date: yesterday.toISOString().split('T')[0]
    })
    if (error) {
      toast.error('Failed to save summary')
    } else {
      toast.success(`Generated summary for ${commits.length} commits`)
      fetchProjectSummaries(project.id)
    }
  }

  const fetchProjectSummaries = async (projectId: string) => {
    const { data } = await supabase
      .from('project_summaries')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false })
      .limit(30)
    setProjectSummaries(data || [])
  }

  const fetchCredentials = async (projectId: string) => {
    const { data } = await supabase
      .from('client_credentials')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    setCredentials(data || [])
    setVisibleCreds(new Set())
  }

  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProjectForCreds) return
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const { error } = await supabase.from('client_credentials').insert({
      project_id: selectedProjectForCreds,
      label: formData.get('label') as string,
      credential_type: formData.get('credential_type') as string,
      value: formData.get('value') as string,
      username: (formData.get('username') as string) || null,
      url: (formData.get('url') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    if (error) {
      toast.error('Failed to save credential')
    } else {
      toast.success('Credential saved')
      setShowAddCred(false)
      form.reset()
      fetchCredentials(selectedProjectForCreds)
    }
  }

  const handleDeleteCredential = async (credId: string) => {
    if (!confirm('Delete this credential? This cannot be undone.')) return
    const { error } = await supabase.from('client_credentials').delete().eq('id', credId)
    if (error) {
      toast.error('Failed to delete credential')
    } else {
      toast.success('Credential deleted')
      if (selectedProjectForCreds) fetchCredentials(selectedProjectForCreds)
    }
  }

  const fetchMilestones = async (projectId: string) => {
    const { data } = await supabase.from('project_milestones').select('*').eq('project_id', projectId).order('sort_order')
    setMilestones(data || [])
  }

  const addMilestone = async (projectId: string, title: string) => {
    if (!title.trim()) return
    await supabase.from('project_milestones').insert({ project_id: projectId, title, sort_order: milestones.length })
    fetchMilestones(projectId)
  }

  const toggleMilestone = async (id: string, projectId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    await supabase.from('project_milestones').update({ status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null }).eq('id', id)
    fetchMilestones(projectId)
  }

  const deleteMilestone = async (id: string, projectId: string) => {
    await supabase.from('project_milestones').delete().eq('id', id)
    fetchMilestones(projectId)
  }

  const toggleCredVisibility = (credId: string) => {
    setVisibleCreds(prev => {
      const next = new Set(prev)
      if (next.has(credId)) next.delete(credId)
      else next.add(credId)
      return next
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const fetchContacts = async () => {
    setContactsLoading(true)
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    setContactSubmissions(data || [])
    setContactsLoading(false)
  }

  const fetchQuotes = async () => {
    setQuotesLoading(true)
    const { data } = await supabase.from('quotes').select('*').order('created_at', { ascending: false })
    setQuoteRequests(data || [])
    setQuotesLoading(false)
  }

  const updateContactStatus = async (id: string, status: string, admin_notes?: string) => {
    const updates: any = { status }
    if (admin_notes !== undefined) updates.admin_notes = admin_notes
    const { error } = await supabase.from('contact_submissions').update(updates).eq('id', id)
    if (error) toast.error('Failed to update')
    else { toast.success('Updated'); fetchContacts() }
  }

  const updateQuoteStatus = async (id: string, status: string, admin_notes?: string) => {
    const updates: any = { status }
    if (admin_notes !== undefined) updates.admin_notes = admin_notes
    const { error } = await supabase.from('quotes').update(updates).eq('id', id)
    if (error) toast.error('Failed to update')
    else { toast.success('Updated'); fetchQuotes() }
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

  const handleInvoiceStatusToggle = async (invoice: Invoice) => {
    const cycle: Record<string, 'pending' | 'paid' | 'overdue'> = { pending: 'paid', paid: 'overdue', overdue: 'pending' }
    const newStatus = cycle[invoice.status]
    await supabase.from('invoices').update({ status: newStatus }).eq('id', invoice.id)
    logActivity('status_changed', 'invoice', invoice.id, invoice.invoice_number, `Status changed to ${newStatus}`)
    toast.success(`Invoice marked as ${newStatus}`)
    fetchData()
  }

  const handleSendInvoiceReminder = async (invoice: Invoice) => {
    const client = clients.find((c: Client) => c.id === invoice.client_id)
    if (!client) return
    await sendEmail(client.email, `Reminder: Invoice #${invoice.invoice_number} - Sites That Slap`, invoiceNotificationEmail(client.name, invoice.invoice_number, invoice.amount))
    toast.success(`Reminder sent to ${client.email}`)
  }

  const handleQuickProgress = async (project: Project, delta: number) => {
    const newProgress = Math.min(100, Math.max(0, project.progress + delta))
    await supabase.from('projects').update({ progress: newProgress }).eq('id', project.id)
    fetchData()
  }

  const handleSaveClientNote = async (clientId: string) => {
    await supabase.from('profiles').update({ notes: clientNoteValue }).eq('id', clientId)
    setEditingClientNote(null)
    toast.success('Note saved')
    fetchData()
  }

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return
    setSendingBroadcast(true)
    const targets = broadcastTarget === 'all' ? clients : clients.filter((c: Client) => (broadcastTarget as string[]).includes(c.id))
    await Promise.all(targets.map((c: Client) =>
      sendEmail(c.email, broadcastSubject, `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #FF006E;">Sites That Slap</h1>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 30px; border-left: 4px solid #FF006E;">
            <h2>Hi ${c.name},</h2>
            ${broadcastMessage.split('\n').map(l => `<p style="color:#444;line-height:1.6;">${l}</p>`).join('')}
          </div>
          <p style="color:#999;font-size:12px;text-align:center;margin-top:20px;">Sites That Slap (Gedker Ltd) &bull; Leeds, West Yorkshire</p>
        </div>
      `)
    ))
    toast.success(`Sent to ${targets.length} client${targets.length !== 1 ? 's' : ''}`)
    setBroadcastSubject('')
    setBroadcastMessage('')
    setShowBroadcastModal(false)
    setSendingBroadcast(false)
  }

  const globalSearchResults = globalSearch.trim().length > 1 ? {
    clients: clients.filter((c: Client) => [c.name, c.email, c.company_name].some(v => v?.toLowerCase().includes(globalSearch.toLowerCase()))).slice(0, 4),
    invoices: invoices.filter((i: Invoice) => [i.invoice_number, i.client?.name, String(i.amount)].some(v => v?.toLowerCase().includes(globalSearch.toLowerCase()))).slice(0, 4),
    projects: projects.filter((p: Project) => [p.name, p.client?.name, p.description].some(v => v?.toLowerCase().includes(globalSearch.toLowerCase()))).slice(0, 4),
  } : null

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete invoice')
    } else {
      toast.success('Invoice deleted')
      logActivity('deleted', 'invoice', id, '', 'Invoice deleted')
    }
    fetchData()
  }

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Delete client "${name}"?\n\nThis will also delete all their projects, invoices, messages, and credentials. This cannot be undone.`)) return
    
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    
    if (error) {
      toast.error('Failed to delete client: ' + error.message)
    } else {
      toast.success('Client deleted')
      logActivity('deleted', 'client', id, name, 'Client account deleted')
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
      toast.error('Failed to update client')
    } else {
      toast.success('Client updated')
      logActivity('updated', 'client', editingClient.id, editingClient.name, 'Client details updated')
      setEditingClient(null)
      fetchData()
    }
  }

  const handleDownloadInvoice = async (invoice: Invoice, clientName: string) => {
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
    doc.text(clientName || 'Client', 20, 62)
    const client = clients.find((c: Client) => c.id === invoice.client_id)
    if (client?.email) { doc.setFontSize(9); doc.setTextColor(...grey); doc.text(client.email, 20, 68) }
    if (client?.company_name) { doc.setFontSize(9); doc.setTextColor(...grey); doc.text(client.company_name, 20, 74) }

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

  const handleExportCSV = (type: 'invoices' | 'clients' | 'projects') => {
    let data: any[] = []
    let headers: string[] = []
    let filename = ''

    switch (type) {
      case 'invoices':
        data = filteredInvoices.map(inv => ({
          'Invoice Number': inv.invoice_number,
          'Client': inv.client?.name || 'Unknown',
          'Email': inv.client?.email || '',
          'Amount': inv.amount,
          'Status': inv.status,
          'Date': inv.date,
          'Due Date': inv.due_date
        }))
        headers = ['Invoice Number', 'Client', 'Email', 'Amount', 'Status', 'Date', 'Due Date']
        filename = 'invoices.csv'
        break
      case 'clients':
        data = filteredClients.map(client => ({
          'Name': client.name,
          'Email': client.email,
          'Company': client.company_name || '',
          'Phone': client.phone || '',
          'Address': client.address || '',
          'Website': client.website || '',
          'Notes': client.notes || '',
          'Created': client.created_at
        }))
        headers = ['Name', 'Email', 'Company', 'Phone', 'Address', 'Website', 'Notes', 'Created']
        filename = 'clients.csv'
        break
      case 'projects':
        data = filteredProjects.map(proj => ({
          'Name': proj.name,
          'Client': proj.client?.name || 'Unknown',
          'Status': proj.status,
          'Progress': proj.progress + '%',
          'Deadline': proj.deadline,
          'Description': proj.description
        }))
        headers = ['Name', 'Client', 'Status', 'Progress', 'Deadline', 'Description']
        filename = 'projects.csv'
        break
    }

    if (data.length === 0) {
      toast.error('No data to export')
      return
    }

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h]?.toString() || ''
        // Escape quotes and wrap in quotes if contains comma
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val
      }).join(','))
    ].join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success(`${type} exported to CSV`)
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const clientId = formData.get('client_id') as string
    const invoiceNumber = formData.get('invoice_number') as string
    const status = formData.get('status') as 'paid' | 'pending' | 'overdue'
    const date = formData.get('date') as string
    const dueDate = formData.get('due_date') as string
    
    // Calculate total from line items
    const validItems = invoiceItems.filter(item => item.description.trim() && item.rate > 0)
    const totalAmount = validItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
    
    if (validItems.length === 0) {
      toast.error('Please add at least one line item')
      return
    }
    
    // Create invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        client_id: clientId,
        invoice_number: invoiceNumber,
        amount: totalAmount,
        status,
        date,
        due_date: dueDate
      })
      .select()
      .single()
    
    if (invoiceError || !invoiceData) {
      toast.error('Failed to create invoice')
      return
    }
    
    // Create line items
    const itemsToInsert = validItems.map(item => ({
      invoice_id: invoiceData.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate
    }))
    
    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert)
    
    if (itemsError) {
      toast.error('Invoice created but failed to add line items')
    } else {
      toast.success('Invoice created successfully')
      logActivity('created', 'invoice', invoiceData.id, invoiceNumber, `Invoice for £${totalAmount.toLocaleString()}`)
      // Send invoice notification email to client
      const client = clients.find((c: Client) => c.id === clientId)
      if (client) {
        sendEmail(client.email, `New Invoice #${invoiceNumber} - Sites That Slap`, invoiceNotificationEmail(client.name, invoiceNumber, totalAmount))
      }
    }
    
    setShowInvoiceModal(false)
    setInvoiceItems([{ description: '', quantity: 1, rate: 0 }])
    fetchData()
  }

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', quantity: 1, rate: 0 }])
  }

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
  }

  const updateInvoiceItem = (index: number, field: string, value: string | number) => {
    const updated = [...invoiceItems]
    updated[index] = { ...updated[index], [field]: value }
    setInvoiceItems(updated)
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
      deadline: formData.get('deadline') as string,
      github_repo_url: formData.get('github_repo_url') as string || null,
      github_branch: formData.get('github_branch') as string || 'main'
    }

    const { data: projData, error } = await supabase.from('projects').insert(newProject).select().single()
    if (error) {
      toast.error('Failed to create project')
    } else {
      toast.success('Project created successfully')
      logActivity('created', 'project', projData?.id || '', newProject.name, 'New project created')
    }
    setShowProjectModal(false)
    fetchData()
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingClient(true)
    
    // Suppress auth state changes during client creation
    // This prevents the admin from being logged out when signUp() creates the new user
    setSuppressAuthChange(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const password = Array.from(crypto.getRandomValues(new Uint8Array(12))).map(b => 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%'[b % 60]).join('')
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
      // Retry a few times if profile doesn't exist yet
      let profileUpdated = false
      let retries = 0
      const maxRetries = 5
      
      while (!profileUpdated && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500))
        
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

        if (!updateError) {
          profileUpdated = true
        } else {
          // Profile not ready yet, trigger may still be running
          retries++
        }
      }
      
      if (!profileUpdated) {
        console.error('Failed to update profile after all retries')
      }

      // Send welcome email (fire and forget)
      sendEmail(email, `Welcome to Sites That Slap, ${name}!`, clientWelcomeEmail(name, email, password))

      // Show success message
      if (authData.session) {
        toast.success(`Client "${name}" created! Welcome email sent.`)
      } else {
        toast.success(`Client "${name}" created! Welcome email sent. They'll need to confirm their email first.`)
      }
      logActivity('created', 'client', authData.user?.id || '', name, `New client account created`)

      setShowClientModal(false)
      form.reset()
      fetchData()
    } catch (err) {
      console.error('Error creating client:', err)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setSuppressAuthChange(false)
      setCreatingClient(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete project')
    } else {
      toast.success('Project deleted')
      logActivity('deleted', 'project', id, '', 'Project deleted')
    }
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
    logActivity('updated', 'project', editingProject.id, updates.name, `Project updated`)
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
              {/* Global Search */}
              <div className="hidden md:flex items-center gap-2 relative">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => { setGlobalSearch(e.target.value); setShowGlobalSearch(true) }}
                  onFocus={() => setShowGlobalSearch(true)}
                  onBlur={() => setTimeout(() => setShowGlobalSearch(false), 200)}
                  placeholder="Global search..."
                  className="w-48 lg:w-64 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                />
                {globalSearch && <button onClick={() => setGlobalSearch('')} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>}
                {showGlobalSearch && globalSearchResults && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {globalSearchResults.clients.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs text-slate-500 font-bold px-2 py-1">CLIENTS</p>
                        {globalSearchResults.clients.map((c: Client) => (
                          <button key={c.id} onMouseDown={() => { setActiveTab('clients'); setSearchTerm(c.name); setGlobalSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-left">
                            <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm font-bold">{c.name[0]}</div>
                            <div><p className="text-white text-sm">{c.name}</p><p className="text-slate-500 text-xs">{c.email}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                    {globalSearchResults.invoices.length > 0 && (
                      <div className="p-2 border-t border-white/5">
                        <p className="text-xs text-slate-500 font-bold px-2 py-1">INVOICES</p>
                        {globalSearchResults.invoices.map((i: Invoice) => (
                          <button key={i.id} onMouseDown={() => { setActiveTab('invoices'); setSearchTerm(i.invoice_number); setGlobalSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-left">
                            <FileText className="w-4 h-4 text-purple-400" />
                            <div><p className="text-white text-sm">{i.invoice_number}</p><p className="text-slate-500 text-xs">£{i.amount.toLocaleString()} · {i.client?.name}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                    {globalSearchResults.projects.length > 0 && (
                      <div className="p-2 border-t border-white/5">
                        <p className="text-xs text-slate-500 font-bold px-2 py-1">PROJECTS</p>
                        {globalSearchResults.projects.map((p: Project) => (
                          <button key={p.id} onMouseDown={() => { setActiveTab('projects'); setSearchTerm(p.name); setGlobalSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-left">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            <div><p className="text-white text-sm">{p.name}</p><p className="text-slate-500 text-xs">{p.client?.name}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                    {!globalSearchResults.clients.length && !globalSearchResults.invoices.length && !globalSearchResults.projects.length && (
                      <p className="text-slate-500 text-sm text-center py-4">No results</p>
                    )}
                  </div>
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
              <button onClick={() => setShowBroadcastModal(true)} className="hidden md:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Broadcast email to clients">
                <Send className="w-5 h-5" />
              </button>
              <NotificationBell />
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
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
                { id: 'leads', label: 'Leads', icon: Target },
                { id: 'invoices', label: 'Invoices', icon: FileText },
                { id: 'projects', label: 'Projects', icon: CheckCircle },
                { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
                { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
                { id: 'calendar', label: 'Calendar', icon: CalendarDays },
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
              { id: 'leads', label: 'Leads', icon: Target },
              { id: 'quotes', label: 'Quote Requests', icon: FileText },
              { id: 'contacts', label: 'Contact Forms', icon: MessageSquare },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'projects', label: 'Projects', icon: CheckCircle },
              { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
              { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
              { id: 'calendar', label: 'Calendar', icon: CalendarDays },
              { id: 'recurring', label: 'Recurring', icon: RefreshCw, badge: recurringPlans.filter(p => p.status === 'active').length },
              { id: 'activity', label: 'Activity Log', icon: Activity },
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
                  { label: 'Avg Project Value', value: `£${invoices.length > 0 ? Math.round(invoices.reduce((s: number, i: Invoice) => s + i.amount, 0) / Math.max(projects.length, 1)).toLocaleString() : '0'}`, icon: TrendingUp, color: 'from-cyan-500 to-blue-500' },
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

                {/* Lead Source Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="glass-neon rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-white mb-4">Lead Sources</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={(() => {
                          const sourceCounts: Record<string, number> = {}
                          leads.forEach((lead: Lead) => {
                            if (lead.source) {
                              sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1
                            }
                          })
                          const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280']
                          return Object.entries(sourceCounts).map(([name, value], i) => ({
                            name,
                            value,
                            color: colors[i % colors.length]
                          }))
                        })()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(() => {
                          const sourceCounts: Record<string, number> = {}
                          leads.forEach((lead: Lead) => {
                            if (lead.source) {
                              sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1
                            }
                          })
                          const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280']
                          return Object.entries(sourceCounts).map(([,], i) => (
                            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                          ))
                        })()}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4 flex-wrap">
                    {(() => {
                      const sourceCounts: Record<string, number> = {}
                      leads.forEach((lead: Lead) => {
                        if (lead.source) {
                          sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1
                        }
                      })
                      const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280']
                      return Object.entries(sourceCounts).map(([name, value], i) => (
                        <div key={name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                          <span className="text-sm text-slate-400">{name} ({value})</span>
                        </div>
                      ))
                    })()}
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

                {/* Lead Status Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="glass-neon rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-white mb-4">Lead Status</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'New', count: leads.filter((l: Lead) => l.status === 'new').length, fill: '#3B82F6' },
                      { name: 'Contacted', count: leads.filter((l: Lead) => l.status === 'contacted').length, fill: '#F59E0B' },
                      { name: 'Qualified', count: leads.filter((l: Lead) => l.status === 'qualified').length, fill: '#10B981' },
                      { name: 'Lost', count: leads.filter((l: Lead) => l.status === 'lost').length, fill: '#EF4444' },
                      { name: 'Converted', count: leads.filter((l: Lead) => l.status === 'converted').length, fill: '#8B5CF6' },
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

              {/* Revenue Over Time + Client Growth */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-neon rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Revenue Report</h2>
                    <div className="flex gap-2">
                      <select
                        value={reportPeriod}
                        onChange={(e) => setReportPeriod(e.target.value as any)}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500/50"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <select
                        value={reportYear}
                        onChange={(e) => setReportYear(Number(e.target.value))}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500/50"
                      >
                        {[2024, 2025, 2026, 2027].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={(() => {
                      const paidInvoices = invoices.filter((i: Invoice) => i.status === 'paid' && new Date(i.date).getFullYear() === reportYear)
                      const data: Record<string, number> = {}
                      
                      if (reportPeriod === 'monthly') {
                        for (let i = 0; i < 12; i++) {
                          const month = new Date(reportYear, i).toLocaleDateString('en-GB', { month: 'short' })
                          data[month] = 0
                        }
                        paidInvoices.forEach((inv: Invoice) => {
                          const month = new Date(inv.date).toLocaleDateString('en-GB', { month: 'short' })
                          data[month] = (data[month] || 0) + inv.amount
                        })
                      } else if (reportPeriod === 'quarterly') {
                        data['Q1'] = 0
                        data['Q2'] = 0
                        data['Q3'] = 0
                        data['Q4'] = 0
                        paidInvoices.forEach((inv: Invoice) => {
                          const month = new Date(inv.date).getMonth()
                          const quarter = `Q${Math.floor(month / 3) + 1}`
                          data[quarter] = (data[quarter] || 0) + inv.amount
                        })
                      } else {
                        data[reportYear.toString()] = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)
                      }
                      
                      return Object.entries(data).map(([name, value]) => ({ name, value }))
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: any) => typeof value === 'number' ? `£${value.toLocaleString()}` : '£0'}
                      />
                      <Bar dataKey="value" fill="#EC4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Total Revenue</p>
                      <p className="text-xl font-bold text-white">
                        £{invoices.filter((i: Invoice) => i.status === 'paid' && new Date(i.date).getFullYear() === reportYear)
                          .reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Avg Invoice</p>
                      <p className="text-xl font-bold text-white">
                        £{(() => {
                          const paid = invoices.filter((i: Invoice) => i.status === 'paid' && new Date(i.date).getFullYear() === reportYear)
                          return paid.length ? Math.round(paid.reduce((sum, i) => sum + i.amount, 0) / paid.length).toLocaleString() : 0
                        })()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Paid Invoices</p>
                      <p className="text-xl font-bold text-white">
                        {invoices.filter((i: Invoice) => i.status === 'paid' && new Date(i.date).getFullYear() === reportYear).length}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-neon rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Client Growth</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={(() => {
                      const months: Record<string, number> = {}
                      const sorted = [...clients].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      let total = 0
                      sorted.forEach((c: Client) => {
                        const key = new Date(c.created_at).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
                        total++
                        months[key] = total
                      })
                      return Object.entries(months).slice(-6).map(([month, clients]) => ({ month, clients }))
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      <Line type="monotone" dataKey="clients" stroke="#8338EC" strokeWidth={2} dot={{ fill: '#8338EC', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Stripe Mode Toggle */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-neon rounded-2xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stripeMode === 'live' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                      <DollarSign className={`w-5 h-5 ${stripeMode === 'live' ? 'text-green-400' : 'text-yellow-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Stripe Payments</h3>
                      <p className="text-sm text-slate-400">
                        Currently in <span className={`font-bold ${stripeMode === 'live' ? 'text-green-400' : 'text-yellow-400'}`}>{stripeMode === 'live' ? '🟢 Live' : '🟡 Sandbox'}</span> mode
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveStripeMode('sandbox')}
                      disabled={savingStripeMode || stripeMode === 'sandbox'}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${stripeMode === 'sandbox' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      🟡 Sandbox
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm('⚠️ Switch to LIVE mode?\n\nReal money will be charged to clients. Make sure your live Stripe keys are set in Supabase secrets.')) return
                        handleSaveStripeMode('live')
                      }}
                      disabled={savingStripeMode || stripeMode === 'live'}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${stripeMode === 'live' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-slate-400 hover:bg-green-500/10 hover:text-green-400'}`}
                    >
                      🟢 Live
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Webhook:</span>
                  <span className="text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Connected</span>
                  <a href="https://dashboard.stripe.com/test/webhooks" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">
                    Manage →
                  </a>
                </div>
                {stripeMode === 'live' && (
                  <p className="mt-3 text-xs text-red-400/80 bg-red-500/10 rounded-lg px-3 py-2">
                    ⚠️ Live mode active — real payments are being processed
                  </p>
                )}
              </motion.div>

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
                <button 
                  onClick={() => handleExportCSV('invoices')}
                  className="px-4 py-3 rounded-xl glass-neon text-slate-400 flex items-center gap-2 hover:text-white"
                >
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
                            <button
                              onClick={() => handleInvoiceStatusToggle(invoice)}
                              title="Click to cycle status"
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-opacity hover:opacity-70 ${
                                invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                              {invoice.status}
                            </button>
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
                              {invoice.status !== 'paid' && (
                                <button
                                  onClick={() => handleSendInvoiceReminder(invoice)}
                                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-400"
                                  title="Send payment reminder"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}
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
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExportCSV('clients')}
                    className="px-4 py-3 rounded-xl glass-neon text-slate-400 font-bold flex items-center gap-2 hover:text-white"
                  >
                    <Download className="w-5 h-5" /> Export
                  </button>
                  <button 
                    onClick={() => setShowClientModal(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Client
                  </button>
                </div>
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
                            onClick={async () => {
                              if (!confirm(`Reset password for "${client.name}"?\n\nA new password will be generated and emailed to ${client.email}.`)) return
                              const newPass = Array.from(crypto.getRandomValues(new Uint8Array(12))).map(b => 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%'[b % 60]).join('')
                              const { error } = await supabase.functions.invoke('reset-password', { body: { userId: client.id, newPassword: newPass } })
                              if (error) {
                                toast.error('Failed to reset password: ' + error.message)
                              } else {
                                sendEmail(client.email, 'Your password has been reset - Sites That Slap', `
                                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                                    <div style="text-align: center; margin-bottom: 30px;">
                                      <h1 style="color: #FF006E; font-size: 28px; margin: 0;">Sites That Slap</h1>
                                    </div>
                                    <div style="background: #f9f9f9; border-radius: 12px; padding: 30px; border-left: 4px solid #FF006E;">
                                      <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${client.name},</h2>
                                      <p style="color: #444; line-height: 1.6;">Your password has been reset. Here are your new login details:</p>
                                      <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                        <p style="color: #444; margin: 5px 0;"><strong>Email:</strong> ${client.email}</p>
                                        <p style="color: #444; margin: 5px 0;"><strong>New Password:</strong> ${newPass}</p>
                                      </div>
                                      <p style="color: #999; font-size: 12px;">We recommend changing your password after logging in.</p>
                                      <div style="text-align: center; margin-top: 20px;">
                                        <a href="https://www.sitesthatslap.com/login" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #8338EC); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold;">Log In</a>
                                      </div>
                                    </div>
                                  </div>
                                `)
                                toast.success(`Password reset! New password emailed to ${client.email}`)
                              }
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-yellow-400"
                            title="Reset password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
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
                        <div className="mt-2">
                          {editingClientNote === client.id ? (
                            <div className="space-y-1">
                              <textarea
                                value={clientNoteValue}
                                onChange={(e) => setClientNoteValue(e.target.value)}
                                rows={2}
                                placeholder="Internal note..."
                                className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs resize-none focus:outline-none focus:border-pink-500/50"
                                autoFocus
                              />
                              <div className="flex gap-1">
                                <button onClick={() => handleSaveClientNote(client.id)} className="px-2 py-1 rounded bg-pink-500 text-white text-xs font-bold">Save</button>
                                <button onClick={() => setEditingClientNote(null)} className="px-2 py-1 rounded bg-white/5 text-slate-400 text-xs">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingClientNote(client.id); setClientNoteValue(client.notes || '') }}
                              className="text-xs text-slate-500 hover:text-slate-300 italic transition-colors text-left w-full"
                            >
                              {client.notes ? `"${client.notes}"` : '+ Add internal note...'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Projects</h1>
                <button 
                  onClick={() => handleExportCSV('projects')}
                  className="px-4 py-3 rounded-xl glass-neon text-slate-400 font-bold flex items-center gap-2 hover:text-white"
                >
                  <Download className="w-5 h-5" /> Export
                </button>
              </div>
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
                            onClick={() => { setSelectedProjectForCreds(project.id); fetchCredentials(project.id) }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-yellow-400 transition-colors"
                            title="API keys & credentials"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditingProject(project); fetchMilestones(project.id) }}
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
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleQuickProgress(project, -5)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold">−</button>
                          <span className="text-slate-400">{project.progress}%</span>
                          <button onClick={() => handleQuickProgress(project, 5)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold">+</button>
                        </div>
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

                      {/* Comments Section */}
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Comments & Activity
                          </span>
                          <button
                            onClick={() => {
                              setSelectedProjectForComments(project.id)
                              fetchProjectComments(project.id)
                            }}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            {selectedProjectForComments === project.id ? 'Hide' : 'View'} Comments
                          </button>
                        </div>
                        
                        {selectedProjectForComments === project.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-3"
                          >
                            {/* Comments List */}
                            <div className="max-h-40 overflow-y-auto space-y-2">
                              {projectComments.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No comments yet</p>
                              ) : (
                                projectComments.map((comment: ProjectComment) => (
                                  <div key={comment.id} className={`p-2 rounded-lg text-sm ${
                                    comment.type === 'status_change' ? 'bg-purple-500/10 border border-purple-500/30' :
                                    comment.type === 'file_upload' ? 'bg-blue-500/10 border border-blue-500/30' :
                                    comment.type === 'milestone' ? 'bg-green-500/10 border border-green-500/30' :
                                    'bg-white/5'
                                  }`}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-semibold text-white text-xs">
                                        {comment.user?.name || 'Admin'}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-slate-300">{comment.content}</p>
                                  </div>
                                ))
                              )}
                            </div>
                            
                            {/* Add Comment Form */}
                            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-white/10">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                              />
                              <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold disabled:opacity-50"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </div>

                      {/* GitHub Integration Section */}
                      {project.github_repo_url && (
                        <div className="border-t border-white/10 pt-4 mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-white flex items-center gap-2">
                              <Github className="w-4 h-4" /> GitHub Activity
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProjectForGitHub(project.id)
                                  fetchProjectSummaries(project.id)
                                }}
                                className="text-xs text-slate-400 hover:text-white"
                              >
                                {selectedProjectForGitHub === project.id ? 'Hide' : 'View'} Summaries
                              </button>
                              <button
                                onClick={() => generateDailySummary(project)}
                                disabled={githubLoading}
                                className="text-xs px-2 py-1 rounded bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-slate-300 hover:text-white disabled:opacity-50"
                              >
                                {githubLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate Yesterday\'s Summary'}
                              </button>
                            </div>
                          </div>
                          
                          {selectedProjectForGitHub === project.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-3"
                            >
                              {/* GitHub Token Input */}
                              <div className="flex gap-2 mb-3">
                                <input
                                  type="password"
                                  value={githubToken}
                                  onChange={(e) => setGithubToken(e.target.value)}
                                  placeholder="GitHub token (optional, for private repos)"
                                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                                />
                              </div>
                              
                              {/* Summaries List */}
                              <div className="max-h-60 overflow-y-auto space-y-3">
                                {projectSummaries.length === 0 ? (
                                  <p className="text-sm text-slate-500 italic">No summaries yet. Click "Generate Yesterday's Summary" to create one.</p>
                                ) : (
                                  projectSummaries.map((summary) => (
                                    <div key={summary.id} className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-white text-xs">
                                          {new Date(summary.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                          {summary.commit_count} commit{summary.commit_count !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                                        {summary.summary}
                                      </pre>
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
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
                            onClick={async () => {
                              setSelectedClientForMessages(client.id)
                              await supabase.from('messages').update({ read: true }).eq('client_id', client.id).eq('sender', 'client').eq('read', false)
                              await supabase.from('notifications').delete().eq('user_id', user!.id).ilike('message', `%${client.name}%`).eq('type', 'info')
                              fetchData()
                            }}
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
                        <div className="pt-4 border-t border-white/10">
                          {adminAttachment && (
                            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/5">
                              <Paperclip className="w-4 h-4 text-pink-400" />
                              <span className="text-sm text-slate-300 truncate flex-1">{adminAttachment.name}</span>
                              <button onClick={() => setAdminAttachment(null)} className="text-slate-400 hover:text-red-400"><X className="w-4 h-4" /></button>
                            </div>
                          )}
                          <form onSubmit={handleSendAdminMessage} className="flex gap-2">
                            <label className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                              <Paperclip className="w-5 h-5" />
                              <input type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setAdminAttachment(e.target.files[0]) }} />
                            </label>
                            <input
                              type="text"
                              value={newAdminMessage}
                              onChange={(e) => setNewAdminMessage(e.target.value)}
                              placeholder="Type a message..."
                              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                            />
                            <button
                              type="submit"
                              disabled={!newAdminMessage.trim() && !adminAttachment}
                              className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold disabled:opacity-50"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </form>
                        </div>
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

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Calendar</h1>
                <div className="flex gap-2">
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Project Deadline
                  </span>
                  <span className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span> Invoice Due
                  </span>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Deadlines */}
                <div className="glass-neon rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    Project Deadlines
                  </h2>
                  {filteredProjects.filter(p => new Date(p.deadline) >= new Date()).length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No upcoming deadlines</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredProjects
                        .filter(p => new Date(p.deadline) >= new Date())
                        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                        .slice(0, 10)
                        .map(project => (
                          <div key={project.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div>
                              <p className="font-semibold text-white">{project.name}</p>
                              <p className="text-sm text-slate-400">{project.client?.name || 'Unknown'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-blue-400">{new Date(project.deadline).toLocaleDateString()}</p>
                              <p className="text-xs text-slate-500">
                                {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Invoice Due Dates */}
                <div className="glass-neon rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-400" />
                    Invoice Due Dates
                  </h2>
                  {filteredInvoices.filter(i => i.status !== 'paid' && new Date(i.due_date) >= new Date()).length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No upcoming due dates</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredInvoices
                        .filter(i => i.status !== 'paid' && new Date(i.due_date) >= new Date())
                        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                        .slice(0, 10)
                        .map(invoice => (
                          <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div>
                              <p className="font-semibold text-white">{invoice.invoice_number}</p>
                              <p className="text-sm text-slate-400">{invoice.client?.name || 'Unknown'} - £{invoice.amount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-bold ${new Date(invoice.due_date) < new Date() ? 'text-red-400' : 'text-yellow-400'}`}>
                                {new Date(invoice.due_date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-slate-500">
                                {Math.ceil((new Date(invoice.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Summary */}
              <div className="glass-neon rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">This Month Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                    <p className="text-sm text-slate-400">Projects Due</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredProjects.filter(p => {
                        const d = new Date(p.deadline)
                        const now = new Date()
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                      }).length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30">
                    <p className="text-sm text-slate-400">Invoices Due</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredInvoices.filter(i => i.status !== 'paid' && new Date(i.due_date) >= new Date()).filter(i => {
                        const d = new Date(i.due_date)
                        const now = new Date()
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                      }).length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30">
                    <p className="text-sm text-slate-400">Paid This Month</p>
                    <p className="text-2xl font-bold text-white">
                      £{filteredInvoices.filter(i => i.status === 'paid').filter(i => {
                        const d = new Date(i.date)
                        const now = new Date()
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                      }).reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
                    <p className="text-sm text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-white">
                      £{filteredInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kanban' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-white">Kanban Board</h1>
                  <p className="text-slate-400 text-sm mt-1">Drag and drop projects to update their status</p>
                </div>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> New Project
                </button>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {([
                  { status: 'in_progress' as const, label: 'In Progress', color: 'blue' },
                  { status: 'review' as const, label: 'Review', color: 'purple' },
                  { status: 'completed' as const, label: 'Completed', color: 'green' },
                  { status: 'on_hold' as const, label: 'On Hold', color: 'yellow' },
                ]).map(column => {
                  const columnProjects = filteredProjects.filter(p => p.status === column.status)
                  const colorMap: Record<string, string> = { blue: 'border-blue-500', purple: 'border-purple-500', green: 'border-green-500', yellow: 'border-yellow-500' }
                  const bgColorMap: Record<string, string> = { blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', yellow: 'bg-yellow-500' }
                  const barColorMap: Record<string, string> = { blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', yellow: 'bg-yellow-500' }
                  return (
                    <div
                      key={column.status}
                      className="space-y-4"
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add('ring-2', 'ring-white/20', 'rounded-2xl')
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('ring-2', 'ring-white/20', 'rounded-2xl')
                      }}
                      onDrop={async (e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('ring-2', 'ring-white/20', 'rounded-2xl')
                        const projectId = e.dataTransfer.getData('text/plain')
                        const project = projects.find(p => p.id === projectId)
                        if (!project || project.status === column.status) return
                        const progressMap: Record<string, number> = { in_progress: Math.max(project.progress, 10), review: Math.max(project.progress, 75), completed: 100, on_hold: project.progress }
                        const { error } = await supabase.from('projects').update({ status: column.status, progress: progressMap[column.status] }).eq('id', projectId)
                        if (error) {
                          toast.error('Failed to update project')
                        } else {
                          toast.success(`"${project.name}" moved to ${column.label}`)
                          logActivity('status_changed', 'project', project.id, project.name, `Moved to ${column.label}`)
                          fetchData()
                        }
                      }}
                    >
                      <div className={`flex items-center gap-2 pb-2 border-b-2 ${colorMap[column.color]}`}>
                        <div className={`w-3 h-3 rounded-full ${bgColorMap[column.color]}`}></div>
                        <h2 className="font-bold text-white">{column.label}</h2>
                        <span className="ml-auto text-sm text-slate-400">{columnProjects.length}</span>
                      </div>
                      <div className="space-y-3 min-h-[100px]">
                        {columnProjects.map(project => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            draggable
                            onDragStart={(e: any) => {
                              e.dataTransfer.setData('text/plain', project.id)
                              e.currentTarget.style.opacity = '0.5'
                            }}
                            onDragEnd={(e: any) => {
                              e.currentTarget.style.opacity = '1'
                            }}
                            className="glass-neon rounded-xl p-4 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors select-none"
                            onClick={() => { setEditingProject(project); fetchMilestones(project.id) }}
                          >
                            <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                            <p className="text-sm text-slate-400 mb-3">{project.client?.name || 'Unknown'}</p>
                            <div className="flex items-center justify-between">
                              <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${barColorMap[column.color]}`}
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400">{project.progress}%</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Due: {new Date(project.deadline).toLocaleDateString()}
                            </p>
                          </motion.div>
                        ))}
                        {columnProjects.length === 0 && (
                          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                            <p className="text-slate-500 text-sm">Drop here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Contact Submissions</h1>
              </div>
              {contactsLoading ? (
                <div className="text-center py-8"><Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" /></div>
              ) : contactSubmissions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No contact submissions yet</p>
              ) : (
                <div className="space-y-4">
                  {contactSubmissions.map((c: any) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-neon rounded-2xl p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-white text-lg">{c.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              c.status === 'new' ? 'bg-pink-500/20 text-pink-400' :
                              c.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                              c.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>{c.status}</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-1">{c.email}</p>
                          <p className="text-white mt-3 whitespace-pre-wrap">{c.message}</p>
                          {c.admin_notes && (
                            <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                              <p className="text-xs text-yellow-400 font-bold mb-1">Admin Notes</p>
                              <p className="text-sm text-slate-300">{c.admin_notes}</p>
                            </div>
                          )}
                          <p className="text-xs text-slate-500 mt-3">{new Date(c.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <select
                            value={c.status}
                            onChange={(e) => updateContactStatus(c.id, e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button
                            onClick={() => {
                              const note = prompt('Add admin note:', c.admin_notes || '')
                              if (note !== null) updateContactStatus(c.id, c.status, note)
                            }}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${c.email}?subject=Re: Your enquiry to Sites That Slap&body=Hi ${c.name},%0A%0AThank you for reaching out.%0A%0A`}
                            className="px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold flex items-center gap-1"
                            onClick={() => { if (c.status === 'new' || c.status === 'read') updateContactStatus(c.id, 'replied') }}
                          >
                            <Send className="w-3.5 h-3.5" /> Reply
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Quote Requests</h1>
              </div>
              {quotesLoading ? (
                <div className="text-center py-8"><Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" /></div>
              ) : quoteRequests.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No quote requests yet</p>
              ) : (
                <div className="space-y-4">
                  {quoteRequests.map((q: any) => (
                    <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-neon rounded-2xl p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-white text-lg">{q.name}</h3>
                            {q.company && <span className="text-sm text-pink-400">{q.company}</span>}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              q.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              q.status === 'reviewing' ? 'bg-blue-500/20 text-blue-400' :
                              q.status === 'quoted' ? 'bg-purple-500/20 text-purple-400' :
                              q.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>{q.status}</span>
                          </div>
                          <p className="text-sm text-slate-400">{q.email}{q.phone ? ` · ${q.phone}` : ''}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                            {q.services?.length > 0 && (
                              <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">Services</p>
                                <div className="flex flex-wrap gap-1">
                                  {q.services.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-xs">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {q.timeline && (
                              <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">Timeline</p>
                                <p className="text-sm text-white">{q.timeline}</p>
                              </div>
                            )}
                            {q.budget && (
                              <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">Budget</p>
                                <p className="text-sm text-white">{q.budget}</p>
                              </div>
                            )}
                          </div>

                          {q.features?.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-500 font-bold mb-1">Features</p>
                              <div className="flex flex-wrap gap-1">
                                {q.features.map((f: string) => (
                                  <span key={f} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">{f}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {q.project_details && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-500 font-bold mb-1">Project Details</p>
                              <p className="text-sm text-slate-300 whitespace-pre-wrap">{q.project_details}</p>
                            </div>
                          )}

                          {q.admin_notes && (
                            <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                              <p className="text-xs text-yellow-400 font-bold mb-1">Admin Notes</p>
                              <p className="text-sm text-slate-300">{q.admin_notes}</p>
                            </div>
                          )}

                          <p className="text-xs text-slate-500 mt-3">{new Date(q.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <select
                            value={q.status}
                            onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="quoted">Quoted</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                          </select>
                          <button
                            onClick={() => {
                              const note = prompt('Add admin note:', q.admin_notes || '')
                              if (note !== null) updateQuoteStatus(q.id, q.status, note)
                            }}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white text-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${q.email}?subject=Your Quote Request - Sites That Slap&body=Hi ${q.name},%0A%0AThank you for your quote request.%0A%0A`}
                            className="px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" /> Reply
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white">Activity Log</h1>
                <p className="text-slate-400">Track all actions across the platform</p>
              </div>
              <div className="glass-neon rounded-2xl p-6">
                <ActivityLog limit={100} />
              </div>
            </div>
          )}

          {activeTab === 'recurring' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-black text-white">Recurring Payments</h1>
                  <p className="text-slate-400 mt-1">Auto-generate invoices on a schedule</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRunRecurringNow}
                    className="px-4 py-3 rounded-xl glass-neon text-slate-400 font-bold flex items-center gap-2 hover:text-white"
                    title="Manually trigger invoice generation now"
                  >
                    <RefreshCw className="w-4 h-4" /> Run Now
                  </button>
                  <button
                    onClick={() => { setEditingRecurring(null); setShowRecurringModal(true) }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> New Plan
                  </button>
                </div>
              </div>

              {recurringLoading ? (
                <div className="text-center py-12"><Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" /></div>
              ) : recurringPlans.length === 0 ? (
                <div className="glass-neon rounded-2xl p-12 text-center">
                  <RefreshCw className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg font-semibold">No recurring plans yet</p>
                  <p className="text-slate-500 text-sm mt-2">Set up automated invoice generation for retainer clients</p>
                  <button onClick={() => { setEditingRecurring(null); setShowRecurringModal(true) }} className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                    Create First Plan
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recurringPlans.map((plan: any) => (
                    <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-neon rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            plan.status === 'active' ? 'bg-green-500/20' :
                            plan.status === 'paused' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                          }`}>
                            <RefreshCw className={`w-6 h-6 ${
                              plan.status === 'active' ? 'text-green-400' :
                              plan.status === 'paused' ? 'text-yellow-400' : 'text-red-400'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-white">{plan.description}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                plan.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                plan.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                              }`}>{plan.status}</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-0.5">
                              {plan.client?.name} · {plan.project?.name}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 flex-wrap">
                              <span className="capitalize">{plan.interval}</span>
                              <span>Next: {new Date(plan.next_invoice_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              {plan.end_date && <span>Ends: {new Date(plan.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                              <span>{plan.invoice_count} invoice{plan.invoice_count !== 1 ? 's' : ''} generated</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-black text-white">£{Number(plan.amount).toLocaleString()}</p>
                            <p className="text-xs text-slate-500 capitalize">per {plan.interval.replace('ly', '')}</p>
                          </div>
                          <div className="flex gap-1">
                            {plan.status !== 'cancelled' && (
                              <button
                                onClick={() => handleToggleRecurring(plan)}
                                className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${plan.status === 'active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                                title={plan.status === 'active' ? 'Pause' : 'Resume'}
                              >
                                {plan.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>
                            )}
                            {plan.status !== 'cancelled' && (
                              <button
                                onClick={() => { setEditingRecurring(plan); setShowRecurringModal(true) }}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                                title="Edit plan"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {plan.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancelRecurring(plan.id)}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400"
                                title="Cancel plan"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-black text-white">Leads</h1>
                  <p className="text-slate-400 mt-1">Track and convert potential clients</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLeadViewMode(leadViewMode === 'list' ? 'kanban' : 'list')}
                    className="px-4 py-3 rounded-xl glass-neon text-slate-400 font-bold flex items-center gap-2 hover:text-white"
                    title="Toggle view"
                  >
                    {leadViewMode === 'list' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    {leadViewMode === 'list' ? 'Kanban' : 'List'}
                  </button>
                  <button
                    onClick={handleExportLeads}
                    className="px-4 py-3 rounded-xl glass-neon text-slate-400 font-bold flex items-center gap-2 hover:text-white"
                    title="Export to CSV"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button
                    onClick={() => { setEditingLead(null); setShowLeadModal(true) }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Lead
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  placeholder="Search by name, company, email..."
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                />
                <select
                  value={leadFilterStatus}
                  onChange={(e) => setLeadFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                  <option value="converted">Converted</option>
                </select>
                <select
                  value={leadFilterType}
                  onChange={(e) => setLeadFilterType(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50"
                >
                  <option value="all">All Types</option>
                  <option value="website_design">Website Design</option>
                  <option value="website_redesign">Website Redesign</option>
                  <option value="error_fixing">Error Fixing</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {leadsLoading ? (
                <div className="text-center py-12"><Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" /></div>
              ) : leadViewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['new', 'contacted', 'qualified', 'converted'].map((status) => {
                    const statusLeads = leads.filter(lead => {
                      const matchesSearch = !leadSearchTerm ||
                        lead.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                        (lead.company && lead.company.toLowerCase().includes(leadSearchTerm.toLowerCase())) ||
                        (lead.email && lead.email.toLowerCase().includes(leadSearchTerm.toLowerCase()))
                      const matchesStatus = lead.status === status
                      const matchesType = leadFilterType === 'all' || lead.lead_type === leadFilterType
                      return matchesSearch && matchesStatus && matchesType
                    })
                    return (
                      <div key={status} className="glass-neon rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'new' ? 'bg-blue-400' :
                            status === 'contacted' ? 'bg-yellow-400' :
                            status === 'qualified' ? 'bg-green-400' : 'bg-purple-400'
                          }`} />
                          <h3 className="font-bold text-white capitalize">{status} ({statusLeads.length})</h3>
                        </div>
                        <div className="space-y-3">
                          {statusLeads.map((lead) => (
                            <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 rounded-xl p-3 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                                {lead.lead_score && <span className="text-xs text-yellow-400">{lead.lead_score}/5</span>}
                              </div>
                              {lead.company && <p className="text-xs text-slate-400">{lead.company}</p>}
                              {lead.estimated_value && <p className="text-xs text-green-400 mt-1">£{lead.estimated_value.toLocaleString()}</p>}
                              <div className="flex gap-1 mt-2">
                                <button onClick={() => { setInteractionLead(lead); setInteractionType('call'); setShowInteractionModal(true) }} className="p-1 rounded bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30">📞</button>
                                <button onClick={() => { setInteractionLead(lead); setInteractionType('email'); setShowInteractionModal(true) }} className="p-1 rounded bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30">✉️</button>
                                <button onClick={() => { setEditingLead(lead); setShowLeadModal(true) }} className="p-1 rounded bg-white/10 text-slate-400 text-xs hover:bg-white/20">✏️</button>
                              </div>
                            </motion.div>
                          ))}
                          {statusLeads.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No leads</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : leads.filter(lead => {
                const matchesSearch = !leadSearchTerm || 
                  lead.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                  (lead.company && lead.company.toLowerCase().includes(leadSearchTerm.toLowerCase())) ||
                  (lead.email && lead.email.toLowerCase().includes(leadSearchTerm.toLowerCase()))
                const matchesStatus = leadFilterStatus === 'all' || lead.status === leadFilterStatus
                const matchesType = leadFilterType === 'all' || lead.lead_type === leadFilterType
                return matchesSearch && matchesStatus && matchesType
              }).length === 0 ? (
                <div className="glass-neon rounded-2xl p-12 text-center">
                  <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg font-semibold">No leads match your filters</p>
                  <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.filter(lead => {
                    const matchesSearch = !leadSearchTerm || 
                      lead.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                      (lead.company && lead.company.toLowerCase().includes(leadSearchTerm.toLowerCase())) ||
                      (lead.email && lead.email.toLowerCase().includes(leadSearchTerm.toLowerCase()))
                    const matchesStatus = leadFilterStatus === 'all' || lead.status === leadFilterStatus
                    const matchesType = leadFilterType === 'all' || lead.lead_type === leadFilterType
                    return matchesSearch && matchesStatus && matchesType
                  }).map((lead) => (
                    <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-neon rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            lead.status === 'new' ? 'bg-blue-500/20' :
                            lead.status === 'contacted' ? 'bg-yellow-500/20' :
                            lead.status === 'qualified' ? 'bg-green-500/20' :
                            lead.status === 'converted' ? 'bg-purple-500/20' : 'bg-red-500/20'
                          }`}>
                            <Target className={`w-6 h-6 ${
                              lead.status === 'new' ? 'text-blue-400' :
                              lead.status === 'contacted' ? 'text-yellow-400' :
                              lead.status === 'qualified' ? 'text-green-400' :
                              lead.status === 'converted' ? 'text-purple-400' : 'text-red-400'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-white">{lead.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                                lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                                lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                                lead.status === 'converted' ? 'bg-purple-500/20 text-purple-400' : 'bg-red-500/20 text-red-400'
                              }`}>{lead.status}</span>
                            </div>
                            {lead.company && <p className="text-slate-400 text-sm mt-0.5">{lead.company}</p>}
                            {lead.email && <p className="text-slate-500 text-sm">{lead.email}</p>}
                            {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 hover:text-pink-300 mt-1 underline">{lead.website}</a>}
                            {lead.lead_type && <p className="text-xs text-cyan-400 mt-1 capitalize">{lead.lead_type.replace('_', ' ')}</p>}
                            {lead.contact_method && <p className="text-xs text-purple-400 mt-1">{lead.contact_method === 'they_contacted_me' ? '📥 They contacted me' : '📤 I found them'}</p>}
                            {lead.how_found && <p className="text-xs text-slate-500 mt-1">{lead.how_found}</p>}
                            {lead.source && <p className="text-xs text-slate-500 mt-1">Source: {lead.source}</p>}
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              {lead.estimated_value && <span className="text-green-400">£{lead.estimated_value.toLocaleString()}</span>}
                              {lead.lead_score && <span className="text-yellow-400">Score: {lead.lead_score}/5</span>}
                              {lead.conversion_probability && <span className="text-blue-400">{lead.conversion_probability}%</span>}
                            </div>
                            {lead.follow_up_date && (
                              <p className={`text-xs mt-1 ${new Date(lead.follow_up_date) < new Date() && lead.status !== 'converted' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                                Follow-up: {new Date(lead.follow_up_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                {new Date(lead.follow_up_date) < new Date() && lead.status !== 'converted' && ' ⚠️ Overdue'}
                              </p>
                            )}
                            {lead.assigned_user && <p className="text-xs text-slate-500 mt-1">Assigned to: {lead.assigned_user.name}</p>}
                            {lead.interactions && lead.interactions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs text-slate-500 font-bold">Interactions ({lead.interactions.length})</p>
                                  {lead.interactions.length > 3 && (
                                    <button
                                      onClick={() => {
                                        const newExpanded = new Set(expandedInteractions)
                                        if (newExpanded.has(lead.id)) {
                                          newExpanded.delete(lead.id)
                                        } else {
                                          newExpanded.add(lead.id)
                                        }
                                        setExpandedInteractions(newExpanded)
                                      }}
                                      className="text-xs text-pink-400 hover:text-pink-300"
                                    >
                                      {expandedInteractions.has(lead.id) ? 'Show less' : 'Show all'}
                                    </button>
                                  )}
                                </div>
                                {(expandedInteractions.has(lead.id) ? lead.interactions : lead.interactions.slice(0, 3)).map((interaction) => (
                                  <div key={interaction.id} className="flex items-center gap-2 text-xs mb-1 group">
                                    <span className={interaction.type === 'call' ? 'text-green-400' : 'text-blue-400'}>
                                      {interaction.type === 'call' ? '📞' : '✉️'}
                                    </span>
                                    <span className="text-slate-400 capitalize">{interaction.outcome?.replace('_', ' ') || 'Logged'}</span>
                                    <span className="text-slate-600">
                                      {new Date(interaction.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {interaction.notes && <span className="text-slate-500 truncate max-w-[150px]">- {interaction.notes}</span>}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                      <button
                                        onClick={() => { setEditingInteraction(interaction); setInteractionType(interaction.type); setInteractionLead(lead); setShowInteractionModal(true) }}
                                        className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteInteraction(interaction.id)}
                                        className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-red-400"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {lead.notes && <p className="text-slate-400 text-sm mt-2 line-clamp-2">{lead.notes}</p>}
                            {lead.client && <p className="text-xs text-green-400 mt-1">Linked to: {lead.client.name}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setInteractionLead(lead); setInteractionType('call'); setShowInteractionModal(true) }}
                            className="px-3 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-bold hover:bg-green-500/30 flex items-center gap-1"
                            title="Log call"
                          >
                            <Phone className="w-4 h-4" /> Call
                          </button>
                          <button
                            onClick={() => { setInteractionLead(lead); setInteractionType('email'); setShowInteractionModal(true) }}
                            className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-bold hover:bg-blue-500/30 flex items-center gap-1"
                            title="Log email"
                          >
                            <Mail className="w-4 h-4" /> Email
                          </button>
                          {lead.status !== 'converted' && (
                            <button
                              onClick={() => handleConvertToProject(lead)}
                              className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-bold hover:bg-cyan-500/30 flex items-center gap-1"
                              title="Convert to project"
                            >
                              <CheckCircle className="w-4 h-4" /> Convert
                            </button>
                          )}
                          <button
                            onClick={() => { setEditingLead(lead); setShowLeadModal(true) }}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                            title="Edit lead"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400"
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Recurring Plan Modal */}
      <AnimatePresence>
        {showRecurringModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => { setShowRecurringModal(false); setEditingRecurring(null) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-white">{editingRecurring ? 'Edit' : 'New'} Recurring Plan</h2>
                <button onClick={() => { setShowRecurringModal(false); setEditingRecurring(null) }} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveRecurring} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Project</label>
                  <select name="project_id" required defaultValue={editingRecurring?.project_id || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                    <option value="">Select project...</option>
                    {projects.filter(p => p.client_id).map((p: Project) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.client?.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Invoice Description</label>
                  <input name="description" type="text" required defaultValue={editingRecurring?.description || ''} placeholder="e.g. Monthly retainer — website maintenance" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Amount (£)</label>
                    <input name="amount" type="number" required min="1" step="0.01" defaultValue={editingRecurring?.amount || ''} placeholder="0.00" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Interval</label>
                    <select name="interval" required defaultValue={editingRecurring?.interval || 'monthly'} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Start Date</label>
                    <input name="start_date" type="date" required defaultValue={editingRecurring?.start_date || new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">End Date <span className="text-slate-600">(optional)</span></label>
                    <input name="end_date" type="date" defaultValue={editingRecurring?.end_date || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Invoices are auto-generated daily. Use <strong className="text-slate-400">Run Now</strong> to trigger manually.</p>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowRecurringModal(false); setEditingRecurring(null) }} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                    {editingRecurring ? 'Save Changes' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Modal */}
      <AnimatePresence>
        {showLeadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => { setShowLeadModal(false); setEditingLead(null) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-white">{editingLead ? 'Edit' : 'Add'} Lead</h2>
                <button onClick={() => { setShowLeadModal(false); setEditingLead(null) }} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveLead(new FormData(e.target as HTMLFormElement)) }} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Name *</label>
                  <input name="name" type="text" required defaultValue={editingLead?.name || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Email</label>
                  <input name="email" type="email" defaultValue={editingLead?.email || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Company</label>
                  <input name="company" type="text" defaultValue={editingLead?.company || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="Company Ltd" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Status</label>
                  <select name="status" defaultValue={editingLead?.status || 'new'} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Source</label>
                  <input name="source" type="text" defaultValue={editingLead?.source || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="referral, website, linkedin, etc." />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Website</label>
                  <input name="website" type="url" defaultValue={editingLead?.website || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="https://example.com" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Lead Type</label>
                  <select name="lead_type" defaultValue={editingLead?.lead_type || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                    <option value="">Select type...</option>
                    <option value="website_design">Website Design</option>
                    <option value="website_redesign">Website Redesign</option>
                    <option value="error_fixing">Error Fixing</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Who Contacted Who?</label>
                  <select name="contact_method" defaultValue={editingLead?.contact_method || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                    <option value="">Select...</option>
                    <option value="they_contacted_me">They contacted me</option>
                    <option value="i_found_them">I found them</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">How did you find them / How did they find you?</label>
                  <input name="how_found" type="text" defaultValue={editingLead?.how_found || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="LinkedIn, referral, cold email, etc." />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Link to Client</label>
                  <select name="client_id" defaultValue={editingLead?.client_id || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                    <option value="">No client linked</option>
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Estimated Value (£)</label>
                    <input name="estimated_value" type="number" step="0.01" defaultValue={editingLead?.estimated_value || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="5000" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Lead Score (1-5)</label>
                    <select name="lead_score" defaultValue={editingLead?.lead_score || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                      <option value="">Select...</option>
                      <option value="1">1 - Low</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Average</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Follow-up Date</label>
                    <input name="follow_up_date" type="date" defaultValue={editingLead?.follow_up_date || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Conversion Probability (%)</label>
                    <input name="conversion_probability" type="number" min="0" max="100" defaultValue={editingLead?.conversion_probability || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" placeholder="50" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Assign To</label>
                  <select name="assigned_to" defaultValue={editingLead?.assigned_to || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                    <option value="">Unassigned</option>
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Notes</label>
                  <textarea name="notes" rows={3} defaultValue={editingLead?.notes || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-pink-500/50" placeholder="Any additional notes..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowLeadModal(false); setEditingLead(null) }} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                    {editingLead ? 'Save Changes' : 'Add Lead'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction Logging Modal */}
      <AnimatePresence>
        {showInteractionModal && interactionLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => { setShowInteractionModal(false); setInteractionLead(null); setEditingInteraction(null) }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-white">{editingInteraction ? 'Edit' : 'Log'} {interactionType === 'call' ? 'Call' : 'Email'}</h2>
                <button onClick={() => { setShowInteractionModal(false); setInteractionLead(null); setEditingInteraction(null) }} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-slate-400 text-sm mb-4">{editingInteraction ? 'Editing interaction for' : 'Logging interaction for'} <span className="text-white font-bold">{interactionLead.name}</span></p>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveInteraction(new FormData(e.target as HTMLFormElement)) }} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Outcome</label>
                  <select name="outcome" defaultValue={editingInteraction?.outcome || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                    <option value="">Select outcome...</option>
                    {interactionType === 'call' ? (
                      <>
                        <option value="answered">Answered</option>
                        <option value="no_answer">No Answer</option>
                        <option value="voicemail">Voicemail</option>
                        <option value="interested">Interested</option>
                        <option value="not_interested">Not Interested</option>
                        <option value="follow_up">Follow Up</option>
                      </>
                    ) : (
                      <>
                        <option value="replied">Replied</option>
                        <option value="no_reply">No Reply</option>
                        <option value="interested">Interested</option>
                        <option value="not_interested">Not Interested</option>
                        <option value="follow_up">Follow Up</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Notes</label>
                  <textarea name="notes" rows={4} defaultValue={editingInteraction?.notes || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-pink-500/50" placeholder="Details about the interaction..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowInteractionModal(false); setInteractionLead(null); setEditingInteraction(null) }} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                    {editingInteraction ? 'Save Changes' : `Log ${interactionType === 'call' ? 'Call' : 'Email'}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Broadcast Email Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowBroadcastModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-white">Broadcast Email</h2>
                <button onClick={() => setShowBroadcastModal(false)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleBroadcast} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Recipients</label>
                  <select
                    onChange={(e) => setBroadcastTarget(e.target.value === 'all' ? 'all' : [e.target.value])}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50"
                  >
                    <option value="all">All Clients ({clients.length})</option>
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Subject</label>
                  <input type="text" required value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} placeholder="Email subject..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50" />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Message</label>
                  <textarea required rows={5} value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} placeholder="Write your message..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none focus:outline-none focus:border-pink-500/50" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowBroadcastModal(false)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10">Cancel</button>
                  <button type="submit" disabled={sendingBroadcast} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                    {sendingBroadcast ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sendingBroadcast ? 'Sending...' : 'Send Broadcast'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

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
              className="glass-neon rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-white mb-6">Create Invoice</h2>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                {/* Line Items Section */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-slate-400 text-sm">Line Items</label>
                    <button 
                      type="button"
                      onClick={addInvoiceItem}
                      className="text-sm text-slap-cyan hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {invoiceItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Rate £"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateInvoiceItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                        />
                        <div className="w-20 px-3 py-2 rounded-lg bg-white/10 text-white text-sm text-center">
                          £{(item.quantity * item.rate).toFixed(2)}
                        </div>
                        {invoiceItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInvoiceItem(index)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-end pt-3 border-t border-white/10 mt-3">
                    <div className="text-right">
                      <span className="text-slate-400 text-sm">Total: </span>
                      <span className="text-xl font-bold text-white">
                        £{invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Status</label>
                    <select name="status" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
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
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowInvoiceModal(false)
                      setInvoiceItems([{ description: '', quantity: 1, rate: 0 }])
                    }} 
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                    Create Invoice
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
                
                {/* GitHub Integration */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub Repo (Optional)
                  </label>
                  <input 
                    name="github_repo_url" 
                    type="url" 
                    placeholder="https://github.com/owner/repo" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white mb-2" 
                  />
                  <input 
                    name="github_branch" 
                    type="text" 
                    defaultValue="main"
                    placeholder="main" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm" 
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Link a GitHub repo to track commits and generate daily summaries
                  </p>
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
                A secure password will be auto-generated and emailed to the client.
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
                
                {/* GitHub Integration */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub Repo (Optional)
                  </label>
                  <input 
                    name="github_repo_url" 
                    type="url" 
                    defaultValue={editingProject.github_repo_url || ''}
                    placeholder="https://github.com/owner/repo" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white mb-2" 
                  />
                  <input 
                    name="github_branch" 
                    type="text" 
                    defaultValue={editingProject.github_branch || 'main'}
                    placeholder="main" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm" 
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Link a GitHub repo to track commits and generate daily summaries
                  </p>
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

              {/* Milestones */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-cyan-400" /> Milestones</h3>
                <div className="space-y-2 mb-3">
                  {milestones.map((m: any) => (
                    <div key={m.id} className="flex items-center gap-2 group">
                      <button onClick={() => toggleMilestone(m.id, editingProject!.id, m.status)} className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${m.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-white/20 hover:border-pink-500'}`}>
                        {m.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <span className={`flex-1 text-sm ${m.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>{m.title}</span>
                      <button onClick={() => deleteMilestone(m.id, editingProject!.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement; addMilestone(editingProject!.id, input.value); input.value = '' }} className="flex gap-2">
                  <input type="text" placeholder="Add milestone..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500" />
                  <button type="submit" className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-bold hover:bg-cyan-500/30"><Plus className="w-4 h-4" /></button>
                </form>
              </div>
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
        {/* Credentials Modal */}
        {selectedProjectForCreds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => { setSelectedProjectForCreds(null); setShowAddCred(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-neon rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Credentials & API Keys</h2>
                    <p className="text-sm text-slate-400">{projects.find((p: Project) => p.id === selectedProjectForCreds)?.name}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedProjectForCreds(null); setShowAddCred(false) }} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Existing Credentials */}
              <div className="space-y-3 mb-6">
                {credentials.length === 0 && !showAddCred && (
                  <p className="text-slate-500 text-center py-8">No credentials stored yet</p>
                )}
                {credentials.map((cred) => (
                  <div key={cred.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400">
                          {credentialTypeLabels[cred.credential_type] || cred.credential_type}
                        </span>
                        <span className="font-bold text-white text-sm">{cred.label}</span>
                      </div>
                      <button onClick={() => handleDeleteCredential(cred.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {cred.username && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 w-16">Username</span>
                        <span className="text-sm text-slate-300 font-mono">{cred.username}</span>
                        <button onClick={() => copyToClipboard(cred.username!)} className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white"><Copy className="w-3 h-3" /></button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 w-16">Value</span>
                      <span className="text-sm text-slate-300 font-mono flex-1 break-all">
                        {visibleCreds.has(cred.id) ? cred.value : '•'.repeat(Math.min(cred.value.length, 32))}
                      </span>
                      <button onClick={() => toggleCredVisibility(cred.id)} className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white">
                        {visibleCreds.has(cred.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button onClick={() => copyToClipboard(cred.value)} className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white"><Copy className="w-3 h-3" /></button>
                    </div>

                    {cred.url && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 w-16">URL</span>
                        <a href={cred.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline truncate">{cred.url}</a>
                      </div>
                    )}

                    {cred.notes && (
                      <p className="text-xs text-slate-500 italic mt-2">{cred.notes}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Credential Form */}
              {showAddCred ? (
                <form onSubmit={handleAddCredential} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <h3 className="font-bold text-white text-sm mb-3">Add Credential</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Label *</label>
                      <input name="label" type="text" required placeholder="e.g. Stripe Live Key" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Type</label>
                      <select name="credential_type" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                        {Object.entries(credentialTypeLabels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Value / Key / Password *</label>
                    <input name="value" type="text" required placeholder="sk_live_..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Username</label>
                      <input name="username" type="text" placeholder="admin@..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">URL</label>
                      <input name="url" type="url" placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Notes</label>
                    <input name="notes" type="text" placeholder="Optional notes..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddCred(false)} className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white text-sm font-bold hover:bg-white/10">Cancel</button>
                    <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold">Save</button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddCred(true)}
                  className="w-full p-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Credential
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
