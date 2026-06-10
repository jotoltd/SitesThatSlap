import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, CheckCircle, Globe, ShoppingCart, Smartphone, Zap, Palette, Rocket,
  Ticket, Calendar, UtensilsCrossed, Home, GraduationCap, CalendarDays,
  ChevronRight, Send, Loader2
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

const services = [
  { id: 'custom-websites', icon: Globe, title: 'Custom Websites', desc: 'Bespoke websites built from scratch' },
  { id: 'ecommerce', icon: ShoppingCart, title: 'E-Commerce', desc: 'Online stores that convert' },
  { id: 'responsive-design', icon: Smartphone, title: 'Responsive Design', desc: 'Mobile-first development' },
  { id: 'performance', icon: Zap, title: 'Performance', desc: 'Speed optimization' },
  { id: 'brand-identity', icon: Palette, title: 'Brand Identity', desc: 'Logo and branding packages' },
  { id: 'seo-growth', icon: Rocket, title: 'SEO & Growth', desc: 'Rank higher on Google' },
]

const specialties = [
  { id: 'raffle-websites', icon: Ticket, title: 'Raffle Websites', desc: 'Competition platforms' },
  { id: 'booking-systems', icon: Calendar, title: 'Booking Systems', desc: 'Appointment scheduling' },
  { id: 'restaurant-systems', icon: UtensilsCrossed, title: 'Restaurant Systems', desc: 'Complete restaurant solutions' },
  { id: 'real-estate', icon: Home, title: 'Real Estate', desc: 'Property platforms' },
  { id: 'elearning', icon: GraduationCap, title: 'E-Learning', desc: 'Course platforms' },
  { id: 'event-platforms', icon: CalendarDays, title: 'Event Platforms', desc: 'Event management' },
]

const features = [
  'Custom Design',
  'Mobile Responsive',
  'SEO Optimized',
  'Fast Loading',
  'CMS Included',
  'Analytics Setup',
  'Social Media Integration',
  'Contact Forms',
  'Blog Setup',
  'E-commerce Ready',
  'Booking System',
  'User Accounts',
  'Payment Gateway',
  'Email Notifications',
  'Admin Dashboard',
  'Content Migration',
]

const timelines = [
  { value: 'asap', label: 'ASAP - Rush Project' },
  { value: '2-4weeks', label: '2-4 Weeks' },
  { value: '1-2months', label: '1-2 Months' },
  { value: '3months', label: '3+ Months' },
  { value: 'flexible', label: 'Flexible / Not Sure' },
]

const budgets = [
  { value: 'commission', label: 'Commission-Based Partnership', desc: 'Revenue share arrangement' },
  { value: 'free-setup', label: 'Free Setup Available', desc: 'Subject to project scope and terms' },
  { value: 'small', label: 'Small Project', desc: 'Basic website/package' },
  { value: 'medium', label: 'Medium Project', desc: 'Advanced features' },
  { value: 'large', label: 'Large Project', desc: 'Enterprise solution' },
  { value: 'discuss', label: 'Let\'s Discuss', desc: 'Need guidance on budget' },
]

export default function QuoteBuilder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  
  // Quote data
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [timeline, setTimeline] = useState('')
  const [budget, setBudget] = useState('')
  const [projectDetails, setProjectDetails] = useState('')
  
  // Contact info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
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
      project_details: projectDetails,
      status: 'pending'
    })

    if (error) {
      toast.error('Failed to submit quote request')
    } else {
      toast.success('Quote request submitted! We\'ll be in touch soon.')
      navigate('/')
    }
    setSubmitting(false)
  }

  const allServices = [...services, ...specialties]

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Header */}
      <div className="pt-24 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Build Your <span className="neon-text-pink">Quote</span>
          </h1>
          <p className="text-xl text-slate-400">
            Flexible pricing options available including commission-based partnerships and free setup subject to project scope.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= s ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-12 h-1 rounded-full transition-colors ${
                    step > s ? 'bg-pink-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Services */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-6">What services do you need?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allServices.map((service) => {
                  const Icon = service.icon
                  const isSelected = selectedServices.includes(service.id)
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'border-pink-500 bg-pink-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className={`w-8 h-8 ${isSelected ? 'text-pink-400' : 'text-slate-400'}`} />
                        {isSelected && <CheckCircle className="w-5 h-5 text-pink-400" />}
                      </div>
                      <h3 className="font-bold text-white mb-1">{service.title}</h3>
                      <p className="text-sm text-slate-400">{service.desc}</p>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Features */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-6">Select features you need</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {features.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature)
                  return (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isSelected 
                          ? 'border-pink-500 bg-pink-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-pink-500 border-pink-500' : 'border-slate-500'
                      }`}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>{feature}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Timeline & Budget */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">When do you need it?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timelines.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTimeline(t.value)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        timeline === t.value 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <h3 className="font-semibold text-white">{t.label}</h3>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Budget / Partnership Type</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {budgets.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`p-5 rounded-xl border text-left transition-all ${
                        budget === b.value 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{b.label}</h3>
                        {budget === b.value && <CheckCircle className="w-5 h-5 text-green-400" />}
                      </div>
                      <p className="text-sm text-slate-400">{b.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                  <p className="text-white font-semibold mb-2">Flexible Options Available</p>
                  <p className="text-slate-300 text-sm">
                    We offer commission-based partnerships where we build your site for free in exchange for a percentage of revenue. 
                    We also provide completely free setup for qualifying projects. Let's discuss what works best for you!
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Tell us about your project</h2>
                <textarea
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white placeholder-slate-500 focus:border-pink-500 outline-none resize-none"
                  placeholder="Describe your project, goals, and any specific requirements..."
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact Info */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-6">Your Contact Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    placeholder="+44 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    placeholder="Company name (optional)"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Quote Summary</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-400">
                    <span className="text-slate-300">Services:</span> {selectedServices.length > 0 
                      ? allServices.filter(s => selectedServices.includes(s.id)).map(s => s.title).join(', ') 
                      : 'None selected'}
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-300">Features:</span> {selectedFeatures.length > 0 
                      ? selectedFeatures.join(', ') 
                      : 'None selected'}
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-300">Timeline:</span> {timeline ? timelines.find(t => t.value === timeline)?.label : 'Not selected'}
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-300">Budget:</span> {budget ? budgets.find(b => b.value === budget)?.label : 'Not selected'}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-pink-400 font-semibold">
                    We'll review your requirements and get back to you with a custom proposal.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold flex items-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Submit Quote Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
