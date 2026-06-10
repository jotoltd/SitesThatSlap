import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import {
  Rocket, Palette, Zap, Globe, Smartphone, ShoppingCart, ArrowRight, Star,
  CheckCircle2, MapPin, Mail, Phone, Menu, X,
  Ticket, Shield, Calendar, UtensilsCrossed, Home,
  GraduationCap, CalendarDays, Trophy,
} from 'lucide-react'

// ── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2200)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ background: '#07070f' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <div className="relative flex flex-col items-center gap-8">
        <motion.div
          className="w-28 h-28 rounded-full"
          style={{
            border: '3px solid transparent',
            borderTopColor: '#FF006E',
            borderRightColor: '#8338EC',
            borderBottomColor: '#3A86FF',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-0 left-0 w-28 h-28 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-white font-black text-5xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>S</span>
        </motion.div>
        <motion.p
          className="neon-text-pink font-bold tracking-widest text-sm uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1] }}
          transition={{ delay: 0.6, duration: 1.4, repeat: Infinity }}
        >
          Booting up...
        </motion.p>
      </div>
    </motion.div>
  )
}

// ── Neon Orb decorations ──────────────────────────────────────────────────────
function NeonOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" style={{ animationDelay: '-4s' }} />
    </>
  )
}

// ── Navigation ───────────────────────────────────────────────────────────────
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#07070f]/90 backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }} className="text-2xl font-black text-white tracking-tight">
          Sites<span className="neon-text-pink">That</span>Slap
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Home
          </a>
          <Link to="/services" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Services
          </Link>
          <a href="#work" onClick={(e) => { e.preventDefault(); scrollToSection('#work'); }} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Work
          </a>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            About
          </a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Contact
          </a>
          <Link to="/login" className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm hover:scale-105 transition-transform">
            Client Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-[#07070f]/95 backdrop-blur-md border-t border-white/10"
        >
          <div className="flex flex-col p-6 gap-4">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }} className="text-lg font-semibold text-slate-300 hover:text-white transition-colors">
              Home
            </a>
            <Link to="/services" className="text-lg font-semibold text-slate-300 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollToSection('#work'); }} className="text-lg font-semibold text-slate-300 hover:text-white transition-colors">
              Work
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }} className="text-lg font-semibold text-slate-300 hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="text-lg font-semibold text-slate-300 hover:text-white transition-colors">
              Contact
            </a>
            <Link to="/login" className="px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-center" onClick={() => setIsOpen(false)}>
              Client Login
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToWork = () => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="min-h-screen neon-grid scanlines bg-[#07070f] flex items-center justify-center pt-20">
      <NeonOrbs />
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 neon-border-pink" style={{ background: 'rgba(255,0,110,0.08)' }}>
            <Star className="w-4 h-4 text-slap-yellow fill-slap-yellow" />
            <span className="font-bold text-slap-yellow text-sm tracking-widest uppercase">Based in Leeds, West Yorkshire</span>
          </div>
          <h1 className="text-[clamp(3rem,12vw,9rem)] font-black tracking-tighter leading-[0.85] uppercase mb-10">
            <span className="block text-white">Websites</span>
            <span className="block text-white">That</span>
            <span className="block hero-text-glow mt-2">SLAP</span>
            <span className="block stroke-text-neon mt-2">HARD</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto mb-12 leading-relaxed">
            Cool, modern, big and bold web solutions for businesses that refuse to be boring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button onClick={scrollToContact} className="px-10 py-5 gradient-slap text-white font-black text-xl rounded-full glow-pink flex items-center gap-3 justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              Start Your Project <ArrowRight className="w-6 h-6" />
            </motion.button>
            <motion.button onClick={scrollToWork} className="px-10 py-5 font-black text-xl rounded-full text-white neon-border-cyan" style={{ background: 'rgba(58,134,255,0.08)' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              View Our Work
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="absolute top-8 right-8 w-16 h-16 rounded-2xl neon-border-pink flex items-center justify-center hidden lg:flex" style={{ background: 'rgba(255,0,110,0.1)' }} animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
          <Rocket className="w-8 h-8 neon-text-pink" />
        </motion.div>
        <motion.div className="absolute bottom-24 left-8 w-16 h-16 rounded-full neon-border-cyan flex items-center justify-center hidden lg:flex" style={{ background: 'rgba(58,134,255,0.1)' }} animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
          <Zap className="w-8 h-8 neon-text-cyan" />
        </motion.div>
      </div>
    </section>
  )
}

// ── Stats Section ────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { number: '150+', label: 'Websites Launched', cls: 'neon-text-pink' },
    { number: '98%', label: 'Happy Clients', cls: 'neon-text-green' },
    { number: '5★', label: 'Star Rating', cls: 'neon-text-yellow' },
    { number: '24/7', label: 'Support', cls: 'neon-text-cyan' },
  ]

  return (
    <section className="py-24 bg-[#07070f] neon-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slap-purple/5 to-transparent" />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">Numbers That <span className="neon-text-pink">Slap</span></h2>
          <p className="text-slate-400 font-bold text-xl">Hard facts, zero fluff</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center p-6 rounded-2xl neon-gradient-border"
              style={{ background: 'rgba(10,10,30,0.6)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
            >
              <div className={`text-5xl md:text-7xl font-black mb-2 ${stat.cls}`}>{stat.number}</div>
              <div className="text-slate-400 font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Services Section ─────────────────────────────────────────────────────────
function ServicesSection() {
  const [openService, setOpenService] = useState<number | null>(null)

  const services = [
    { icon: Globe, title: 'Custom Websites', desc: 'Bespoke websites built from scratch that perfectly represent your brand and convert visitors.', border: 'neon-border-pink', glow: 'neon-text-pink', details: ['Fully custom design tailored to your brand', 'Mobile-first responsive development', 'SEO optimized structure', 'Fast loading speeds', 'Content management system included', '3 rounds of revisions'] },
    { icon: ShoppingCart, title: 'E-Commerce', desc: 'Powerful online stores that make selling easy. From small shops to enterprise solutions.', border: 'neon-border-purple', glow: 'neon-text-purple', details: ['Secure payment gateway integration', 'Inventory management system', 'Customer account management', 'Order tracking and notifications', 'Abandoned cart recovery', 'Multi-currency support'] },
    { icon: Smartphone, title: 'Responsive Design', desc: 'Sites that look incredible on every device. Mobile-first approach for maximum reach.', border: 'neon-border-cyan', glow: 'neon-text-cyan', details: ['Mobile-first design approach', 'Tablet and desktop optimization', 'Touch-friendly interfaces', 'Cross-browser compatibility', 'Accessibility compliance (WCAG)', 'Performance optimized for mobile'] },
    { icon: Zap, title: 'Performance', desc: 'Lightning-fast load times and optimized code that keeps visitors engaged.', border: 'neon-border-pink', glow: 'neon-text-pink', details: ['Core Web Vitals optimization', 'Image and asset optimization', 'CDN implementation', 'Lazy loading for images', 'Code splitting and minification', 'Caching strategies'] },
    { icon: Palette, title: 'Brand Identity', desc: 'Complete brand packages including logos, color schemes, and visual guidelines.', border: 'neon-border-purple', glow: 'neon-text-purple', details: ['Logo design and variations', 'Color palette definition', 'Typography selection', 'Brand style guide', 'Business card designs', 'Social media assets'] },
    { icon: Rocket, title: 'SEO & Growth', desc: 'Data-driven strategies to get your site ranking and drive organic traffic.', border: 'neon-border-green', glow: 'neon-text-green', details: ['Keyword research and strategy', 'On-page SEO optimization', 'Technical SEO audit', 'Content strategy', 'Analytics setup and tracking', 'Monthly performance reports'] },
  ]

  const specialties = [
    { icon: Ticket, title: 'Raffle Websites', color: 'from-pink-500 to-purple-500', desc: 'Custom-built raffle & competition platforms with secure payments and automated winner selection.', details: ['Secure payment processing', 'Real-time ticket sales tracking', 'Automated winner selection', 'Gambling Commission compliance', 'Admin dashboard', 'Email notifications'] },
    { icon: Calendar, title: 'Booking Systems', color: 'from-cyan-500 to-blue-500', desc: 'Custom appointment & reservation systems for salons, clinics, restaurants, and events.', details: ['Online appointment scheduling', 'Staff management', 'Automated reminders', 'Payment integration', 'Calendar sync (Google, Outlook)', 'Customer management'] },
    { icon: UtensilsCrossed, title: 'Restaurant Systems', color: 'from-green-500 to-emerald-500', desc: 'Complete restaurant platforms with online menus, table reservations, and ordering.', details: ['Digital menus with photos', 'Table reservations', 'Online ordering & delivery', 'Kitchen management display', 'Payment processing', 'Loyalty program'] },
    { icon: Home, title: 'Real Estate', color: 'from-purple-500 to-pink-500', desc: 'Property platforms with search, filters, agent portals, and virtual tours.', details: ['Advanced property search', 'Agent portals & CRM', 'Virtual tours & galleries', 'Mortgage calculators', 'Property alerts', 'Lead management'] },
    { icon: GraduationCap, title: 'E-Learning', color: 'from-yellow-500 to-orange-500', desc: 'Online course platforms with video lessons, quizzes, and progress tracking.', details: ['Video course hosting', 'Quizzes & assessments', 'Progress tracking', 'Student certificates', 'Drip content scheduling', 'Student analytics'] },
    { icon: CalendarDays, title: 'Event Platforms', color: 'from-orange-500 to-red-500', desc: 'Event management with ticketing, registration, and attendee management.', details: ['Online ticketing', 'Attendee registration', 'Event scheduling', 'QR code check-in', 'Email notifications', 'Analytics dashboard'] },
  ]

  return (
    <section id="services" className="py-24 bg-[#070712] neon-grid relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 w-80 h-80 neon-orb-pink opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-cyan opacity-20 morph-blob" style={{ animationDelay: '-4s' }} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We <span className="neon-text-purple">Do Best</span>
          </motion.h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to dominate the digital space</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className={`p-6 rounded-2xl ${s.border} group cursor-pointer`}
              style={{ background: 'rgba(10,10,30,0.7)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setOpenService(i)}
            >
              <s.icon className={`w-10 h-10 mb-4 ${s.glow}`} />
              <h3 className="text-xl font-black text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{s.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click for details <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <h3 className="text-center text-3xl font-black text-white mb-10">Specialty <span className="neon-text-pink">Services</span></h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((s, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl border border-white/10 group cursor-pointer"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02, borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => setOpenService(100 + i)}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-black text-white mb-2">{s.title}</h4>
              <p className="text-slate-400 text-sm font-medium">{s.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click for details <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      {openService !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpenService(null)}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0a0a1a] p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setOpenService(null)}
            >
              <X className="w-5 h-5" />
            </button>
            
            {openService < 100 ? (
              // Main services
              <>
                {(() => {
                  const s = services[openService]
                  return (
                    <>
                      <s.icon className={`w-16 h-16 mb-6 ${s.glow}`} />
                      <h3 className="text-3xl font-black text-white mb-4">{s.title}</h3>
                      <p className="text-slate-400 text-lg mb-8">{s.desc}</p>
                      <h4 className="text-xl font-bold text-white mb-4">What's Included:</h4>
                      <ul className="space-y-3">
                        {s.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-300">
                            <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                })()}
              </>
            ) : (
              // Specialty services
              <>
                {(() => {
                  const s = specialties[openService - 100]
                  return (
                    <>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6`}>
                        <s.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4">{s.title}</h3>
                      <p className="text-slate-400 text-lg mb-8">{s.desc}</p>
                      <h4 className="text-xl font-bold text-white mb-4">Features:</h4>
                      <ul className="space-y-3">
                        {s.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-300">
                            <CheckCircle2 className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                })()}
              </>
            )}
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold"
                onClick={() => {
                  setOpenService(null)
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Get a Quote
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

// ── Work Section ────────────────────────────────────────────────────────────
function WorkSection() {
  const projects = [
    { name: 'Premium Raffle Platform', category: 'Raffle Website', color: 'from-pink-500 to-purple-500', desc: 'High-volume competition platform with real-time ticket tracking and automated winner selection.' },
    { name: 'Luxury Booking System', category: 'Booking System', color: 'from-cyan-500 to-blue-500', desc: 'Appointment booking for high-end salons with staff management and automated reminders.' },
    { name: 'Restaurant Hub', category: 'Restaurant System', color: 'from-green-500 to-emerald-500', desc: 'Full-service restaurant platform with online ordering, reservations, and kitchen management.' },
    { name: 'Property Portal', category: 'Real Estate', color: 'from-purple-500 to-pink-500', desc: 'Real estate platform with advanced search, virtual tours, and agent dashboards.' },
  ]

  return (
    <section id="work" className="py-24 bg-[#07070f] neon-grid relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Work That <span className="neon-text-pink">Slaps</span>
          </motion.h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Recent projects we're proud of</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/10"
              style={{ background: 'rgba(10,10,30,0.6)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="p-8 relative z-10">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${p.color} text-white mb-4`}>
                  {p.category}
                </span>
                <h3 className="text-2xl font-black text-white mb-3">{p.name}</h3>
                <p className="text-slate-400 font-medium">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── About Section ───────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#070712] neon-grid relative overflow-hidden">
      <NeonOrbs />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Websites That <span className="neon-text-pink">Matter</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-6">
              We're not your average web agency. Based in Leeds, West Yorkshire, we build websites that slap hard — bold designs that demand attention and convert visitors into customers.
            </p>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
              From custom websites to specialized platforms like raffles, booking systems, and e-learning — we deliver solutions that actually work for your business.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-5 h-5 neon-text-pink" />
                <span className="font-semibold">Leeds, UK</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-5 h-5 neon-text-cyan" />
                <span className="font-semibold">hello@sitesthatslap.com</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Rocket, label: 'Fast Delivery', desc: 'Quick turnaround without compromising quality' },
                { icon: Zap, label: 'High Performance', desc: 'Optimized for speed and conversions' },
                { icon: Shield, label: 'Secure & Reliable', desc: 'Enterprise-grade security standards' },
                { icon: Trophy, label: 'Award Winning', desc: 'Recognized for exceptional design' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/5">
                  <item.icon className="w-8 h-8 neon-text-pink mb-3" />
                  <h4 className="font-bold text-white mb-1">{item.label}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── CTA Section ───────────────────────────────────────────────────────────────
function CTASection() {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-24 flex items-center justify-center bg-[#07070f] relative overflow-hidden">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] neon-orb-pink opacity-20" />
      </div>
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
          Ready to <span className="neon-text-pink">Slap</span>?
        </h2>
        <p className="text-xl text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
          Let's build something that demands attention. Your website should be your hardest working employee.
        </p>
        <motion.button
          onClick={scrollToContact}
          className="px-12 py-5 gradient-slap text-white font-black text-xl rounded-full glow-pink"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Your Project
        </motion.button>
      </motion.div>
    </section>
  )
}

// ── Contact Section ─────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#070712] neon-grid relative overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Let's <span className="neon-text-pink">Talk</span>
          </motion.h2>
          <p className="text-slate-400 font-bold text-lg">Ready to start? We're here to help.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-white mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <a href="mailto:hello@sitesthatslap.com" className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-pink-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email us</p>
                  <p className="text-white font-semibold">hello@sitesthatslap.com</p>
                </div>
              </a>
              <a href="tel:+441234567890" className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Call us</p>
                  <p className="text-white font-semibold">+44 1234 567 890</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Visit us</p>
                  <p className="text-white font-semibold">Leeds, West Yorkshire, UK</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <p className="text-sm text-slate-400 mb-4">Follow us</p>
              <div className="flex gap-3">
                <a
                  href="https://www.tiktok.com/@sitesthatslap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white hover:scale-110 transition-transform border border-white/10"
                  aria-label="TikTok"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/sitesthatslap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/sitesthatslap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white hover:scale-110 transition-transform border border-white/10"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-8 rounded-2xl border border-white/10 bg-white/5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-white mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-[#0a0a1a] border border-white/10 text-white focus:border-pink-500 outline-none transition-colors resize-none" placeholder="Tell us about your project..." />
              </div>
              <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 bg-[#07070f] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black text-white tracking-tight">
            Sites<span className="neon-text-pink">That</span>Slap
          </div>
          <p className="text-slate-400 text-sm">© 2025 Sites That Slap. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://www.tiktok.com/@sitesthatslap"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white hover:scale-110 transition-transform border border-white/10"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/sitesthatslap"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://x.com/sitesthatslap"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white hover:scale-110 transition-transform border border-white/10"
                aria-label="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm">Client Login</Link>
            <Link to="/admin" className="text-slate-400 hover:text-white transition-colors text-sm">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // Handle hash links on page load
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location])

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.6 }}>
        <Navbar />
        <main>
          <HeroSection />
          <StatsSection />
          <ServicesSection />
          <WorkSection />
          <AboutSection />
          <CTASection />
          <ContactSection />
        </main>
        <Footer />
        <Toaster position="top-right" toastOptions={{
          style: { background: 'rgba(15, 15, 35, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }
        }} />
      </motion.div>
    </>
  )
}

