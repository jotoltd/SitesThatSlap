import { motion } from 'framer-motion'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  Globe, ShoppingCart, Smartphone, Zap, Palette, Rocket,
  Ticket, Calendar, UtensilsCrossed, Home, GraduationCap, CalendarDays,
  ArrowLeft, CheckCircle2, Clock, Users, Shield, Sparkles,
  MessageCircle, Mail, Phone
} from 'lucide-react'

const servicesData: Record<string, {
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  price: string
  timeline: string
  features: string[]
  deliverables: string[]
  process: { step: number; title: string; desc: string }[]
  color: string
  gradient: string
}> = {
  'custom-websites': {
    icon: Globe,
    title: 'Custom Websites',
    subtitle: 'Bespoke web solutions tailored to your brand',
    description: 'We build completely custom websites from scratch, designed specifically for your business needs. No templates, no cookie-cutter solutions — just unique, high-performing websites that convert visitors into customers.',
    price: 'From £2,500',
    timeline: '2-4 weeks',
    features: [
      'Fully custom design tailored to your brand identity',
      'Mobile-first responsive development for all devices',
      'SEO optimized structure for better rankings',
      'Lightning-fast loading speeds optimized',
      'Content management system included',
      '3 rounds of revisions to perfect your site',
      'Cross-browser compatibility testing',
      'Accessibility compliance (WCAG 2.1)',
      'Google Analytics integration',
      'SSL certificate and security setup'
    ],
    deliverables: [
      'Complete website source code',
      'Content management system access',
      'Style guide and brand assets',
      'Training session on CMS usage',
      '30 days of post-launch support'
    ],
    process: [
      { step: 1, title: 'Discovery', desc: 'We learn about your business, goals, and target audience' },
      { step: 2, title: 'Design', desc: 'Create wireframes and visual designs for your approval' },
      { step: 3, title: 'Development', desc: 'Build your site with clean, optimized code' },
      { step: 4, title: 'Launch', desc: 'Test thoroughly and deploy to live server' }
    ],
    color: 'text-pink-500',
    gradient: 'from-pink-500 to-purple-500'
  },
  'ecommerce': {
    icon: ShoppingCart,
    title: 'E-Commerce',
    subtitle: 'Online stores that convert browsers into buyers',
    description: 'Powerful e-commerce solutions built for sales. From small boutique shops to large-scale enterprise stores, we create shopping experiences that drive revenue and keep customers coming back.',
    price: 'From £3,500',
    timeline: '3-6 weeks',
    features: [
      'Secure payment gateway integration (Stripe, PayPal)',
      'Inventory management system with stock alerts',
      'Customer account management and order history',
      'Order tracking and automated notifications',
      'Abandoned cart recovery system',
      'Multi-currency support for global sales',
      'Product reviews and ratings system',
      'Discount code and promotion management',
      'Shipping integration with real-time rates',
      'Sales analytics and reporting dashboard'
    ],
    deliverables: [
      'Complete e-commerce platform',
      'Payment gateway configuration',
      'Product upload and setup',
      'Shipping provider integration',
      'Staff training on store management'
    ],
    process: [
      { step: 1, title: 'Planning', desc: 'Define product structure, categories, and checkout flow' },
      { step: 2, title: 'Design', desc: 'Create appealing product pages and checkout experience' },
      { step: 3, title: 'Build', desc: 'Develop store with payment and shipping integrations' },
      { step: 4, title: 'Stock & Launch', desc: 'Upload products, test checkout, and go live' }
    ],
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-pink-500'
  },
  'responsive-design': {
    icon: Smartphone,
    title: 'Responsive Design',
    subtitle: 'Perfect experience on every device',
    description: 'Mobile-first design approach ensuring your website looks and works flawlessly on phones, tablets, and desktops. We optimize for touch interactions and varying screen sizes.',
    price: 'From £1,500',
    timeline: '1-3 weeks',
    features: [
      'Mobile-first design approach prioritizing mobile users',
      'Tablet and desktop optimization for all breakpoints',
      'Touch-friendly interfaces with proper sizing',
      'Cross-browser compatibility (Chrome, Safari, Firefox, Edge)',
      'Accessibility compliance with WCAG standards',
      'Performance optimized specifically for mobile networks',
      'Responsive images that adapt to screen size',
      'Flexible typography that scales beautifully',
      'Gesture support for mobile interactions'
    ],
    deliverables: [
      'Responsive design system',
      'Mobile-optimized assets',
      'Browser testing report',
      'Performance audit results',
      'Best practices documentation'
    ],
    process: [
      { step: 1, title: 'Audit', desc: 'Review current site or requirements for responsiveness' },
      { step: 2, title: 'Mobile Design', desc: 'Design mobile experience first, then scale up' },
      { step: 3, title: 'Development', desc: 'Implement responsive breakpoints and interactions' },
      { step: 4, title: 'Testing', desc: 'Test across devices and browsers for consistency' }
    ],
    color: 'text-cyan-500',
    gradient: 'from-cyan-500 to-blue-500'
  },
  'performance': {
    icon: Zap,
    title: 'Performance Optimization',
    subtitle: 'Lightning fast websites that rank higher',
    description: 'Speed matters. We optimize your website to load in under 2 seconds, improving user experience, SEO rankings, and conversion rates. Every millisecond counts.',
    price: 'From £1,000',
    timeline: '1-2 weeks',
    features: [
      'Core Web Vitals optimization (LCP, FID, CLS)',
      'Image optimization with WebP conversion',
      'CDN implementation for global speed',
      'Lazy loading for images and content',
      'Code splitting and JavaScript minification',
      'Advanced caching strategies implementation',
      'Server response time optimization',
      'Database query optimization',
      'Performance monitoring setup'
    ],
    deliverables: [
      'Before/after performance report',
      'Core Web Vitals audit',
      'Optimized asset library',
      'Caching configuration',
      'Ongoing monitoring dashboard'
    ],
    process: [
      { step: 1, title: 'Audit', desc: 'Analyze current performance and identify bottlenecks' },
      { step: 2, title: 'Optimize', desc: 'Implement caching, compression, and code improvements' },
      { step: 3, title: 'Assets', desc: 'Optimize images, fonts, and other static assets' },
      { step: 4, title: 'Verify', desc: 'Test improvements and provide performance report' }
    ],
    color: 'text-yellow-500',
    gradient: 'from-yellow-500 to-orange-500'
  },
  'brand-identity': {
    icon: Palette,
    title: 'Brand Identity',
    subtitle: 'Complete brand packages that stand out',
    description: 'Your brand is more than a logo. We create comprehensive brand identities including visual systems, color palettes, typography, and guidelines that ensure consistency across all touchpoints.',
    price: 'From £2,000',
    timeline: '2-4 weeks',
    features: [
      'Logo design with multiple variations and formats',
      'Complete color palette with hex codes and usage guidelines',
      'Typography selection with font pairings',
      'Comprehensive brand style guide document',
      'Business card designs ready for print',
      'Social media assets and templates',
      'Letterhead and stationery designs',
      'Email signature templates',
      'Brand usage guidelines and dos/donts'
    ],
    deliverables: [
      'Logo files (SVG, PNG, JPG in all variations)',
      'Brand style guide PDF',
      'Color palette files',
      'Font files and licenses',
      'Social media template kit'
    ],
    process: [
      { step: 1, title: 'Research', desc: 'Understand your market, competitors, and positioning' },
      { step: 2, title: 'Concept', desc: 'Develop logo concepts and initial visual directions' },
      { step: 3, title: 'Refine', desc: 'Polish chosen concept and develop full identity system' },
      { step: 4, title: 'Deliver', desc: 'Package all assets with comprehensive style guide' }
    ],
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-indigo-500'
  },
  'seo-growth': {
    icon: Rocket,
    title: 'SEO & Growth',
    subtitle: 'Data-driven strategies for organic growth',
    description: 'Get found on Google. Our SEO services help you rank higher, drive qualified traffic, and convert visitors into customers through strategic optimization and content.',
    price: 'From £800/month',
    timeline: 'Ongoing',
    features: [
      'Comprehensive keyword research and strategy',
      'On-page SEO optimization for all content',
      'Technical SEO audit and fixes',
      'Content strategy and calendar planning',
      'Analytics setup with conversion tracking',
      'Monthly performance reports and insights',
      'Competitor analysis and benchmarking',
      'Local SEO optimization for local businesses',
      'Backlink building and outreach'
    ],
    deliverables: [
      'Monthly SEO report',
      'Keyword ranking tracker',
      'Content calendar',
      'Technical audit report',
      'Competitor analysis'
    ],
    process: [
      { step: 1, title: 'Audit', desc: 'Analyze current SEO status and identify opportunities' },
      { step: 2, title: 'Strategy', desc: 'Develop keyword strategy and content plan' },
      { step: 3, title: 'Optimize', desc: 'Implement on-page and technical improvements' },
      { step: 4, title: 'Monitor', desc: 'Track rankings, traffic, and adjust strategy monthly' }
    ],
    color: 'text-green-500',
    gradient: 'from-green-500 to-emerald-500'
  },
  'raffle-websites': {
    icon: Ticket,
    title: 'Raffle Websites',
    subtitle: 'Competition platforms that drive engagement',
    description: 'Custom raffle and competition platforms built for the UK market. Fully compliant with Gambling Commission requirements, with secure payments and automated winner selection.',
    price: 'From £5,000',
    timeline: '4-6 weeks',
    features: [
      'Secure payment processing with Stripe integration',
      'Real-time ticket sales tracking and counters',
      'Automated random winner selection system',
      'Full Gambling Commission compliance built-in',
      'Comprehensive admin dashboard for management',
      'Email notifications for purchases and winners',
      'Social sharing integration for viral growth',
      'Entry limit controls and validation',
      'Winner announcement page and certificates'
    ],
    deliverables: [
      'Complete raffle platform',
      'Payment gateway setup',
      'Admin dashboard access',
      'Compliance documentation',
      'Staff training session'
    ],
    process: [
      { step: 1, title: 'Brief', desc: 'Define competition structure, prizes, and rules' },
      { step: 2, title: 'Design', desc: 'Create engaging ticket purchase experience' },
      { step: 3, title: 'Build', desc: 'Develop platform with payment and compliance features' },
      { step: 4, title: 'Launch', desc: 'Test thoroughly, set up first competition, go live' }
    ],
    color: 'text-pink-500',
    gradient: 'from-pink-500 to-purple-500'
  },
  'booking-systems': {
    icon: Calendar,
    title: 'Booking Systems',
    subtitle: 'Appointment scheduling that saves time',
    description: 'Streamline your bookings with custom scheduling systems. Perfect for salons, clinics, consultants, and any business that takes appointments. Reduce no-shows and maximize your calendar.',
    price: 'From £3,000',
    timeline: '3-4 weeks',
    features: [
      'Online appointment scheduling 24/7',
      'Staff management with individual calendars',
      'Automated email and SMS reminders',
      'Payment integration for deposits or full payment',
      'Calendar sync with Google and Outlook',
      'Customer management database',
      'Service menu and pricing configuration',
      'Recurring appointment support',
      'Cancellation and rescheduling system'
    ],
    deliverables: [
      'Complete booking platform',
      'Staff account setup',
      'Calendar integrations',
      'Customer database',
      'Training documentation'
    ],
    process: [
      { step: 1, title: 'Workflow', desc: 'Map out your booking workflow and requirements' },
      { step: 2, title: 'Design', desc: 'Create intuitive booking interface for customers' },
      { step: 3, title: 'Integrate', desc: 'Connect calendars, payments, and notifications' },
      { step: 4, title: 'Train', desc: 'Set up staff accounts and provide training' }
    ],
    color: 'text-cyan-500',
    gradient: 'from-cyan-500 to-blue-500'
  },
  'restaurant-systems': {
    icon: UtensilsCrossed,
    title: 'Restaurant Systems',
    subtitle: 'Complete digital solutions for restaurants',
    description: 'Everything a modern restaurant needs: online menus, table reservations, ordering systems, and kitchen management. Increase revenue with online ordering and streamline operations.',
    price: 'From £4,000',
    timeline: '4-5 weeks',
    features: [
      'Beautiful digital menus with photos and descriptions',
      'Real-time table reservations with availability',
      'Online ordering for pickup and delivery',
      'Kitchen display system for orders',
      'Integrated payment processing',
      'Customer loyalty program integration',
      'Order management and status tracking',
      'Multi-location support for chains',
      'Reservation management dashboard'
    ],
    deliverables: [
      'Complete restaurant platform',
      'Menu setup and optimization',
      'Payment processing',
      'Kitchen display setup',
      'Staff training materials'
    ],
    process: [
      { step: 1, title: 'Menu', desc: 'Digitize menu with photos, descriptions, and options' },
      { step: 2, title: 'Systems', desc: 'Set up ordering, reservations, and kitchen display' },
      { step: 3, title: 'Integrate', desc: 'Connect payments, delivery providers, and printers' },
      { step: 4, title: 'Launch', desc: 'Staff training and soft launch with full support' }
    ],
    color: 'text-green-500',
    gradient: 'from-green-500 to-emerald-500'
  },
  'real-estate': {
    icon: Home,
    title: 'Real Estate',
    subtitle: 'Property platforms that sell homes',
    description: 'Professional real estate websites with advanced search, agent portals, and virtual tour capabilities. Help buyers find their dream home and agents close more deals.',
    price: 'From £4,500',
    timeline: '4-6 weeks',
    features: [
      'Advanced property search with filters and maps',
      'Agent portals with lead management CRM',
      'Virtual tours and photo galleries',
      'Mortgage calculators and affordability tools',
      'Property alerts for new listings',
      'Lead capture and management system',
      'Agent profiles and contact forms',
      'Integration with property portals (Rightmove, Zoopla)',
      'Automated valuation tools'
    ],
    deliverables: [
      'Complete property platform',
      'Agent CRM system',
      'Property feed integration',
      'Lead management tools',
      'Marketing automation setup'
    ],
    process: [
      { step: 1, title: 'Architecture', desc: 'Plan search functionality and agent workflows' },
      { step: 2, title: 'Design', desc: 'Create property listings and search experience' },
      { step: 3, title: 'Features', desc: 'Build agent portal, CRM, and search tools' },
      { step: 4, title: 'Populate', desc: 'Import properties and train agents on system' }
    ],
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-pink-500'
  },
  'elearning': {
    icon: GraduationCap,
    title: 'E-Learning',
    subtitle: 'Course platforms that educate and engage',
    description: 'Build and sell online courses with our custom e-learning platforms. Video hosting, quizzes, progress tracking, and certificates — everything you need to monetize your knowledge.',
    price: 'From £5,500',
    timeline: '5-7 weeks',
    features: [
      'Secure video course hosting and streaming',
      'Interactive quizzes and assessments',
      'Student progress tracking and analytics',
      'Automated completion certificates',
      'Drip content scheduling for courses',
      'Student analytics and engagement tracking',
      'Discussion forums and community features',
      'Mobile app for learning on-the-go',
      'Payment processing for course sales'
    ],
    deliverables: [
      'Complete e-learning platform',
      'Course upload system',
      'Student management dashboard',
      'Analytics and reporting',
      'Mobile-responsive design'
    ],
    process: [
      { step: 1, title: 'Structure', desc: 'Plan course structure, lessons, and assessments' },
      { step: 2, title: 'Platform', desc: 'Build video hosting, quizzes, and progress tracking' },
      { step: 3, title: 'Monetize', desc: 'Set up payments, subscriptions, and certificates' },
      { step: 4, title: 'Launch', desc: 'Upload initial courses and onboard first students' }
    ],
    color: 'text-yellow-500',
    gradient: 'from-yellow-500 to-orange-500'
  },
  'event-platforms': {
    icon: CalendarDays,
    title: 'Event Platforms',
    subtitle: 'Event management made simple',
    description: 'Complete event management solutions with ticketing, registration, and attendee management. Perfect for conferences, workshops, concerts, and any ticketed events.',
    price: 'From £3,500',
    timeline: '3-5 weeks',
    features: [
      'Professional online ticketing with seat selection',
      'Attendee registration and data collection',
      'Complete event scheduling and agenda tools',
      'QR code check-in and badge printing',
      'Automated email notifications and reminders',
      'Real-time analytics dashboard',
      'Multiple ticket types and pricing tiers',
      'Integration with event marketing tools',
      'Post-event surveys and feedback'
    ],
    deliverables: [
      'Complete event platform',
      'Ticketing system',
      'Check-in app access',
      'Analytics dashboard',
      'Email template setup'
    ],
    process: [
      { step: 1, title: 'Plan', desc: 'Define event structure, ticket types, and flow' },
      { step: 2, title: 'Build', desc: 'Create ticketing, registration, and check-in systems' },
      { step: 3, title: 'Automate', desc: 'Set up emails, notifications, and reminders' },
      { step: 4, title: 'Test', desc: 'Run test event, train staff, prepare for launch' }
    ],
    color: 'text-orange-500',
    gradient: 'from-orange-500 to-red-500'
  }
}

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const service = serviceId ? servicesData[serviceId] : null

  if (!service) {
    return <Navigate to="/services" replace />
  }

  const Icon = service.icon

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Header */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-5xl md:text-6xl font-black text-white mb-4`}>
              {service.title}
            </h1>
            <p className="text-2xl text-slate-400 mb-6">{service.subtitle}</p>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <Sparkles className={`w-8 h-8 ${service.color} mb-3`} />
              <p className="text-slate-400 text-sm mb-1">Starting Price</p>
              <p className="text-2xl font-black text-white">{service.price}</p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <Clock className={`w-8 h-8 ${service.color} mb-3`} />
              <p className="text-slate-400 text-sm mb-1">Timeline</p>
              <p className="text-2xl font-black text-white">{service.timeline}</p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <Users className={`w-8 h-8 ${service.color} mb-3`} />
              <p className="text-slate-400 text-sm mb-1">Team Size</p>
              <p className="text-2xl font-black text-white">2-4 Experts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-6 bg-[#070712]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <CheckCircle2 className={`w-6 h-6 ${service.color} shrink-0 mt-0.5`} />
                <span className="text-slate-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10">Deliverables</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.deliverables.map((item, i) => (
              <motion.div
                key={i}
                className="p-5 rounded-xl border border-white/10 bg-white/5 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Shield className={`w-8 h-8 ${service.color} mx-auto mb-3`} />
                <p className="text-white font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="py-16 px-6 bg-[#070712]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10 text-center">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {service.process.map((step, i) => (
              <motion.div
                key={i}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center mx-auto mb-4 text-white font-black text-xl`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Let's discuss your {service.title.toLowerCase()} project and create something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/?section=contact"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-slap text-white font-bold text-lg rounded-full"
            >
              <MessageCircle className="w-5 h-5" />
              Get a Quote
            </Link>
            <a
              href="mailto:hello@sitesthatslap.com"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/5 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
