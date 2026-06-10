import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Globe, ShoppingCart, Smartphone, Zap, Palette, Rocket,
  Ticket, Calendar, UtensilsCrossed, Home, GraduationCap, CalendarDays,
  ArrowRight, Star
} from 'lucide-react'

const mainServices = [
  {
    id: 'custom-websites',
    icon: Globe,
    title: 'Custom Websites',
    desc: 'Bespoke websites built from scratch that perfectly represent your brand and convert visitors.',
    border: 'neon-border-pink',
    glow: 'neon-text-pink',
    features: ['Fully custom design', 'Mobile-first responsive', 'SEO optimized', 'CMS included', '3 rounds of revisions']
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-Commerce',
    desc: 'Powerful online stores that make selling easy. From small shops to enterprise solutions.',
    border: 'neon-border-purple',
    glow: 'neon-text-purple',
    features: ['Secure payments', 'Inventory management', 'Customer accounts', 'Order tracking', 'Abandoned cart recovery']
  },
  {
    id: 'responsive-design',
    icon: Smartphone,
    title: 'Responsive Design',
    desc: 'Sites that look incredible on every device. Mobile-first approach for maximum reach.',
    border: 'neon-border-cyan',
    glow: 'neon-text-cyan',
    features: ['Mobile-first design', 'Cross-browser compatible', 'Touch-friendly', 'Accessibility compliant', 'Performance optimized']
  },
  {
    id: 'performance',
    icon: Zap,
    title: 'Performance Optimization',
    desc: 'Lightning-fast load times and optimized code that keeps visitors engaged.',
    border: 'neon-border-pink',
    glow: 'neon-text-pink',
    features: ['Core Web Vitals', 'Image optimization', 'CDN setup', 'Lazy loading', 'Caching strategies']
  },
  {
    id: 'brand-identity',
    icon: Palette,
    title: 'Brand Identity',
    desc: 'Complete brand packages including logos, color schemes, and visual guidelines.',
    border: 'neon-border-purple',
    glow: 'neon-text-purple',
    features: ['Logo design', 'Color palette', 'Typography', 'Style guide', 'Social media assets']
  },
  {
    id: 'seo-growth',
    icon: Rocket,
    title: 'SEO & Growth',
    desc: 'Data-driven strategies to get your site ranking and drive organic traffic.',
    border: 'neon-border-green',
    glow: 'neon-text-green',
    features: ['Keyword research', 'On-page SEO', 'Technical audits', 'Content strategy', 'Monthly reports']
  }
]

const specialtyServices = [
  {
    id: 'raffle-websites',
    icon: Ticket,
    title: 'Raffle Websites',
    color: 'from-pink-500 to-purple-500',
    desc: 'Custom-built raffle & competition platforms with secure payments and automated winner selection.',
    features: ['Secure payment processing', 'Real-time ticket tracking', 'Automated winner selection', 'Gambling Commission compliance', 'Admin dashboard']
  },
  {
    id: 'booking-systems',
    icon: Calendar,
    title: 'Booking Systems',
    color: 'from-cyan-500 to-blue-500',
    desc: 'Custom appointment & reservation systems for salons, clinics, restaurants, and events.',
    features: ['Online scheduling', 'Staff management', 'Automated reminders', 'Payment integration', 'Calendar sync']
  },
  {
    id: 'restaurant-systems',
    icon: UtensilsCrossed,
    title: 'Restaurant Systems',
    color: 'from-green-500 to-emerald-500',
    desc: 'Complete restaurant platforms with online menus, table reservations, and ordering.',
    features: ['Digital menus', 'Table reservations', 'Online ordering', 'Kitchen display', 'Loyalty program']
  },
  {
    id: 'real-estate',
    icon: Home,
    title: 'Real Estate',
    color: 'from-purple-500 to-pink-500',
    desc: 'Property platforms with search, filters, agent portals, and virtual tours.',
    features: ['Property search', 'Agent portals', 'Virtual tours', 'Mortgage calculators', 'Lead management']
  },
  {
    id: 'elearning',
    icon: GraduationCap,
    title: 'E-Learning',
    color: 'from-yellow-500 to-orange-500',
    desc: 'Online course platforms with video lessons, quizzes, and progress tracking.',
    features: ['Video hosting', 'Quizzes & assessments', 'Progress tracking', 'Certificates', 'Drip content']
  },
  {
    id: 'event-platforms',
    icon: CalendarDays,
    title: 'Event Platforms',
    color: 'from-orange-500 to-red-500',
    desc: 'Event management with ticketing, registration, and attendee management.',
    features: ['Online ticketing', 'Registration', 'QR check-in', 'Email notifications', 'Analytics']
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#07070f] neon-grid">
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-pink" style={{ background: 'rgba(255,0,110,0.08)' }}>
              <Star className="w-4 h-4 text-slap-yellow fill-slap-yellow" />
              <span className="font-bold text-slap-yellow text-sm tracking-widest uppercase">Our Services</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              What We <span className="neon-text-pink">Do Best</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to dominate the digital space. From custom websites to specialized platforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10 text-center">Core Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/services/${service.id}`}
                  className={`block p-6 rounded-2xl ${service.border} group h-full transition-all hover:scale-[1.02]`}
                  style={{ background: 'rgba(10,10,30,0.7)' }}
                >
                  <service.icon className={`w-12 h-12 mb-4 ${service.glow}`} />
                  <h3 className="text-xl font-black text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{service.desc}</p>
                  <div className="flex items-center gap-1 text-sm font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Services */}
      <section className="py-16 px-6 bg-[#070712]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10 text-center">Specialty Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialtyServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/services/${service.id}`}
                  className="block p-6 rounded-2xl border border-white/10 group h-full transition-all hover:scale-[1.02] hover:border-white/30"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{service.desc}</p>
                  <div className="flex items-center gap-1 text-sm font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Banner */}
      <section className="py-16 px-6 bg-[#070712]">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-500/30 text-center">
            <h2 className="text-3xl font-black text-white mb-4">Flexible Partnership Options</h2>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
              We offer commission-based partnerships and completely free setup for qualifying projects. 
              Let's discuss what works best for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-lg"
              >
                Build Your Quote
              </Link>
              <Link
                to="/?section=contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Every project is unique. Let's discuss your requirements and find the perfect solution for your budget.
          </p>
          <Link
            to="/quote"
            className="inline-block px-10 py-5 gradient-slap text-white font-black text-xl rounded-full glow-pink"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  )
}
