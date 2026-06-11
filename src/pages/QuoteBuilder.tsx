import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, CheckCircle, Globe, ShoppingCart, Palette,
  Ticket, Calendar, UtensilsCrossed, Home, GraduationCap, CalendarDays, Monitor,
  ChevronRight, Send, Loader2, FileText,
  Users, CreditCard, BarChart3, Share2,
  PenTool, Layers, Megaphone, Briefcase, MessageSquare, Server, Shield,
  Paintbrush, Code
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { sendEmail, quoteConfirmationEmail } from '../lib/email'
import { toast } from 'sonner'

const stepLabels = [
  { num: 1, label: 'Services', icon: Layers },
  { num: 2, label: 'Features', icon: PenTool },
  { num: 3, label: 'Details', icon: FileText },
  { num: 4, label: 'Contact', icon: Users },
]

const serviceCategories = [
  {
    title: 'Core Web Services',
    services: [
      { id: 'custom-website', icon: Globe, title: 'Custom Website', desc: 'Unique design tailored to your brand', popular: true },
      { id: 'ecommerce', icon: ShoppingCart, title: 'E-Commerce Store', desc: 'Sell products online with payments', popular: true },
      { id: 'landing-page', icon: Monitor, title: 'Landing Page', desc: 'High-converting single page site' },
      { id: 'portfolio', icon: Palette, title: 'Portfolio', desc: 'Showcase your work professionally' },
      { id: 'blog', icon: FileText, title: 'Blog / Magazine', desc: 'Content publishing platform' },
      { id: 'membership', icon: Users, title: 'Membership Site', desc: 'Gated content & user accounts' },
    ]
  },
  {
    title: 'Industry Solutions',
    services: [
      { id: 'booking', icon: Calendar, title: 'Booking System', desc: 'Appointments & reservations', popular: true },
      { id: 'restaurant', icon: UtensilsCrossed, title: 'Restaurant Platform', desc: 'Menu, orders & bookings' },
      { id: 'real-estate', icon: Home, title: 'Real Estate', desc: 'Property listings & search' },
      { id: 'education', icon: GraduationCap, title: 'E-Learning', desc: 'Courses & student portal' },
      { id: 'events', icon: CalendarDays, title: 'Events Platform', desc: 'Ticketing & management' },
      { id: 'competition', icon: Ticket, title: 'Competition Site', desc: 'Raffles & prize draws' },
    ]
  },
  {
    title: 'Business Apps',
    services: [
      { id: 'marketplace', icon: ShoppingCart, title: 'Marketplace', desc: 'Multi-vendor platform', popular: true },
      { id: 'dashboard', icon: BarChart3, title: 'Admin Dashboard', desc: 'Data & analytics panel' },
      { id: 'crm', icon: Briefcase, title: 'CRM System', desc: 'Customer management' },
      { id: 'saas', icon: Server, title: 'SaaS Platform', desc: 'Software as a service' },
      { id: 'social', icon: Share2, title: 'Social Network', desc: 'Community platform' },
      { id: 'messaging', icon: MessageSquare, title: 'Chat App', desc: 'Real-time messaging' },
    ]
  }
]


const featureGroups = [
  {
    title: 'Design & Branding',
    icon: Paintbrush,
    features: [
      { id: 'custom-design', label: 'Custom Design' },
      { id: 'responsive', label: 'Mobile Responsive' },
      { id: 'dark-mode', label: 'Dark Mode' },
      { id: 'logo', label: 'Logo Design' },
      { id: 'animations', label: 'Animations' },
      { id: 'brand-kit', label: 'Brand Kit' },
    ]
  },
  {
    title: 'E-Commerce',
    icon: CreditCard,
    features: [
      { id: 'payments', label: 'Payment Gateway' },
      { id: 'subscriptions', label: 'Subscriptions' },
      { id: 'inventory', label: 'Inventory' },
      { id: 'discounts', label: 'Discounts' },
      { id: 'multi-currency', label: 'Multi-Currency' },
      { id: 'invoicing', label: 'Invoicing' },
    ]
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    features: [
      { id: 'seo', label: 'SEO Setup' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'social', label: 'Social Media' },
      { id: 'email', label: 'Email Marketing' },
      { id: 'blog', label: 'Blog' },
      { id: 'reviews', label: 'Reviews' },
    ]
  },
  {
    title: 'Advanced',
    icon: Code,
    features: [
      { id: 'user-accounts', label: 'User Accounts' },
      { id: 'search', label: 'Site Search' },
      { id: 'forms', label: 'Custom Forms' },
      { id: 'booking', label: 'Booking System' },
      { id: 'chat', label: 'Live Chat' },
      { id: 'api', label: 'API Integration' },
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    features: [
      { id: 'ssl', label: 'SSL Certificate' },
      { id: 'speed', label: 'Speed Optimization' },
      { id: 'backups', label: 'Auto Backups' },
      { id: 'security', label: 'Security Scan' },
      { id: 'cdn', label: 'CDN Setup' },
      { id: 'maintenance', label: 'Maintenance' },
    ]
  }
]


const timelines = [
  { value: 'asap', label: 'ASAP', desc: 'Rush delivery' },
  { value: '1-2weeks', label: '1-2 Weeks', desc: 'Fast track' },
  { value: '2-4weeks', label: '2-4 Weeks', desc: 'Standard' },
  { value: '1-2months', label: '1-2 Months', desc: 'Complex' },
  { value: '3months', label: '3+ Months', desc: 'Enterprise' },
  { value: 'flexible', label: 'Flexible', desc: 'No deadline' },
]

const budgets = [
  { value: 'commission', label: 'Commission Partnership', desc: 'Free setup, we take %', badge: 'BEST' },
  { value: 'free-setup', label: 'Free Setup', desc: 'Subject to terms', badge: 'NEW' },
  { value: 'under-1k', label: 'Under £1,000', desc: 'Starter sites' },
  { value: '1k-3k', label: '£1,000 - £3,000', desc: 'Small business' },
  { value: '3k-5k', label: '£3,000 - £5,000', desc: 'Advanced' },
  { value: '5k-10k', label: '£5,000 - £10,000', desc: 'Custom platform' },
  { value: '10k-plus', label: '£10,000+', desc: 'Enterprise' },
  { value: 'discuss', label: 'Discuss with me', desc: 'Need advice' },
]

const industries = [
  'E-Commerce', 'Restaurant', 'Real Estate', 'Healthcare', 'Education',
  'Fitness', 'Finance', 'Technology', 'Entertainment', 'Automotive',
  'Travel', 'Professional Services', 'Fashion', 'Construction', 'Other'
]

export default function QuoteBuilder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [timeline, setTimeline] = useState('')
  const [budget, setBudget] = useState('')
  const [industry, setIndustry] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [pages, setPages] = useState('')
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'whatsapp'>('email')

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!name || !email) {
      toast.error('Please fill in your name and email')
      return
    }

    setSubmitting(true)
    
    const { error } = await supabase.from('quotes').insert({
      name,
      email,
      phone,
      company,
      services: selectedServices,
      features: selectedFeatures,
      timeline,
      budget,
      industry,
      project_details: projectDesc,
      pages_needed: pages,
      preferred_contact: contactMethod,
      status: 'pending'
    })

    if (error) {
      toast.error('Failed to submit. Please try again.')
    } else {
      toast.success('Quote submitted! We\'ll be in touch within 24 hours.')
      // Send confirmation email (fire and forget)
      sendEmail(email, 'Your quote request - Sites That Slap', quoteConfirmationEmail(name))
      navigate('/')
    }
    setSubmitting(false)
  }

  const canProceed = () => {
    if (step === 1) return selectedServices.length > 0
    if (step === 2) return true
    if (step === 3) return timeline && budget
    return name && email
  }

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Header */}
      <div className="pt-20 pb-4 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Get Your <span className="neon-text-pink">Quote</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Step {step} of 4: {stepLabels[step-1].label}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`h-2 rounded-full flex-1 transition-all ${
                  s <= step ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-white/10'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {stepLabels.map((s) => {
              const Icon = s.icon
              const active = step >= s.num
              return (
                <div key={s.num} className={`flex items-center gap-1 text-xs ${active ? 'text-white' : 'text-slate-500'}`}>
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SERVICES */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold text-white mb-2">What do you need?</h2>
                <p className="text-slate-400 text-sm mb-6">Select all that apply. You can choose multiple.</p>
                
                {serviceCategories.map((category) => (
                  <div key={category.title} className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">{category.title}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.services.map((service) => {
                        const Icon = service.icon
                        const isSelected = selectedServices.includes(service.id)
                        return (
                          <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-4 rounded-xl border text-left transition-all relative ${
                              isSelected 
                                ? 'border-pink-500 bg-pink-500/10' 
                                : 'border-white/10 bg-white/5 hover:border-white/30'
                            }`}
                          >
                            {service.popular && (
                              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full">
                                POPULAR
                              </span>
                            )}
                            <div className="flex items-start justify-between mb-2">
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-pink-400' : 'text-slate-400'}`} />
                              {isSelected && <CheckCircle className="w-4 h-4 text-pink-400" />}
                            </div>
                            <h4 className="font-semibold text-white text-sm">{service.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{service.desc}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* STEP 2: FEATURES */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold text-white mb-2">What features do you need?</h2>
                <p className="text-slate-400 text-sm mb-6">Select the features for your project.</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {featureGroups.map((group) => {
                    const GroupIcon = group.icon
                    return (
                      <div key={group.title} className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <GroupIcon className="w-4 h-4 text-pink-400" />
                          <h3 className="font-semibold text-white text-sm">{group.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.features.map((feature) => {
                            const isSelected = selectedFeatures.includes(feature.id)
                            return (
                              <button
                                key={feature.id}
                                onClick={() => toggleFeature(feature.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                }`}
                              >
                                {feature.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Timeline</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timelines.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTimeline(t.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          timeline === t.value 
                            ? 'border-cyan-500 bg-cyan-500/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <p className="font-semibold text-white text-sm">{t.label}</p>
                        <p className="text-xs text-slate-400">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Budget</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {budgets.map((b) => (
                      <button
                        key={b.value}
                        onClick={() => setBudget(b.value)}
                        className={`p-4 rounded-xl border text-left transition-all relative ${
                          budget === b.value 
                            ? 'border-green-500 bg-green-500/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        {b.badge && (
                          <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            b.badge === 'BEST' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {b.badge}
                          </span>
                        )}
                        <p className="font-semibold text-white">{b.label}</p>
                        <p className="text-xs text-slate-400">{b.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    >
                      <option value="">Select your industry...</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Pages Needed</label>
                    <select
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    >
                      <option value="">How many pages?</option>
                      <option value="1">Single Page</option>
                      <option value="2-5">2-5 Pages</option>
                      <option value="5-10">5-10 Pages</option>
                      <option value="10-20">10-20 Pages</option>
                      <option value="20+">20+ Pages</option>
                      <option value="not-sure">Not Sure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Tell us about your project</label>
                  <textarea
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white placeholder-slate-500 focus:border-pink-500 outline-none resize-none"
                    placeholder="What are your goals? Any specific requirements?"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 4: CONTACT */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold text-white mb-2">Your Details</h2>
                <p className="text-slate-400 text-sm mb-6">We'll send your quote to this information.</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                      placeholder="+44..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                      placeholder="Your company (optional)"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Preferred Contact Method</label>
                  <div className="flex gap-3">
                    {(['email', 'phone', 'whatsapp'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setContactMethod(method)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          contactMethod === method
                            ? 'bg-pink-500 text-white'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                  <h3 className="font-semibold text-white mb-3">Quote Summary</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-400"><span className="text-slate-300">Services:</span> {selectedServices.length} selected</p>
                    <p className="text-slate-400"><span className="text-slate-300">Features:</span> {selectedFeatures.length} selected</p>
                    <p className="text-slate-400"><span className="text-slate-300">Timeline:</span> {timeline ? timelines.find(t => t.value === timeline)?.label : 'Not set'}</p>
                    <p className="text-slate-400"><span className="text-slate-300">Budget:</span> {budget ? budgets.find(b => b.value === budget)?.label : 'Not set'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium disabled:opacity-30"
            >
              Back
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !canProceed()}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Submit Quote
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
