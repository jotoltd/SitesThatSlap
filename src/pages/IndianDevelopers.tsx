import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, Zap, Users, CheckCircle, Loader2, 
  Send, Laptop
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

const skills = [
  'React / Next.js',
  'Node.js / Express',
  'Python / Django',
  'PHP / Laravel',
  'Mobile Development',
  'UI/UX Design',
  'Database Management',
  'Cloud Services',
  'DevOps',
  'AI/ML Integration',
]

const benefits = [
  {
    icon: Globe,
    title: 'Global Clients',
    desc: 'Work with international clients and build your portfolio'
  },
  {
    icon: Zap,
    title: 'Competitive Pay',
    desc: 'Above-market rates with timely payments in your currency'
  },
  {
    icon: Users,
    title: 'Growth & Learning',
    desc: 'Access to training, mentorship, and career advancement'
  },
  {
    icon: Laptop,
    title: 'Remote First',
    desc: 'Work from anywhere with flexible hours'
  },
]

export default function IndianDevelopers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: [] as string[],
    portfolio: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email')
      return
    }

    setSubmitting(true)
    
    const { error } = await supabase.from('developer_applications').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      experience: formData.experience,
      skills: formData.skills,
      portfolio: formData.portfolio,
      message: formData.message,
      status: 'new'
    })

    if (error) {
      toast.error('Failed to submit application. Please try again.')
    } else {
      toast.success('Application submitted successfully!')
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Application Received!</h2>
          <p className="text-slate-400 mb-8">
            Thank you for your interest. Our team will review your application and contact you within 48 hours.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-purple-500/10 to-transparent" />
        
        <div className="relative pt-20 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-6">
                <span className="text-2xl">🇮🇳</span>
                <span className="text-2xl">🇵🇰</span>
                <span className="text-pink-400 text-sm font-semibold">Join Our Developer Network</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                Indian & Pakistani<br />
                <span className="neon-text-pink">Developers Wanted</span>
              </h1>
              
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                We're building the best remote developer network in India and Pakistan. 
                Join us and work on exciting global projects from anywhere.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Remote Work
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Competitive Pay
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Flexible Hours
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Global Clients
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 px-6 bg-[#070712]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Why Join <span className="neon-text-cyan">Us?</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-neon rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl font-black text-white text-center mb-2">Apply Now</h2>
            <p className="text-slate-400 text-center mb-10">
              Fill in your details and we'll get back to you within 48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone & Experience */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                    placeholder="+91 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Years of Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years (Fresher)</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Your Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const isSelected = formData.skills.includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:border-pink-500/30'
                        }`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Portfolio / GitHub / LinkedIn</label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Tell us about yourself</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none resize-none"
                  placeholder="Your experience, achievements, why you want to join us..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="w-5 h-5" /> Submit Application</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Sites That Slap. All applications are confidential.
          </p>
        </div>
      </footer>
    </div>
  )
}
