import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { 
  FileText, CreditCard, MessageSquare, CheckCircle2, 
  Clock, Download, LogOut, User, Loader2, Send
} from 'lucide-react'

interface Project {
  id: string
  name: string
  status: 'in_progress' | 'review' | 'completed' | 'on_hold'
  progress: number
  deadline: string
  description?: string
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
}

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices' | 'messages'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: projectsData }, { data: invoicesData }, { data: messagesData }] = await Promise.all([
      supabase.from('projects').select('*').eq('client_id', user?.id).order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').eq('client_id', user?.id).order('created_at', { ascending: false }),
      supabase.from('messages').select('*').eq('client_id', user?.id).order('created_at', { ascending: true })
    ])
    setProjects(projectsData || [])
    setInvoices(invoicesData || [])
    setMessages(messagesData || [])
    setLoading(false)
  }

  const handlePayInvoice = async (invoiceId: string) => {
    setPayingInvoice(invoiceId)
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId)
    await fetchData()
    setPayingInvoice(null)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return
    
    await supabase.from('messages').insert({
      client_id: user.id,
      sender: 'client',
      content: newMessage.trim()
    })
    setNewMessage('')
    fetchData()
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Generate simple PDF-like text and download
    const content = `
INVOICE
=======
Invoice #: ${invoice.invoice_number}
Date: ${invoice.date}
Due Date: ${invoice.due_date}
Status: ${invoice.status.toUpperCase()}

Amount: £${invoice.amount.toLocaleString()}

Thank you for your business!
    `.trim()
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoice.invoice_number}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                </div>
              ) : projects.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No projects yet</p>
              ) : (
                projects.map((project: Project) => (
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
                ))
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
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{invoice.invoice_number}</p>
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
                          <button 
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="text-slate-400 hover:text-white"
                            title="Download invoice"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handlePayInvoice(invoice.id)}
                            disabled={payingInvoice === invoice.id}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold disabled:opacity-50"
                          >
                            {payingInvoice === invoice.id ? 'Processing...' : 'Pay Now'}
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
                        <p>{message.content}</p>
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
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
