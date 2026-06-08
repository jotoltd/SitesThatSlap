import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Rocket,
  Palette,
  Zap,
  Globe,
  Smartphone,
  ShoppingCart,
  ArrowRight,
  Star,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  PhoneCall,
  MessageCircle,
  ChevronDown,
  Ticket,
  Shield,
  Calendar,
  X,
  Menu,
  UtensilsCrossed,
  CreditCard,
  Home,
  Building2,
  Search,
  Calculator,
  GraduationCap,
  CalendarDays,
  Briefcase,
  Car,
  Users,
  PlayCircle,
  TicketCheck,
  Banknote,
  Trophy,
  Store,
  HeartPulse,
  BedDouble,
  Dumbbell,
  HeartHandshake,
  BarChart3,
  Scale,
  FileText,
  Stethoscope,
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
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] neon-orb-pink morph-blob opacity-30" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] neon-orb-purple morph-blob opacity-25" style={{ animationDelay: '-3s' }} />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-cyan morph-blob opacity-15" style={{ animationDelay: '-6s' }} />
    </>
  )
}

// ── Slide dot nav ──────────────────────────────────────────────────────────────
const SLIDE_LABELS = ['Home', 'Stats', 'Services', 'Work', 'About', 'CTA', 'Contact']

const TOTAL_SLIDES = 7

function SlideDots({ current, onGo }: { current: number; onGo: (i: number) => void }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          title={SLIDE_LABELS[i]}
          className={`slide-dot ${i === current ? 'active' : ''}`}
        />
      ))}
    </div>
  )
}

// slide enter/exit based on direction
function makeVariants(direction: number) {
  return {
    enter: { y: direction > 0 ? '100%' : '-100%', opacity: 0, filter: 'blur(12px)' },
    center: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] as const } },
    exit: { y: direction > 0 ? '-100%' : '100%', opacity: 0, filter: 'blur(12px)', transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] as const } },
  }
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [raffleSlidesOpen, setRaffleSlidesOpen] = useState(false)
  const [currentRaffleSlide, setCurrentRaffleSlide] = useState(0)
  const [raffleDirection, setRaffleDirection] = useState(1)
  const [bookingSlidesOpen, setBookingSlidesOpen] = useState(false)
  const [currentBookingSlide, setCurrentBookingSlide] = useState(0)
  const [bookingDirection, setBookingDirection] = useState(1)
  const [restaurantSlidesOpen, setRestaurantSlidesOpen] = useState(false)
  const [currentRestaurantSlide, setCurrentRestaurantSlide] = useState(0)
  const [restaurantDirection, setRestaurantDirection] = useState(1)
  const [realEstateSlidesOpen, setRealEstateSlidesOpen] = useState(false)
  const [currentRealEstateSlide, setCurrentRealEstateSlide] = useState(0)
  const [realEstateDirection, setRealEstateDirection] = useState(1)
  const [elearningSlidesOpen, setElearningSlidesOpen] = useState(false)
  const [currentElearningSlide, setCurrentElearningSlide] = useState(0)
  const [elearningDirection, setElearningDirection] = useState(1)
  const [eventSlidesOpen, setEventSlidesOpen] = useState(false)
  const [currentEventSlide, setCurrentEventSlide] = useState(0)
  const [eventDirection, setEventDirection] = useState(1)
  const [jobSlidesOpen, setJobSlidesOpen] = useState(false)
  const [currentJobSlide, setCurrentJobSlide] = useState(0)
  const [jobDirection, setJobDirection] = useState(1)
  const [vehicleSlidesOpen, setVehicleSlidesOpen] = useState(false)
  const [currentVehicleSlide, setCurrentVehicleSlide] = useState(0)
  const [vehicleDirection, setVehicleDirection] = useState(1)
  const [membershipSlidesOpen, setMembershipSlidesOpen] = useState(false)
  const [currentMembershipSlide, setCurrentMembershipSlide] = useState(0)
  const [membershipDirection, setMembershipDirection] = useState(1)
  const [marketplaceSlidesOpen, setMarketplaceSlidesOpen] = useState(false)
  const [currentMarketplaceSlide, setCurrentMarketplaceSlide] = useState(0)
  const [marketplaceDirection, setMarketplaceDirection] = useState(1)
  const [healthcareSlidesOpen, setHealthcareSlidesOpen] = useState(false)
  const [currentHealthcareSlide, setCurrentHealthcareSlide] = useState(0)
  const [healthcareDirection, setHealthcareDirection] = useState(1)
  const [hotelSlidesOpen, setHotelSlidesOpen] = useState(false)
  const [currentHotelSlide, setCurrentHotelSlide] = useState(0)
  const [hotelDirection, setHotelDirection] = useState(1)
  const [fitnessSlidesOpen, setFitnessSlidesOpen] = useState(false)
  const [currentFitnessSlide, setCurrentFitnessSlide] = useState(0)
  const [fitnessDirection, setFitnessDirection] = useState(1)
  const [nonprofitSlidesOpen, setNonprofitSlidesOpen] = useState(false)
  const [currentNonprofitSlide, setCurrentNonprofitSlide] = useState(0)
  const [nonprofitDirection, setNonprofitDirection] = useState(1)
  const [saasSlidesOpen, setSaasSlidesOpen] = useState(false)
  const [currentSaasSlide, setCurrentSaasSlide] = useState(0)
  const [saasDirection, setSaasDirection] = useState(1)
  const [legalSlidesOpen, setLegalSlidesOpen] = useState(false)
  const [currentLegalSlide, setCurrentLegalSlide] = useState(0)
  const [legalDirection, setLegalDirection] = useState(1)
  const isAnimating = useRef(false)

  // ── Deep Linking / Routing ───────────────────────────────────────────────────
  const location = useLocation()
  const navigate = useNavigate()
  const raffleAnimating = useRef(false)
  const bookingAnimating = useRef(false)
  const restaurantAnimating = useRef(false)
  const realEstateAnimating = useRef(false)
  const elearningAnimating = useRef(false)
  const eventAnimating = useRef(false)
  const jobAnimating = useRef(false)
  const vehicleAnimating = useRef(false)
  const membershipAnimating = useRef(false)
  const marketplaceAnimating = useRef(false)
  const healthcareAnimating = useRef(false)
  const hotelAnimating = useRef(false)
  const fitnessAnimating = useRef(false)
  const nonprofitAnimating = useRef(false)
  const saasAnimating = useRef(false)
  const legalAnimating = useRef(false)
  const touchStartY = useRef(0)

  const goToSlide = useCallback((index: number) => {
    if (isAnimating.current || index === currentSlide) return
    if (index < 0 || index >= TOTAL_SLIDES) return
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
    isAnimating.current = true
  }, [currentSlide])

  const next = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide])
  const prev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide])

  // touch - disabled on mobile (<768px) to allow content scrolling
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY }
    const onTouchEnd = (e: TouchEvent) => {
      // Skip on mobile devices - use buttons instead
      if (window.innerWidth < 768) return
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (isAnimating.current) return
      if (delta > 50) next()
      else if (delta < -50) prev()
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [next, prev])

  // raffle slide navigation
  const RAFFLE_TOTAL_SLIDES = 8
  const goToRaffleSlide = useCallback((index: number) => {
    if (raffleAnimating.current || index === currentRaffleSlide) return
    if (index < 0 || index >= RAFFLE_TOTAL_SLIDES) return
    setRaffleDirection(index > currentRaffleSlide ? 1 : -1)
    setCurrentRaffleSlide(index)
    raffleAnimating.current = true
  }, [currentRaffleSlide])
  const nextRaffle = useCallback(() => goToRaffleSlide(currentRaffleSlide + 1), [currentRaffleSlide, goToRaffleSlide])
  const prevRaffle = useCallback(() => goToRaffleSlide(currentRaffleSlide - 1), [currentRaffleSlide, goToRaffleSlide])
  const openRaffleSlides = () => {
    setRaffleSlidesOpen(true)
    setCurrentRaffleSlide(0)
    setRaffleDirection(1)
  }
  const closeRaffleSlides = () => {
    setRaffleSlidesOpen(false)
    setCurrentRaffleSlide(0)
  }

  // booking slide navigation
  const BOOKING_TOTAL_SLIDES = 8
  const goToBookingSlide = useCallback((index: number) => {
    if (bookingAnimating.current || index === currentBookingSlide) return
    if (index < 0 || index >= BOOKING_TOTAL_SLIDES) return
    setBookingDirection(index > currentBookingSlide ? 1 : -1)
    setCurrentBookingSlide(index)
    bookingAnimating.current = true
  }, [currentBookingSlide])
  const nextBooking = useCallback(() => goToBookingSlide(currentBookingSlide + 1), [currentBookingSlide, goToBookingSlide])
  const prevBooking = useCallback(() => goToBookingSlide(currentBookingSlide - 1), [currentBookingSlide, goToBookingSlide])
  const openBookingSlides = () => {
    setBookingSlidesOpen(true)
    setCurrentBookingSlide(0)
    setBookingDirection(1)
  }
  const closeBookingSlides = () => {
    setBookingSlidesOpen(false)
    setCurrentBookingSlide(0)
  }

  // restaurant slide navigation
  const RESTAURANT_TOTAL_SLIDES = 8
  const goToRestaurantSlide = useCallback((index: number) => {
    if (restaurantAnimating.current || index === currentRestaurantSlide) return
    if (index < 0 || index >= RESTAURANT_TOTAL_SLIDES) return
    setRestaurantDirection(index > currentRestaurantSlide ? 1 : -1)
    setCurrentRestaurantSlide(index)
    restaurantAnimating.current = true
  }, [currentRestaurantSlide])
  const nextRestaurant = useCallback(() => goToRestaurantSlide(currentRestaurantSlide + 1), [currentRestaurantSlide, goToRestaurantSlide])
  const prevRestaurant = useCallback(() => goToRestaurantSlide(currentRestaurantSlide - 1), [currentRestaurantSlide, goToRestaurantSlide])
  const openRestaurantSlides = () => {
    setRestaurantSlidesOpen(true)
    setCurrentRestaurantSlide(0)
    setRestaurantDirection(1)
  }
  const closeRestaurantSlides = () => {
    setRestaurantSlidesOpen(false)
    setCurrentRestaurantSlide(0)
  }

  // real estate slide navigation
  const REAL_ESTATE_TOTAL_SLIDES = 8
  const goToRealEstateSlide = useCallback((index: number) => {
    if (realEstateAnimating.current || index === currentRealEstateSlide) return
    if (index < 0 || index >= REAL_ESTATE_TOTAL_SLIDES) return
    setRealEstateDirection(index > currentRealEstateSlide ? 1 : -1)
    setCurrentRealEstateSlide(index)
    realEstateAnimating.current = true
  }, [currentRealEstateSlide])
  const nextRealEstate = useCallback(() => goToRealEstateSlide(currentRealEstateSlide + 1), [currentRealEstateSlide, goToRealEstateSlide])
  const prevRealEstate = useCallback(() => goToRealEstateSlide(currentRealEstateSlide - 1), [currentRealEstateSlide, goToRealEstateSlide])
  const openRealEstateSlides = () => {
    setRealEstateSlidesOpen(true)
    setCurrentRealEstateSlide(0)
    setRealEstateDirection(1)
  }
  const closeRealEstateSlides = () => {
    setRealEstateSlidesOpen(false)
    setCurrentRealEstateSlide(0)
  }

  // e-learning slide navigation
  const ELEARNING_TOTAL_SLIDES = 8
  const goToElearningSlide = useCallback((index: number) => {
    if (elearningAnimating.current || index === currentElearningSlide) return
    if (index < 0 || index >= ELEARNING_TOTAL_SLIDES) return
    setElearningDirection(index > currentElearningSlide ? 1 : -1)
    setCurrentElearningSlide(index)
    elearningAnimating.current = true
  }, [currentElearningSlide])
  const nextElearning = useCallback(() => goToElearningSlide(currentElearningSlide + 1), [currentElearningSlide, goToElearningSlide])
  const prevElearning = useCallback(() => goToElearningSlide(currentElearningSlide - 1), [currentElearningSlide, goToElearningSlide])
  const openElearningSlides = () => {
    setElearningSlidesOpen(true)
    setCurrentElearningSlide(0)
    setElearningDirection(1)
  }
  const closeElearningSlides = () => {
    setElearningSlidesOpen(false)
    setCurrentElearningSlide(0)
  }

  // event slide navigation
  const EVENT_TOTAL_SLIDES = 8
  const goToEventSlide = useCallback((index: number) => {
    if (eventAnimating.current || index === currentEventSlide) return
    if (index < 0 || index >= EVENT_TOTAL_SLIDES) return
    setEventDirection(index > currentEventSlide ? 1 : -1)
    setCurrentEventSlide(index)
    eventAnimating.current = true
  }, [currentEventSlide])
  const nextEvent = useCallback(() => goToEventSlide(currentEventSlide + 1), [currentEventSlide, goToEventSlide])
  const prevEvent = useCallback(() => goToEventSlide(currentEventSlide - 1), [currentEventSlide, goToEventSlide])
  const openEventSlides = () => {
    setEventSlidesOpen(true)
    setCurrentEventSlide(0)
    setEventDirection(1)
  }
  const closeEventSlides = () => {
    setEventSlidesOpen(false)
    setCurrentEventSlide(0)
  }

  // job board slide navigation
  const JOB_TOTAL_SLIDES = 8
  const goToJobSlide = useCallback((index: number) => {
    if (jobAnimating.current || index === currentJobSlide) return
    if (index < 0 || index >= JOB_TOTAL_SLIDES) return
    setJobDirection(index > currentJobSlide ? 1 : -1)
    setCurrentJobSlide(index)
    jobAnimating.current = true
  }, [currentJobSlide])
  const nextJob = useCallback(() => goToJobSlide(currentJobSlide + 1), [currentJobSlide, goToJobSlide])
  const prevJob = useCallback(() => goToJobSlide(currentJobSlide - 1), [currentJobSlide, goToJobSlide])
  const openJobSlides = () => {
    setJobSlidesOpen(true)
    setCurrentJobSlide(0)
    setJobDirection(1)
  }
  const closeJobSlides = () => {
    setJobSlidesOpen(false)
    setCurrentJobSlide(0)
  }

  // vehicle slide navigation
  const VEHICLE_TOTAL_SLIDES = 8
  const goToVehicleSlide = useCallback((index: number) => {
    if (vehicleAnimating.current || index === currentVehicleSlide) return
    if (index < 0 || index >= VEHICLE_TOTAL_SLIDES) return
    setVehicleDirection(index > currentVehicleSlide ? 1 : -1)
    setCurrentVehicleSlide(index)
    vehicleAnimating.current = true
  }, [currentVehicleSlide])
  const nextVehicle = useCallback(() => goToVehicleSlide(currentVehicleSlide + 1), [currentVehicleSlide, goToVehicleSlide])
  const prevVehicle = useCallback(() => goToVehicleSlide(currentVehicleSlide - 1), [currentVehicleSlide, goToVehicleSlide])
  const openVehicleSlides = () => {
    setVehicleSlidesOpen(true)
    setCurrentVehicleSlide(0)
    setVehicleDirection(1)
  }
  const closeVehicleSlides = () => {
    setVehicleSlidesOpen(false)
    setCurrentVehicleSlide(0)
  }

  // membership slide navigation
  const MEMBERSHIP_TOTAL_SLIDES = 8
  const goToMembershipSlide = useCallback((index: number) => {
    if (membershipAnimating.current || index === currentMembershipSlide) return
    if (index < 0 || index >= MEMBERSHIP_TOTAL_SLIDES) return
    setMembershipDirection(index > currentMembershipSlide ? 1 : -1)
    setCurrentMembershipSlide(index)
    membershipAnimating.current = true
  }, [currentMembershipSlide])
  const nextMembership = useCallback(() => goToMembershipSlide(currentMembershipSlide + 1), [currentMembershipSlide, goToMembershipSlide])
  const prevMembership = useCallback(() => goToMembershipSlide(currentMembershipSlide - 1), [currentMembershipSlide, goToMembershipSlide])
  const openMembershipSlides = () => {
    setMembershipSlidesOpen(true)
    setCurrentMembershipSlide(0)
    setMembershipDirection(1)
  }
  const closeMembershipSlides = () => {
    setMembershipSlidesOpen(false)
    setCurrentMembershipSlide(0)
  }

  // marketplace slide navigation
  const MARKETPLACE_TOTAL_SLIDES = 8
  const goToMarketplaceSlide = useCallback((index: number) => {
    if (marketplaceAnimating.current || index === currentMarketplaceSlide) return
    if (index < 0 || index >= MARKETPLACE_TOTAL_SLIDES) return
    setMarketplaceDirection(index > currentMarketplaceSlide ? 1 : -1)
    setCurrentMarketplaceSlide(index)
    marketplaceAnimating.current = true
  }, [currentMarketplaceSlide])
  const nextMarketplace = useCallback(() => goToMarketplaceSlide(currentMarketplaceSlide + 1), [currentMarketplaceSlide, goToMarketplaceSlide])
  const prevMarketplace = useCallback(() => goToMarketplaceSlide(currentMarketplaceSlide - 1), [currentMarketplaceSlide, goToMarketplaceSlide])
  const openMarketplaceSlides = () => { setMarketplaceSlidesOpen(true); setCurrentMarketplaceSlide(0); setMarketplaceDirection(1) }
  const closeMarketplaceSlides = () => { setMarketplaceSlidesOpen(false); setCurrentMarketplaceSlide(0) }

  // healthcare slide navigation
  const HEALTHCARE_TOTAL_SLIDES = 8
  const goToHealthcareSlide = useCallback((index: number) => {
    if (healthcareAnimating.current || index === currentHealthcareSlide) return
    if (index < 0 || index >= HEALTHCARE_TOTAL_SLIDES) return
    setHealthcareDirection(index > currentHealthcareSlide ? 1 : -1)
    setCurrentHealthcareSlide(index)
    healthcareAnimating.current = true
  }, [currentHealthcareSlide])
  const nextHealthcare = useCallback(() => goToHealthcareSlide(currentHealthcareSlide + 1), [currentHealthcareSlide, goToHealthcareSlide])
  const prevHealthcare = useCallback(() => goToHealthcareSlide(currentHealthcareSlide - 1), [currentHealthcareSlide, goToHealthcareSlide])
  const openHealthcareSlides = () => { setHealthcareSlidesOpen(true); setCurrentHealthcareSlide(0); setHealthcareDirection(1) }
  const closeHealthcareSlides = () => { setHealthcareSlidesOpen(false); setCurrentHealthcareSlide(0) }

  // hotel slide navigation
  const HOTEL_TOTAL_SLIDES = 8
  const goToHotelSlide = useCallback((index: number) => {
    if (hotelAnimating.current || index === currentHotelSlide) return
    if (index < 0 || index >= HOTEL_TOTAL_SLIDES) return
    setHotelDirection(index > currentHotelSlide ? 1 : -1)
    setCurrentHotelSlide(index)
    hotelAnimating.current = true
  }, [currentHotelSlide])
  const nextHotel = useCallback(() => goToHotelSlide(currentHotelSlide + 1), [currentHotelSlide, goToHotelSlide])
  const prevHotel = useCallback(() => goToHotelSlide(currentHotelSlide - 1), [currentHotelSlide, goToHotelSlide])
  const openHotelSlides = () => { setHotelSlidesOpen(true); setCurrentHotelSlide(0); setHotelDirection(1) }
  const closeHotelSlides = () => { setHotelSlidesOpen(false); setCurrentHotelSlide(0) }

  // fitness slide navigation
  const FITNESS_TOTAL_SLIDES = 8
  const goToFitnessSlide = useCallback((index: number) => {
    if (fitnessAnimating.current || index === currentFitnessSlide) return
    if (index < 0 || index >= FITNESS_TOTAL_SLIDES) return
    setFitnessDirection(index > currentFitnessSlide ? 1 : -1)
    setCurrentFitnessSlide(index)
    fitnessAnimating.current = true
  }, [currentFitnessSlide])
  const nextFitness = useCallback(() => goToFitnessSlide(currentFitnessSlide + 1), [currentFitnessSlide, goToFitnessSlide])
  const prevFitness = useCallback(() => goToFitnessSlide(currentFitnessSlide - 1), [currentFitnessSlide, goToFitnessSlide])
  const openFitnessSlides = () => { setFitnessSlidesOpen(true); setCurrentFitnessSlide(0); setFitnessDirection(1) }
  const closeFitnessSlides = () => { setFitnessSlidesOpen(false); setCurrentFitnessSlide(0) }

  // nonprofit slide navigation
  const NONPROFIT_TOTAL_SLIDES = 8
  const goToNonprofitSlide = useCallback((index: number) => {
    if (nonprofitAnimating.current || index === currentNonprofitSlide) return
    if (index < 0 || index >= NONPROFIT_TOTAL_SLIDES) return
    setNonprofitDirection(index > currentNonprofitSlide ? 1 : -1)
    setCurrentNonprofitSlide(index)
    nonprofitAnimating.current = true
  }, [currentNonprofitSlide])
  const nextNonprofit = useCallback(() => goToNonprofitSlide(currentNonprofitSlide + 1), [currentNonprofitSlide, goToNonprofitSlide])
  const prevNonprofit = useCallback(() => goToNonprofitSlide(currentNonprofitSlide - 1), [currentNonprofitSlide, goToNonprofitSlide])
  const openNonprofitSlides = () => { setNonprofitSlidesOpen(true); setCurrentNonprofitSlide(0); setNonprofitDirection(1) }
  const closeNonprofitSlides = () => { setNonprofitSlidesOpen(false); setCurrentNonprofitSlide(0) }

  // saas slide navigation
  const SAAS_TOTAL_SLIDES = 8
  const goToSaasSlide = useCallback((index: number) => {
    if (saasAnimating.current || index === currentSaasSlide) return
    if (index < 0 || index >= SAAS_TOTAL_SLIDES) return
    setSaasDirection(index > currentSaasSlide ? 1 : -1)
    setCurrentSaasSlide(index)
    saasAnimating.current = true
  }, [currentSaasSlide])
  const nextSaas = useCallback(() => goToSaasSlide(currentSaasSlide + 1), [currentSaasSlide, goToSaasSlide])
  const prevSaas = useCallback(() => goToSaasSlide(currentSaasSlide - 1), [currentSaasSlide, goToSaasSlide])
  const openSaasSlides = () => { setSaasSlidesOpen(true); setCurrentSaasSlide(0); setSaasDirection(1) }
  const closeSaasSlides = () => { setSaasSlidesOpen(false); setCurrentSaasSlide(0) }

  // legal slide navigation
  const LEGAL_TOTAL_SLIDES = 8
  const goToLegalSlide = useCallback((index: number) => {
    if (legalAnimating.current || index === currentLegalSlide) return
    if (index < 0 || index >= LEGAL_TOTAL_SLIDES) return
    setLegalDirection(index > currentLegalSlide ? 1 : -1)
    setCurrentLegalSlide(index)
    legalAnimating.current = true
  }, [currentLegalSlide])
  const nextLegal = useCallback(() => goToLegalSlide(currentLegalSlide + 1), [currentLegalSlide, goToLegalSlide])
  const prevLegal = useCallback(() => goToLegalSlide(currentLegalSlide - 1), [currentLegalSlide, goToLegalSlide])
  const openLegalSlides = () => { setLegalSlidesOpen(true); setCurrentLegalSlide(0); setLegalDirection(1) }
  const closeLegalSlides = () => { setLegalSlidesOpen(false); setCurrentLegalSlide(0); navigate('/'); }

  // ── Route handling for deep linking ─────────────────────────────────────────
  useEffect(() => {
    const path = location.pathname
    const serviceMap: Record<string, () => void> = {
      '/raffles': openRaffleSlides,
      '/booking': openBookingSlides,
      '/restaurants': openRestaurantSlides,
      '/realestate': openRealEstateSlides,
      '/elearning': openElearningSlides,
      '/events': openEventSlides,
      '/jobs': openJobSlides,
      '/vehicles': openVehicleSlides,
      '/membership': openMembershipSlides,
      '/marketplace': openMarketplaceSlides,
      '/healthcare': openHealthcareSlides,
      '/hotels': openHotelSlides,
      '/fitness': openFitnessSlides,
      '/nonprofit': openNonprofitSlides,
      '/saas': openSaasSlides,
      '/legal': openLegalSlides,
    }
    
    if (serviceMap[path]) {
      serviceMap[path]()
    }
  }, [location.pathname])

  // Update open functions to navigate
  const openRaffleSlidesWithUrl = () => { openRaffleSlides(); navigate('/raffles'); }
  const openBookingSlidesWithUrl = () => { openBookingSlides(); navigate('/booking'); }
  const openRestaurantSlidesWithUrl = () => { openRestaurantSlides(); navigate('/restaurants'); }
  const openRealEstateSlidesWithUrl = () => { openRealEstateSlides(); navigate('/realestate'); }
  const openElearningSlidesWithUrl = () => { openElearningSlides(); navigate('/elearning'); }
  const openEventSlidesWithUrl = () => { openEventSlides(); navigate('/events'); }
  const openJobSlidesWithUrl = () => { openJobSlides(); navigate('/jobs'); }
  const openVehicleSlidesWithUrl = () => { openVehicleSlides(); navigate('/vehicles'); }
  const openMembershipSlidesWithUrl = () => { openMembershipSlides(); navigate('/membership'); }
  const openMarketplaceSlidesWithUrl = () => { openMarketplaceSlides(); navigate('/marketplace'); }
  const openHealthcareSlidesWithUrl = () => { openHealthcareSlides(); navigate('/healthcare'); }
  const openHotelSlidesWithUrl = () => { openHotelSlides(); navigate('/hotels'); }
  const openFitnessSlidesWithUrl = () => { openFitnessSlides(); navigate('/fitness'); }
  const openNonprofitSlidesWithUrl = () => { openNonprofitSlides(); navigate('/nonprofit'); }
  const openSaasSlidesWithUrl = () => { openSaasSlides(); navigate('/saas'); }
  const openLegalSlidesWithUrl = () => { openLegalSlides(); navigate('/legal'); }

  // keyboard (after all slide functions are defined)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (raffleSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextRaffle()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevRaffle()
        if (e.key === 'Escape') closeRaffleSlides()
      } else if (bookingSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextBooking()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevBooking()
        if (e.key === 'Escape') closeBookingSlides()
      } else if (restaurantSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextRestaurant()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevRestaurant()
        if (e.key === 'Escape') closeRestaurantSlides()
      } else if (realEstateSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextRealEstate()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevRealEstate()
        if (e.key === 'Escape') closeRealEstateSlides()
      } else if (elearningSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextElearning()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevElearning()
        if (e.key === 'Escape') closeElearningSlides()
      } else if (eventSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextEvent()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevEvent()
        if (e.key === 'Escape') closeEventSlides()
      } else if (jobSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextJob()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevJob()
        if (e.key === 'Escape') closeJobSlides()
      } else if (vehicleSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextVehicle()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevVehicle()
        if (e.key === 'Escape') closeVehicleSlides()
      } else if (membershipSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextMembership()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevMembership()
        if (e.key === 'Escape') closeMembershipSlides()
      } else if (marketplaceSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextMarketplace()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevMarketplace()
        if (e.key === 'Escape') closeMarketplaceSlides()
      } else if (healthcareSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextHealthcare()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevHealthcare()
        if (e.key === 'Escape') closeHealthcareSlides()
      } else if (hotelSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextHotel()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevHotel()
        if (e.key === 'Escape') closeHotelSlides()
      } else if (fitnessSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextFitness()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevFitness()
        if (e.key === 'Escape') closeFitnessSlides()
      } else if (nonprofitSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextNonprofit()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevNonprofit()
        if (e.key === 'Escape') closeNonprofitSlides()
      } else if (saasSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextSaas()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevSaas()
        if (e.key === 'Escape') closeSaasSlides()
      } else if (legalSlidesOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') nextLegal()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prevLegal()
        if (e.key === 'Escape') closeLegalSlides()
      } else {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') next()
        if (e.key === 'ArrowUp' || e.key === 'PageUp') prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, nextRaffle, prevRaffle, raffleSlidesOpen, nextBooking, prevBooking, bookingSlidesOpen, nextRestaurant, prevRestaurant, restaurantSlidesOpen, nextRealEstate, prevRealEstate, realEstateSlidesOpen, nextElearning, prevElearning, elearningSlidesOpen, nextEvent, prevEvent, eventSlidesOpen, nextJob, prevJob, jobSlidesOpen, nextVehicle, prevVehicle, vehicleSlidesOpen, nextMembership, prevMembership, membershipSlidesOpen, nextMarketplace, prevMarketplace, marketplaceSlidesOpen, nextHealthcare, prevHealthcare, healthcareSlidesOpen, nextHotel, prevHotel, hotelSlidesOpen, nextFitness, prevFitness, fitnessSlidesOpen, nextNonprofit, prevNonprofit, nonprofitSlidesOpen, nextSaas, prevSaas, saasSlidesOpen, nextLegal, prevLegal, legalSlidesOpen])

  const slideVariants = makeVariants(direction)
  const raffleSlideVariants = makeVariants(raffleDirection)
  const bookingSlideVariants = makeVariants(bookingDirection)
  const restaurantSlideVariants = makeVariants(restaurantDirection)
  const realEstateSlideVariants = makeVariants(realEstateDirection)
  const elearningSlideVariants = makeVariants(elearningDirection)
  const eventSlideVariants = makeVariants(eventDirection)
  const jobSlideVariants = makeVariants(jobDirection)
  const vehicleSlideVariants = makeVariants(vehicleDirection)
  const membershipSlideVariants = makeVariants(membershipDirection)
  const marketplaceSlideVariants = makeVariants(marketplaceDirection)
  const healthcareSlideVariants = makeVariants(healthcareDirection)
  const hotelSlideVariants = makeVariants(hotelDirection)
  const fitnessSlideVariants = makeVariants(fitnessDirection)
  const nonprofitSlideVariants = makeVariants(nonprofitDirection)
  const saasSlideVariants = makeVariants(saasDirection)
  const legalSlideVariants = makeVariants(legalDirection)

  // ── slide content factory ─────────────────────────────────────────────────
  const slides = [
    // 0 — Hero
    <section key="hero" className="slide neon-grid scanlines bg-[#07070f] flex items-center justify-center">
      <NeonOrbs />
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 neon-border-pink" style={{ background: 'rgba(255,0,110,0.08)' }}>
          <Star className="w-4 h-4 text-slap-yellow fill-slap-yellow" />
          <span className="font-bold text-slap-yellow text-sm tracking-widest uppercase">Based in Leeds, West Yorkshire</span>
        </div>
        <h1 className="text-[clamp(4rem,14vw,11rem)] font-black tracking-tighter leading-[0.85] uppercase mb-10">
          <span className="block text-white">Websites</span>
          <span className="block text-white">That</span>
          <span className="block hero-text-glow mt-2">SLAP</span>
          <span className="block stroke-text-neon mt-2">HARD</span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto mb-12 leading-relaxed">
          Cool, modern, big and bold web solutions for businesses that refuse to be boring.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button onClick={() => goToSlide(6)} className="px-10 py-5 gradient-slap text-white font-black text-xl rounded-full glow-pink flex items-center gap-3 justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            Start Your Project <ArrowRight className="w-6 h-6" />
          </motion.button>
          <motion.button onClick={() => goToSlide(3)} className="px-10 py-5 font-black text-xl rounded-full text-white neon-border-cyan" style={{ background: 'rgba(58,134,255,0.08)' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            View Our Work
          </motion.button>
        </div>
        <motion.div className="absolute top-8 right-8 w-16 h-16 rounded-2xl neon-border-pink flex items-center justify-center hidden lg:flex" style={{ background: 'rgba(255,0,110,0.1)' }} animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
          <Rocket className="w-8 h-8 neon-text-pink" />
        </motion.div>
        <motion.div className="absolute bottom-24 left-8 w-16 h-16 rounded-full neon-border-cyan flex items-center justify-center hidden lg:flex" style={{ background: 'rgba(58,134,255,0.1)' }} animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
          <Zap className="w-8 h-8 neon-text-cyan" />
        </motion.div>
      </div>
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 text-xs font-medium tracking-widest uppercase" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <span>Scroll</span><ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>,

    // 1 — Stats
    <section key="stats" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slap-purple/5 to-transparent" />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">Numbers That <span className="neon-text-pink">Slap</span></h2>
          <p className="text-slate-400 font-bold text-xl">Hard facts, zero fluff</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '150+', label: 'Websites Launched', cls: 'neon-text-pink' },
            { number: '98%', label: 'Happy Clients', cls: 'neon-text-green' },
            { number: '5★', label: 'Star Rating', cls: 'neon-text-yellow' },
            { number: '24/7', label: 'Support', cls: 'neon-text-cyan' },
          ].map((stat, i) => (
            <motion.div key={i} className="text-center p-6 rounded-2xl neon-gradient-border" style={{ background: 'rgba(10,10,30,0.6)' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.04 }}>
              <div className={`text-5xl md:text-7xl font-black mb-2 ${stat.cls}`}>{stat.number}</div>
              <div className="text-slate-400 font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Services
    <section key="services" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 left-0 w-80 h-80 neon-orb-pink opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-cyan opacity-20 morph-blob" style={{ animationDelay: '-4s' }} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-3">What We <span className="neon-text-purple">Do Best</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to dominate the digital space</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: 'Custom Websites', desc: 'Bespoke websites built from scratch that perfectly represent your brand and convert visitors.', border: 'neon-border-pink', glow: 'neon-text-pink' },
            { icon: ShoppingCart, title: 'E-Commerce', desc: 'Powerful online stores that make selling easy. From small shops to enterprise solutions.', border: 'neon-border-purple', glow: 'neon-text-purple' },
            { icon: Smartphone, title: 'Responsive Design', desc: 'Sites that look incredible on every device. Mobile-first approach for maximum reach.', border: 'neon-border-cyan', glow: 'neon-text-cyan' },
            { icon: Zap, title: 'Performance', desc: 'Lightning-fast load times and optimized code that keeps visitors engaged.', border: 'neon-border-pink', glow: 'neon-text-pink' },
            { icon: Palette, title: 'Brand Identity', desc: 'Complete brand packages including logos, color schemes, and visual guidelines.', border: 'neon-border-purple', glow: 'neon-text-purple' },
            { icon: Rocket, title: 'SEO & Growth', desc: 'Data-driven strategies to get your site ranking and drive organic traffic.', border: 'neon-border-green', glow: 'neon-text-green' },
          ].map((s, i) => (
            <motion.div key={i} className={`p-5 rounded-2xl ${s.border} group cursor-default`} style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4, scale: 1.02 }}>
              <s.icon className={`w-8 h-8 mb-3 ${s.glow}`} />
              <h3 className="text-lg font-black text-white mb-1">{s.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{s.desc}</p>
              <div className={`mt-2 flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity ${s.glow}`}>Learn more <ArrowRight className="w-3 h-3" /></div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8">
          <h3 className="text-center text-2xl font-black text-white mb-4">Specialty <span className="neon-text-pink">Services</span></h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div onClick={openRaffleSlidesWithUrl} className="p-5 rounded-2xl neon-border-pink group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,0,110,0.15) 0%, rgba(131,56,236,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-pink/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-pink to-slap-purple flex items-center justify-center glow-pink">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Raffle Websites</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Custom-built raffle & competition platforms. Secure payments, real-time tracking, automated winner selection, and Gambling Commission compliant.</p>
                <ul className="space-y-1 mb-3">
                  {['Secure payment integration', 'Real-time ticket sales', 'Automated winner selection', 'Admin dashboard'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-pink" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-pink-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openBookingSlidesWithUrl} className="p-5 rounded-2xl neon-border-cyan group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(58,134,255,0.15) 0%, rgba(6,255,165,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-cyan/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-cyan to-slap-purple flex items-center justify-center glow-cyan">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Booking Systems</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Custom appointment & reservation systems. From salons to clinics, restaurants to events — streamline your bookings and reduce no-shows.</p>
                <ul className="space-y-1 mb-3">
                  {['Online appointment scheduling', 'Automated reminders', 'Payment integration', 'Calendar sync'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-cyan" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openRestaurantSlidesWithUrl} className="p-5 rounded-2xl neon-border-green group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(6,255,165,0.15) 0%, rgba(58,134,255,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-green/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-green to-slap-cyan flex items-center justify-center glow-green">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Restaurant Systems</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Complete restaurant platforms with online menus, table reservations, online ordering, and integrated payments. Everything diners need at their fingertips.</p>
                <ul className="space-y-1 mb-3">
                  {['Digital menus with photos', 'Table reservations', 'Online ordering & delivery', 'Kitchen management'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-green" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openRealEstateSlidesWithUrl} className="p-5 rounded-2xl neon-border-purple group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(131,56,236,0.15) 0%, rgba(255,0,110,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-purple/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-purple to-slap-pink flex items-center justify-center glow-purple">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Real Estate</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Complete property platforms with search, filters, agent portals, virtual tours, and mortgage calculators. Everything buyers and agents need.</p>
                <ul className="space-y-1 mb-3">
                  {['Property search & filters', 'Agent portals & CRM', 'Virtual tours & galleries', 'Mortgage calculators'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-purple" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openElearningSlidesWithUrl} className="p-5 rounded-2xl neon-border-yellow group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,190,11,0.15) 0%, rgba(255,0,110,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-yellow/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-yellow to-slap-orange flex items-center justify-center glow-yellow">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">E-Learning</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Complete online course platforms with video lessons, quizzes, progress tracking, and student management. Monetize your expertise.</p>
                <ul className="space-y-1 mb-3">
                  {['Video course hosting', 'Quizzes & assessments', 'Progress tracking', 'Certificates'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-yellow" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openEventSlidesWithUrl} className="p-5 rounded-2xl neon-border-orange group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,120,0,0.15) 0%, rgba(255,190,11,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-orange/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-orange to-slap-yellow flex items-center justify-center glow-orange">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Events & Ticketing</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Event management platforms with ticketing, seating charts, and attendee management. For conferences, concerts, and shows.</p>
                <ul className="space-y-1 mb-3">
                  {['Online ticket sales', 'Seating charts', 'Attendee management', 'Check-in apps'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-orange" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-orange-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openJobSlidesWithUrl} className="p-5 rounded-2xl neon-border-pink group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.15) 0%, rgba(58,134,255,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-cyan/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-cyan to-blue-500 flex items-center justify-center glow-cyan">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Job Boards</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Custom job listing platforms with applicant tracking, employer dashboards, and candidate management. Indeed-style power.</p>
                <ul className="space-y-1 mb-3">
                  {['Job listings & search', 'Applicant tracking', 'Employer dashboards', 'Resume database'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-cyan" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openVehicleSlidesWithUrl} className="p-5 rounded-2xl neon-border-purple group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(100,50,200,0.15) 0%, rgba(131,56,236,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-purple/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-slap-purple flex items-center justify-center glow-purple">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Vehicle Dealerships</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Car and motorcycle dealership platforms with inventory management, financing calculators, and test drive booking.</p>
                <ul className="space-y-1 mb-3">
                  {['Vehicle inventory', 'Financing calculators', 'Test drive booking', 'Trade-in valuations'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-purple" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openMembershipSlidesWithUrl} className="p-5 rounded-2xl neon-border-green group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(6,255,165,0.15) 0%, rgba(255,0,110,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-green/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-slap-green flex items-center justify-center glow-green">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Membership Sites</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Subscription-based membership platforms with tiered access, content protection, and community features. Recurring revenue made easy.</p>
                <ul className="space-y-1 mb-3">
                  {['Tiered memberships', 'Content protection', 'Community forums', 'Recurring billing'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-green" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openMarketplaceSlidesWithUrl} className="p-5 rounded-2xl neon-border-pink group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,0,110,0.15) 0%, rgba(255,120,0,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-pink/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-pink to-slap-orange flex items-center justify-center glow-pink">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Marketplaces</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Multi-vendor platforms like Etsy or eBay. Vendor dashboards, commission tracking, and product management.</p>
                <ul className="space-y-1 mb-3">
                  {['Vendor management', 'Commission tracking', 'Product listings', 'Payment splitting'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-pink" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-pink-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openHealthcareSlidesWithUrl} className="p-5 rounded-2xl neon-border-cyan group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.15) 0%, rgba(6,255,165,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-cyan/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-cyan to-slap-green flex items-center justify-center glow-cyan">
                    <HeartPulse className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Healthcare</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Patient portals, appointment booking, telehealth integration, and secure medical record management.</p>
                <ul className="space-y-1 mb-3">
                  {['Patient portals', 'Appointment booking', 'Telehealth', 'Medical records'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-cyan" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openHotelSlidesWithUrl} className="p-5 rounded-2xl neon-border-purple group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(131,56,236,0.15) 0%, rgba(255,0,110,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-purple/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-purple to-slap-pink flex items-center justify-center glow-purple">
                    <BedDouble className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Hotels</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Direct booking websites that compete with Airbnb & Booking.com. Keep 100% of your revenue with zero commission fees.</p>
                <ul className="space-y-1 mb-3">
                  {['Own your bookings', 'No Airbnb fees', 'No Booking.com cuts', 'Direct payments'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-purple" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openFitnessSlidesWithUrl} className="p-5 rounded-2xl neon-border-green group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(6,255,165,0.15) 0%, rgba(58,134,255,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-green/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-green to-slap-cyan flex items-center justify-center glow-green">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Fitness/Gym</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Gym management with class booking, member tracking, workout plans, and trainer scheduling.</p>
                <ul className="space-y-1 mb-3">
                  {['Class booking', 'Member management', 'Workout tracking', 'Trainer scheduling'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-green" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openNonprofitSlidesWithUrl} className="p-5 rounded-2xl neon-border-yellow group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,190,11,0.15) 0%, rgba(255,0,110,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-yellow/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-yellow to-slap-pink flex items-center justify-center glow-yellow">
                    <HeartHandshake className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Non-Profit</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Donation platforms, fundraising campaigns, volunteer management, and impact tracking for charities.</p>
                <ul className="space-y-1 mb-3">
                  {['Donation processing', 'Fundraising campaigns', 'Volunteer management', 'Impact tracking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-yellow" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openSaasSlidesWithUrl} className="p-5 rounded-2xl neon-border-orange group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,120,0,0.15) 0%, rgba(255,190,11,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-orange/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-orange to-slap-yellow flex items-center justify-center glow-orange">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">SaaS Dashboards</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Analytics portals, admin panels, data visualization, and user management for SaaS applications.</p>
                <ul className="space-y-1 mb-3">
                  {['Analytics dashboards', 'Data visualization', 'User management', 'Reporting tools'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-orange" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-orange-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
            <motion.div onClick={openLegalSlidesWithUrl} className="p-5 rounded-2xl neon-border-cyan group cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.15) 0%, rgba(131,56,236,0.1) 100%)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slap-cyan/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slap-cyan to-slap-purple flex items-center justify-center glow-cyan">
                    <Scale className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white">Legal/Professional</h3>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-3">Client portals, case management, document handling, and appointment booking for law firms and professionals.</p>
                <ul className="space-y-1 mb-3">
                  {['Client portals', 'Case management', 'Document handling', 'Appointment booking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3 h-3 neon-text-cyan" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">Click to learn more <ArrowRight className="w-3 h-3" /></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>,


    // 3 — Work
    <section key="work" className="slide bg-[#07070f] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-3">Work That <span className="neon-text-cyan">Speaks</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Websites we've built for businesses that wanted to stand out</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Higher Heights Roofing', type: 'Roofing Contractor', url: 'https://higherheightsroofing.co.uk/', grad: 'from-slap-pink to-slap-purple', border: 'neon-border-pink' },
            { name: 'Jonny Carr Cues', type: 'Custom Pool Cues', url: 'https://www.jonnycarrcue.com', grad: 'from-slap-yellow to-slap-orange', border: 'neon-border-cyan' },
            { name: 'City Safe Locksmith', type: 'Locksmith Services', url: 'https://www.citysafelocksmith.co.uk/', grad: 'from-slap-cyan to-slap-purple', border: 'neon-border-cyan' },
          ].map((p, i) => (
            <motion.a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className={`rounded-2xl overflow-hidden group ${p.border} block`} style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className={`h-32 bg-gradient-to-br ${p.grad} flex items-center justify-center relative overflow-hidden`}>
                <motion.div className="absolute w-28 h-28 bg-white/10 rounded-full" animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }} transition={{ duration: 4, repeat: Infinity }} />
                <div className="relative z-10 text-center">
                  <Globe className="w-9 h-9 mx-auto mb-1 text-white opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-black text-xl text-white">{p.name}</span>
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center"><ArrowRight className="w-4 h-4 text-slap-pink" /></div>
                </div>
              </div>
              <div className="px-4 py-3">
                <h3 className="font-black text-white">{p.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{p.type}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>,

    // 4 — About
    <section key="about" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <NeonOrbs />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-white">
            We're <span className="neon-text-pink">Different</span>.<br />That's Why <span className="neon-text-cyan">We Win</span>.
          </h2>
          <p className="text-slate-400 font-bold mb-4 leading-relaxed">Based in Leeds, West Yorkshire — a team of designers and developers who believe websites should be more than functional. They should be unforgettable.</p>
          <p className="text-slate-400 font-bold mb-8 leading-relaxed">No boring. No templates. Every site we build is custom-crafted to make your business stand out.</p>
          <div className="flex flex-wrap gap-3">
            {['No Templates', '100% Custom', 'Fast Delivery', 'Fixed Pricing'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full neon-border-green" style={{ background: 'rgba(6,255,165,0.05)' }}>
                <CheckCircle2 className="w-4 h-4 neon-text-green" /><span className="font-bold text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="p-8 rounded-3xl neon-gradient-border" style={{ background: 'rgba(10,10,30,0.8)' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 gradient-slap rounded-2xl flex items-center justify-center glow-pink">
                <span className="text-white font-black text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>S</span>
              </div>
              <div><h3 className="font-black text-xl text-white">Sites That Slap</h3><p className="text-slate-500 text-sm">Leeds, UK</p></div>
            </div>
            <p className="text-slate-300 font-medium mb-5 leading-relaxed italic">"We believe every business deserves a website that makes them proud — something that turns heads, starts conversations, and drives real results."</p>
            <div className="flex items-center gap-3">
              {[1, 2, 3].map(i => <div key={i} className="w-9 h-9 rounded-full gradient-slap neon-border-pink" />)}
              <span className="text-slate-500 text-sm">+ the whole crew</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>,

    // 5 — CTA
    <section key="cta" className="slide flex items-center justify-center bg-[#07070f]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] neon-orb-pink morph-blob opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-purple morph-blob opacity-20" style={{ animationDelay: '-5s' }} />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">Ready to Make<br />Your Site <span className="neon-sign">SLAP?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-10 max-w-2xl mx-auto">Let's create something bold, beautiful, and built to convert. Your competitors won't know what hit them.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
      </motion.div>
    </section>,

    // 6 — Contact
    <section key="contact" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-3">Let's <span className="neon-text-cyan">Talk</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Ready to get started? Drop us a message.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              { Icon: MapPin, label: 'Location', val: 'Leeds, West Yorkshire, UK', sub: 'Working with clients worldwide', cls: 'neon-border-pink' },
              { Icon: Mail, label: 'Email', val: 'hello@sitesthatslap.co.uk', sub: 'We reply within 24 hours', cls: 'neon-border-cyan' },
              { Icon: Phone, label: 'Phone', val: '07565 871293', sub: 'Mon-Fri, 9am-6pm GMT', cls: 'neon-border-purple', href: 'tel:07565871293' },
              { Icon: MessageCircle, label: 'WhatsApp', val: '07565 871293', sub: 'Message us anytime', cls: 'neon-border-green', href: 'https://wa.me/447565871293' },
            ].map(({ Icon, label, val, sub, cls, href }, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`} style={{ background: 'rgba(10,10,30,0.8)' }}>
                  <Icon className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-black text-white mb-0.5">{label}</h3>
                  {href ? (
                    <a href={href} className="text-slate-300 font-medium text-sm hover:text-cyan-400 transition-colors">{val}</a>
                  ) : (
                    <p className="text-slate-300 font-medium text-sm">{val}</p>
                  )}
                  <p className="text-slate-500 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <form className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div><label className="block font-bold text-slate-300 mb-1 text-xs uppercase tracking-wide">Name</label><input type="text" className="w-full px-3 py-2.5 rounded-xl neon-input text-sm" placeholder="Your name" /></div>
              <div><label className="block font-bold text-slate-300 mb-1 text-xs uppercase tracking-wide">Email</label><input type="email" className="w-full px-3 py-2.5 rounded-xl neon-input text-sm" placeholder="you@company.com" /></div>
            </div>
            <div><label className="block font-bold text-slate-300 mb-1 text-xs uppercase tracking-wide">Project Type</label>
              <select className="w-full px-3 py-2.5 rounded-xl neon-input text-sm">
                <option>Website Design</option><option>E-Commerce Store</option><option>Brand Identity</option><option>Website Redesign</option><option>Other</option>
              </select>
            </div>
            <div><label className="block font-bold text-slate-300 mb-1 text-xs uppercase tracking-wide">Tell us about your project</label><textarea rows={3} className="w-full px-3 py-2.5 rounded-xl neon-input text-sm resize-none" placeholder="What's your vision?" /></div>
            <motion.button type="submit" className="w-full py-3.5 gradient-slap text-white font-black rounded-xl glow-pink" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Send Message</motion.button>
          </form>
        </div>
        <div className="mt-8 pt-5 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-slap flex items-center justify-center"><span className="text-white font-black text-xs" style={{ fontFamily: 'Orbitron, sans-serif' }}>S</span></div>
            <span className="font-black text-white">Sites That <span className="neon-text-pink">Slap</span></span>
          </div>
          <p className="text-slate-600 text-xs">© 2024 Sites That Slap. All rights reserved.</p>
          <div className="flex gap-4">{['Privacy', 'Terms', 'Twitter'].map(l => <a key={l} href="#" className="text-slate-500 hover:text-white text-xs transition-colors">{l}</a>)}</div>
        </div>
      </div>
    </section>,
  ]

  // ── raffle slides content ────────────────────────────────────────────────────
  const raffleSlides = [
    // 0 — Raffle Intro
    <section key="raffle-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-cyan opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-pink" style={{ background: 'rgba(255,0,110,0.08)' }}>
          <Ticket className="w-4 h-4 text-slap-pink" />
          <span className="font-bold text-slap-pink text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Raffle <span className="neon-text-pink">Specialists</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Custom-built raffle & competition platforms designed for your unique needs. From charity draws to commercial prize competitions.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Secure Payments', 'Real-time Tracking', 'Auto Winner Pick', 'Admin Dashboard'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-green text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="raffle-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Raffle Sites <span className="neon-text-cyan">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to run successful raffles</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Fully Custom Design', desc: 'No cookie-cutter templates. Every raffle site is uniquely designed to match your brand and appeal to your audience.', icon: Palette },
            { title: 'Secure Payments', desc: 'Integrated with Stripe, PayPal, and other payment providers. PCI compliant and fully secure transactions.', icon: Shield },
            { title: 'Real-time Tracking', desc: 'Live ticket sales dashboard. Watch your raffle fill up in real-time with detailed analytics.', icon: Zap },
            { title: 'Automated Winners', desc: 'Fair and transparent winner selection. Automatic notifications and public winner announcements.', icon: CheckCircle2 },
            { title: 'Mobile Optimized', desc: 'Designed for impulse buys on mobile. Smooth, fast, and frictionless ticket purchasing.', icon: Smartphone },
            { title: 'Social Integration', desc: 'Built-in sharing tools. Drive more entries through social media and viral marketing.', icon: Globe },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-pink" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Compliance & Trust
    <section key="raffle-compliance" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-purple morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Shield className="w-16 h-16 mx-auto mb-6 neon-text-cyan" />
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Compliant <span className="neon-text-cyan">& Secure</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Gambling Commission', desc: 'Compliant with UK gambling regulations for lawful prize competitions' },
            { title: 'Age Verification', desc: 'Built-in age checks for age-restricted raffles and competitions' },
            { title: 'Audit Trail', desc: 'Complete logs of all entries, payments, and winner selections' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">We handle the legal complexity so you can focus on running successful raffles. Our platforms are built with compliance at their core.</p>
      </motion.div>
    </section>,

    // 3 — Our Process
    <section key="raffle-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-pink">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your goals, prizes, and compliance requirements' },
            { step: '02', title: 'Design', desc: 'Custom UI/UX designed to maximize ticket sales' },
            { step: '03', title: 'Build', desc: 'Secure development with payment integration' },
            { step: '04', title: 'Launch', desc: 'Go live with full support and marketing tools' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-pink text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-pink mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="raffle-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-cyan">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Stripe & PayPal', desc: 'Accept payments from all major cards and digital wallets' },
            { title: 'Mailchimp', desc: 'Auto-add entrants to your email marketing lists' },
            { title: 'Social APIs', desc: 'Share entries, track referrals, viral growth tools' },
            { title: 'Analytics', desc: 'Google Analytics, Meta Pixel, conversion tracking' },
            { title: 'SMS Gateways', desc: 'Text notifications for winners and reminders' },
            { title: 'CRM Tools', desc: 'HubSpot, Salesforce, Zoho integration ready' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need a custom integration? We build API connections to any platform.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="raffle-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Charity Supercar Raffle</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£47K</p>
              <p className="text-slate-400 text-sm">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">1,200+</p>
              <p className="text-slate-400 text-sm">Tickets Sold</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">From Build to Live</p>
            </div>
          </div>
          <p className="text-slate-300">A charity client wanted to raffle a supercar. We built a custom platform with video entries, social sharing, and automated winner selection. Sold out in 48 hours.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="raffle-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-purple opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-purple">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Is it legal to run raffles online?', a: 'Yes, when structured as prize competitions or free draws. We build compliance into every platform.' },
            { q: 'How long does it take to build?', a: 'Typically 2-3 weeks from kickoff to launch. Complex integrations may add time.' },
            { q: 'What payment processors work?', a: 'Stripe, PayPal, Square — we integrate with any major provider you prefer.' },
            { q: 'Can I see ticket sales in real-time?', a: 'Absolutely. Your dashboard shows live sales, revenue, and entrant data.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="raffle-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-pink morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Launch Your <span className="neon-sign">Raffle?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live raffle in as little as 2 weeks. Custom built to your exact requirements.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── booking slides content ───────────────────────────────────────────────────
  const bookingSlides = [
    // 0 — Booking Intro
    <section key="booking-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-purple opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-cyan" style={{ background: 'rgba(58,134,255,0.08)' }}>
          <Calendar className="w-4 h-4 text-slap-cyan" />
          <span className="font-bold text-slap-cyan text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Booking <span className="neon-text-cyan">Specialists</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Custom appointment & reservation systems built for your business. From salons to clinics, restaurants to events — streamline your bookings and reduce no-shows.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Online Scheduling', 'Auto Reminders', 'Payment Integration', 'Calendar Sync'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-green text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="booking-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Booking Systems <span className="neon-text-pink">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to manage appointments effortlessly</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Custom Design', desc: 'Your booking system looks like you — not a generic template. Fully branded to match your business.', icon: Palette },
            { title: 'Online Scheduling', desc: 'Customers book 24/7 without calling. Real-time availability that updates instantly.', icon: Globe },
            { title: 'Automated Reminders', desc: 'Email and SMS reminders reduce no-shows by up to 80%. Customizable templates included.', icon: MessageCircle },
            { title: 'Payment Integration', desc: 'Take deposits or full payments upfront. Stripe, PayPal, and more supported.', icon: ShoppingCart },
            { title: 'Calendar Sync', desc: 'Two-way sync with Google, Outlook, Apple Calendar. Never double-book again.', icon: Calendar },
            { title: 'Mobile First', desc: 'Most bookings happen on mobile. Our systems are built mobile-first, desktop-perfect.', icon: Smartphone },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-cyan" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="booking-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-cyan morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Built For <span className="neon-text-cyan">Any Business</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Salons & Spas', desc: 'Hair, nails, beauty, massage — handle complex scheduling with ease' },
            { title: 'Clinics & Health', desc: 'Medical, dental, therapy — HIPAA-aware secure booking systems' },
            { title: 'Restaurants', desc: 'Table reservations, private dining, event bookings — all in one' },
            { title: 'Events & Classes', desc: 'Workshops, training, courses — group bookings and capacity management' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">Whether you're a solo practitioner or a multi-location business, we build booking systems that scale with you.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="booking-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-cyan">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your booking workflow and requirements' },
            { step: '02', title: 'Design', desc: 'Custom interface that matches your brand' },
            { step: '03', title: 'Integrate', desc: 'Connect calendars, payments, and reminders' },
            { step: '04', title: 'Launch', desc: 'Go live with training and support' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-cyan text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-cyan mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="booking-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-purple">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Google Calendar', desc: 'Two-way sync with Google Workspace' },
            { title: 'Outlook', desc: 'Microsoft 365 calendar integration' },
            { title: 'Stripe', desc: 'Take payments for appointments' },
            { title: 'Zoom', desc: 'Auto-generate video meeting links' },
            { title: 'SMS APIs', desc: 'Text reminders and confirmations' },
            { title: 'Zapier', desc: 'Connect to 5000+ apps' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We build custom API connections.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="booking-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Wellness Spa Chain</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">80%</p>
              <p className="text-slate-400 text-sm">Fewer No-Shows</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">300+</p>
              <p className="text-slate-400 text-sm">Bookings/Week</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">2 Weeks</p>
              <p className="text-slate-400 text-sm">To Launch</p>
            </div>
          </div>
          <p className="text-slate-300">A 3-location spa needed unified booking. We built a custom system with staff management, room allocation, and package deals. No-shows dropped dramatically with SMS reminders.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="booking-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-cyan opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-cyan">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can I sync with my existing calendar?', a: 'Yes — Google, Outlook, Apple Calendar all supported with two-way sync.' },
            { q: 'Do customers need accounts to book?', a: 'Optional — you can allow guest bookings or require registration.' },
            { q: 'Can I take deposits or payments?', a: 'Absolutely. Stripe, PayPal, Square integration included.' },
            { q: 'What about cancellations?', a: 'Customizable policies with automated refund handling.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="booking-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-cyan morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Streamline Your <span className="neon-sign">Bookings?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live booking system in as little as 2 weeks. Custom built for your exact workflow.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── restaurant slides content ────────────────────────────────────────────────
  const restaurantSlides = [
    // 0 — Restaurant Intro
    <section key="restaurant-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-cyan opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <UtensilsCrossed className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Restaurant <span className="neon-text-green">Systems</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Complete restaurant platforms built for modern dining. Digital menus, reservations, online ordering, and kitchen management — all integrated seamlessly.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Digital Menus', 'Table Booking', 'Online Ordering', 'Kitchen Display'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-cyan text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="restaurant-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Restaurant Systems <span className="neon-text-green">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to run a modern restaurant</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Digital Menus', desc: 'Beautiful, photo-rich menus that update instantly. QR code access, no app downloads needed.', icon: Smartphone },
            { title: 'Table Reservations', desc: 'Real-time booking system. Manage floor plan, turn times, and special requests effortlessly.', icon: Calendar },
            { title: 'Online Ordering', desc: 'Direct-to-customer ordering for pickup and delivery. No third-party commission fees.', icon: ShoppingCart },
            { title: 'Kitchen Display', desc: 'Digital ticket system replaces printers. Organized by course, priority, and cook time.', icon: Zap },
            { title: 'Payment Integration', desc: 'Split bills, add tips, pay at table. Apple Pay, Google Pay, cards — all seamless.', icon: CreditCard },
            { title: 'Customer Insights', desc: 'Track favorites, visit history, and spending. Build loyalty programs that actually work.', icon: Star },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-green" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-green" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="restaurant-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-green morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Built For <span className="neon-text-green">Any Venue</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Fine Dining', desc: 'Tasting menus, wine pairings, reservation-only experiences' },
            { title: 'Casual Dining', desc: 'Fast-casual, family restaurants, bistros — quick and easy' },
            { title: 'Cafés & Bars', desc: 'Coffee shops, wine bars, pubs — counter service or table' },
            { title: 'Food Trucks', desc: 'Mobile ordering, location tracking, quick pickup windows' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-green" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From Michelin-starred restaurants to street food vendors — we build systems that match your service style.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="restaurant-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-green">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your menu, workflow, and service style' },
            { step: '02', title: 'Design', desc: 'Custom digital menu and ordering interface' },
            { step: '03', title: 'Integrate', desc: 'Kitchen display, payments, and delivery APIs' },
            { step: '04', title: 'Launch', desc: 'Staff training and go-live support' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-green mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="restaurant-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-cyan">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Deliveroo/UberEats', desc: 'Sync orders with delivery platforms' },
            { title: 'Stripe', desc: 'Secure online payments' },
            { title: 'ResDiary/OpenTable', desc: 'Table management integration' },
            { title: 'Accounting', desc: 'Xero, QuickBooks, Sage sync' },
            { title: 'Inventory', desc: 'Stock level tracking' },
            { title: 'Loyalty', desc: 'Customer reward programs' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We build custom restaurant tech integrations.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="restaurant-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-pink" style={{ background: 'rgba(255,0,110,0.08)' }}>
          <Star className="w-4 h-4 text-slap-pink" />
          <span className="font-bold text-slap-pink text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-pink">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-pink text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Independent Bistro Chain</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">35%</p>
              <p className="text-slate-400 text-sm">More Orders</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">£12K</p>
              <p className="text-slate-400 text-sm">Monthly Online Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">2 Weeks</p>
              <p className="text-slate-400 text-sm">Setup Time</p>
            </div>
          </div>
          <p className="text-slate-300">A 2-location bistro wanted direct online orders instead of Deliveroo taking 30%. We built a branded ordering site with QR table ordering. Now they keep 100% of revenue.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="restaurant-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-green opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-green">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can customers order for delivery?', a: 'Yes — we integrate with your own drivers or third-party delivery services.' },
            { q: 'Do you support table reservations?', a: 'Full reservation system with table management and availability control.' },
            { q: 'Can I update the menu myself?', a: 'Easy CMS lets you change prices, items, and availability instantly.' },
            { q: 'What about kitchen printers?', a: 'We integrate with kitchen display systems and thermal printers.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-green" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="restaurant-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-green morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Modernize Your <span className="neon-sign">Restaurant?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live system in as little as 2 weeks. Custom built for your exact menu and workflow.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── real estate slides content ───────────────────────────────────────────────
  const realEstateSlides = [
    // 0 — Real Estate Intro
    <section key="realestate-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-pink opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-purple" style={{ background: 'rgba(131,56,236,0.08)' }}>
          <Building2 className="w-4 h-4 text-slap-purple" />
          <span className="font-bold text-slap-purple text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Real Estate <span className="neon-text-purple">Platforms</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Complete property platforms for agents, developers, and property managers. Search, listings, portals, and tools that close deals faster.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Property Search', 'Agent Portals', 'Virtual Tours', 'Mortgage Calc'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-cyan text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="realestate-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Real Estate Systems <span className="neon-text-purple">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to showcase and sell properties</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Advanced Search', desc: 'Smart filters for location, price, bedrooms, property type. Map-based search with draw-to-search zones.', icon: Search },
            { title: 'Agent Portals', desc: 'Complete CRM for agents. Lead tracking, follow-ups, and performance dashboards.', icon: Building2 },
            { title: 'Virtual Tours', desc: 'Photo galleries, 360° tours, video walkthroughs, and floor plans — all in one place.', icon: Globe },
            { title: 'Mortgage Calculators', desc: 'Interactive affordability and monthly payment tools. Capture serious buyers.', icon: Calculator },
            { title: 'Map Integration', desc: 'Interactive maps with nearby amenities, schools, transport. Location is everything.', icon: MapPin },
            { title: 'Instant Alerts', desc: 'New listings, price drops, back-on-market. Keep buyers engaged and agents informed.', icon: MessageCircle },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-purple" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="realestate-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-purple morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Built For <span className="neon-text-purple">Property Pros</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Estate Agents', desc: 'Multi-branch agencies with complex listing management' },
            { title: 'Developers', desc: 'New build projects, show homes, off-plan sales' },
            { title: 'Letting Agents', desc: 'Rental listings, tenant screening, property management' },
            { title: 'Property Investors', desc: 'Portfolio showcase, ROI tools, investment calculators' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From single-agent startups to nationwide franchises — we build platforms that scale with your portfolio.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="realestate-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-purple">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We understand your market and property portfolio' },
            { step: '02', title: 'Design', desc: 'Custom search and listing interface design' },
            { step: '03', title: 'Integrate', desc: 'CRM, portals, mapping, and mortgage tools' },
            { step: '04', title: 'Launch', desc: 'Go live with agent training and support' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-purple text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-purple mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="realestate-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-pink">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Rightmove/Zoopla', desc: 'Auto-sync listings to major portals' },
            { title: 'Google Maps', desc: 'Interactive property location maps' },
            { title: 'CRM Systems', desc: 'Salesforce, HubSpot, custom CRM' },
            { title: 'Email APIs', desc: 'Automated property alerts' },
            { title: 'Mortgage APIs', desc: 'Affordability calculators' },
            { title: 'Virtual Tour', desc: 'Matterport, video integration' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any property tech platform.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="realestate-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Regional Estate Agency</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">150%</p>
              <p className="text-slate-400 text-sm">More Leads</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">5 Days</p>
              <p className="text-slate-400 text-sm">Avg Time to Sell</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A 4-office agency needed a modern platform. We built advanced search, virtual tours, and an agent portal. Lead generation increased 150% in the first month.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="realestate-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-purple opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-purple">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can I sync with Rightmove and Zoopla?', a: 'Yes — we integrate with all major property portals for automatic listing sync.' },
            { q: 'Do you support virtual tours?', a: 'Full support for Matterport, video tours, 360° images, and floor plans.' },
            { q: 'Can agents manage their own listings?', a: 'Each agent gets their own portal to add, edit, and manage properties.' },
            { q: 'Is there a mortgage calculator?', a: 'Built-in affordability calculators with multiple lender options.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="realestate-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-purple morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to List Your <span className="neon-sign">Properties?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live platform in as little as 2 weeks. Custom built for your agency and market.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── e-learning slides content ────────────────────────────────────────────────
  const elearningSlides = [
    // 0 — E-Learning Intro
    <section key="elearning-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-yellow opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-orange opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-yellow" style={{ background: 'rgba(255,190,11,0.08)' }}>
          <GraduationCap className="w-4 h-4 text-slap-yellow" />
          <span className="font-bold text-slap-yellow text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">E-Learning <span className="neon-text-yellow">Platforms</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Complete online course platforms with video lessons, quizzes, progress tracking, and student management. Monetize your expertise.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Video Courses', 'Quizzes', 'Progress Tracking', 'Certificates'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-orange text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="elearning-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our E-Learning <span className="neon-text-yellow">Slaps</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to teach and monetize online</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Video Hosting', desc: 'Secure video streaming with progress tracking. Supports multiple formats and quality levels.', icon: PlayCircle },
            { title: 'Interactive Quizzes', desc: 'Multiple choice, essays, timed tests. Auto-grading and instant feedback for students.', icon: CheckCircle2 },
            { title: 'Progress Tracking', desc: 'Visual dashboards showing course completion. Gamification with badges and achievements.', icon: Zap },
            { title: 'Student Management', desc: 'Enrollments, communications, and analytics. Know exactly how students are performing.', icon: Users },
            { title: 'Certificates', desc: 'Auto-generated completion certificates. Custom branding and verification systems.', icon: Star },
            { title: 'Monetization', desc: 'One-time purchases, subscriptions, or payment plans. Stripe and PayPal integration.', icon: CreditCard },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-yellow" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-yellow" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="elearning-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-yellow morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Teach <span className="neon-text-yellow">Anything</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Coaches', desc: 'Life, business, fitness coaching programs' },
            { title: 'Educators', desc: 'Schools, universities, training centers' },
            { title: 'Creators', desc: 'Art, music, design, coding courses' },
            { title: 'Business', desc: 'Employee training, onboarding, compliance' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-yellow" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From solo instructors to major institutions — we build learning platforms that engage students and drive revenue.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="elearning-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-yellow opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-yellow">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We understand your curriculum and teaching style' },
            { step: '02', title: 'Design', desc: 'Student-friendly interface for video and quizzes' },
            { step: '03', title: 'Integrate', desc: 'Video hosting, payments, and student tracking' },
            { step: '04', title: 'Launch', desc: 'Go live with course creation tools' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-yellow text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-yellow mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="elearning-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-orange">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Vimeo/Wistia', desc: 'Secure video hosting for courses' },
            { title: 'Stripe', desc: 'Course payments and subscriptions' },
            { title: 'Zoom', desc: 'Live class integration' },
            { title: 'Quizzes', desc: 'Interactive assessments' },
            { title: 'Certificates', desc: 'Auto-generated completion certs' },
            { title: 'Zapier', desc: 'Connect to 5000+ apps' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-orange" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any learning tool.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="elearning-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Fitness Instructor Platform</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£8K</p>
              <p className="text-slate-400 text-sm">Monthly Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">500+</p>
              <p className="text-slate-400 text-sm">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">2 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A personal trainer wanted to sell courses online. We built a video platform with progress tracking, quizzes, and certificates. Now earning passive income.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="elearning-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-yellow opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-yellow">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can I upload video lessons?', a: 'Yes — unlimited video hosting with Vimeo, Wistia, or AWS integration.' },
            { q: 'Do you support quizzes and tests?', a: 'Full quiz builder with multiple choice, essays, and auto-grading.' },
            { q: 'Can students get certificates?', a: 'Auto-generated certificates on course completion — fully branded.' },
            { q: 'What about subscriptions?', a: 'One-time, monthly, or annual payment options with Stripe.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-yellow" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="elearning-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-yellow morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Teach <span className="neon-sign">Online?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live learning platform in as little as 2 weeks. Custom built for your curriculum.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── event slides content ─────────────────────────────────────────────────────
  const eventSlides = [
    // 0 — Event Intro
    <section key="event-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-yellow opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-orange" style={{ background: 'rgba(255,120,0,0.08)' }}>
          <CalendarDays className="w-4 h-4 text-slap-orange" />
          <span className="font-bold text-slap-orange text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Events & <span className="neon-text-orange">Ticketing</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Complete event management platforms with ticketing, seating charts, and attendee management. For conferences, concerts, and shows.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Online Tickets', 'Seating Charts', 'Attendee Management', 'Check-in Apps'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-yellow text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="event-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-yellow opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Event Systems <span className="neon-text-orange">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to run sold-out events</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Online Ticketing', desc: 'Sell tickets 24/7 with multiple pricing tiers. Early bird, VIP, group discounts — all automated.', icon: TicketCheck },
            { title: 'Seating Charts', desc: 'Interactive seat selection with real-time availability. Reserved seating or general admission.', icon: MapPin },
            { title: 'Attendee Management', desc: 'Complete guest lists, check-ins, and communications. Export data for marketing follow-up.', icon: Users },
            { title: 'Mobile Check-in', desc: 'QR code scanning for fast entry. Multi-device support for large events.', icon: Smartphone },
            { title: 'Event Analytics', desc: 'Real-time sales tracking, attendance metrics, and revenue reporting. Make data-driven decisions.', icon: Zap },
            { title: 'Payment Processing', desc: 'Secure payments with instant payouts. Split payments for multi-vendor events.', icon: CreditCard },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-orange" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-orange" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="event-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-orange morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Events That <span className="neon-text-orange">Sell Out</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Conferences', desc: 'Multi-day events with speaker schedules and workshops' },
            { title: 'Concerts', desc: 'Music venues, festivals, touring events' },
            { title: 'Corporate', desc: 'Product launches, galas, networking events' },
            { title: 'Sports', desc: 'Tournaments, races, competitions, leagues' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-orange" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From intimate workshops to stadium concerts — we build ticketing platforms that handle any scale.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="event-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-orange">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your event type and ticketing needs' },
            { step: '02', title: 'Design', desc: 'Branded ticketing page and seating charts' },
            { step: '03', title: 'Integrate', desc: 'Payment gateways, scanners, and analytics' },
            { step: '04', title: 'Launch', desc: 'On-sale with marketing tools and support' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-orange text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-orange mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="event-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-yellow opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-yellow">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Stripe', desc: 'Secure ticket payments' },
            { title: 'Mailchimp', desc: 'Attendee email marketing' },
            { title: 'QR Scanners', desc: 'Mobile check-in apps' },
            { title: 'Analytics', desc: 'Sales tracking and reports' },
            { title: 'Social', desc: 'Share and invite tools' },
            { title: 'Zapier', desc: 'Connect to 5000+ apps' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-yellow" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any event tech.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="event-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Music Festival Launch</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£85K</p>
              <p className="text-slate-400 text-sm">Ticket Sales</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">2,500</p>
              <p className="text-slate-400 text-sm">Attendees</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Setup Time</p>
            </div>
          </div>
          <p className="text-slate-300">A new music festival needed ticketing fast. We built tiered ticketing, group discounts, and QR check-in. Sold out 2 weeks before the event.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="event-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-orange opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-orange">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can I have different ticket types?', a: 'Yes — VIP, early bird, group tickets, and multiple tiers supported.' },
            { q: 'How do I check people in?', a: 'QR code scanning via mobile app or printable guest lists.' },
            { q: 'What if I need to refund?', a: 'Automated refund processing with customizable policies.' },
            { q: 'Can I resell tickets?', a: 'Secure ticket transfer and resale features available.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-orange" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="event-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-orange morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Sell <span className="neon-sign">Tickets?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live ticketing in as little as 2 weeks. Custom built for your event type.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── job board slides content ───────────────────────────────────────────────
  const jobSlides = [
    // 0 — Job Intro
    <section key="job-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-blue opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-cyan" style={{ background: 'rgba(0,200,255,0.08)' }}>
          <Briefcase className="w-4 h-4 text-slap-cyan" />
          <span className="font-bold text-slap-cyan text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Job Board <span className="neon-text-cyan">Platforms</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Custom job listing platforms with applicant tracking, employer dashboards, and candidate management. Indeed-style power.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Job Search', 'Apply Tracking', 'Employer Portals', 'Resume DB'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-blue text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="job-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-blue opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Job Boards <span className="neon-text-cyan">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to connect employers with talent</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Smart Search', desc: 'Advanced filters for skills, experience, location, salary. AI-powered job matching recommendations.', icon: Search },
            { title: 'Applicant Tracking', desc: 'End-to-end hiring workflow. Review, shortlist, interview, and hire — all in one place.', icon: Briefcase },
            { title: 'Employer Dashboards', desc: 'Post jobs, manage listings, view analytics. Company profiles to showcase culture.', icon: Building2 },
            { title: 'Resume Database', desc: 'Searchable candidate pool with skill tagging. Passive candidate sourcing made easy.', icon: Users },
            { title: 'Application System', desc: 'Custom application forms with file uploads. Cover letters, portfolios, assessments.', icon: CheckCircle2 },
            { title: 'Monetization', desc: 'Featured listings, subscriptions, or pay-per-post. Multiple revenue streams built-in.', icon: Banknote },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-cyan" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="job-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-cyan morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Connect <span className="neon-text-cyan">Talent</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Recruiters', desc: 'Agencies managing multiple clients and roles' },
            { title: 'Employers', desc: 'Direct hiring for growing companies' },
            { title: 'Niche Sites', desc: 'Industry-specific job boards (tech, healthcare, etc)' },
            { title: 'Freelance', desc: 'Gig economy platforms for contractors' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From local job boards to national platforms — we build systems that match the right candidates with the right opportunities.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="job-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-cyan">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your industry and hiring workflow' },
            { step: '02', title: 'Design', desc: 'Job seeker and employer interfaces' },
            { step: '03', title: 'Integrate', desc: 'Search, alerts, and application tracking' },
            { step: '04', title: 'Launch', desc: 'Go live with job posting tools' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-cyan text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-cyan mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="job-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-purple">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Indeed API', desc: 'Auto-post to Indeed' },
            { title: 'LinkedIn', desc: 'Social job sharing' },
            { title: 'Email Alerts', desc: 'New job notifications' },
            { title: 'CV Parsing', desc: 'Auto-extract resume data' },
            { title: 'Video Interviews', desc: 'Built-in screening tools' },
            { title: 'CRM', desc: 'Applicant tracking' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any HR tech.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="job-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Tech Recruitment Platform</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">5K+</p>
              <p className="text-slate-400 text-sm">Active Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">50K</p>
              <p className="text-slate-400 text-sm">Candidates</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Build Time</p>
            </div>
          </div>
          <p className="text-slate-300">A tech startup needed a niche job board. We built advanced filtering, skill matching, and employer dashboards. Now the #1 platform in their sector.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="job-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-cyan opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-cyan">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can employers post jobs themselves?', a: 'Yes — full employer portal with job management and analytics.' },
            { q: 'Do you support CV uploads?', a: 'Full document management with parsing and profile auto-fill.' },
            { q: 'Can I charge for job postings?', a: 'Built-in payment for featured listings and subscriptions.' },
            { q: 'Is there candidate matching?', a: 'AI-powered matching based on skills, experience, and preferences.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="job-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-cyan morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Launch Your <span className="neon-sign">Job Board?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live platform in as little as 2 weeks. Custom built for your industry.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── vehicle slides content ─────────────────────────────────────────────────
  const vehicleSlides = [
    // 0 — Vehicle Intro
    <section key="vehicle-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-indigo opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-purple opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-indigo" style={{ background: 'rgba(100,50,200,0.08)' }}>
          <Car className="w-4 h-4 text-slap-purple" />
          <span className="font-bold text-slap-purple text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Vehicle <span className="neon-text-purple">Dealerships</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Car and motorcycle dealership platforms with inventory management, financing calculators, and test drive booking. Drive sales online.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Inventory Mgmt', 'Financing Calc', 'Test Drive Booking', 'Trade-in Valuation'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-purple text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="vehicle-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Dealership Systems <span className="neon-text-purple">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to sell vehicles online</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Inventory Management', desc: 'Add, edit, and showcase vehicles with photos, specs, and pricing. Bulk import and export tools.', icon: Car },
            { title: 'Advanced Search', desc: 'Filter by make, model, price, mileage, year, fuel type. Save searches and get alerts.', icon: Search },
            { title: 'Financing Tools', desc: 'Monthly payment calculators, loan applications, and lease comparisons. Pre-qualification forms.', icon: Calculator },
            { title: 'Test Drive Booking', desc: 'Online scheduling with calendar integration. Automatic reminders and confirmations.', icon: Calendar },
            { title: 'Trade-in Valuation', desc: 'Instant trade-in estimates based on market data. Part-exchange calculator.', icon: Banknote },
            { title: 'CRM Integration', desc: 'Track leads from first visit to sale. Follow-up reminders and email campaigns.', icon: Users },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-purple" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="vehicle-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-purple morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Drive <span className="neon-text-purple">Sales</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Car Dealers', desc: 'New and used car dealerships of all sizes' },
            { title: 'Motorcycle', desc: 'Bike dealers and motorcycle showrooms' },
            { title: 'Commercial', desc: 'Vans, trucks, fleet sales' },
            { title: 'Classics', desc: 'Classic and collector car specialists' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From single-showroom dealers to multi-location franchises — we build platforms that move inventory faster.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="vehicle-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-purple">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your inventory and sales process' },
            { step: '02', title: 'Design', desc: 'Vehicle listings with photos and specs' },
            { step: '03', title: 'Integrate', desc: 'Finance calculators and test drive booking' },
            { step: '04', title: 'Launch', desc: 'Go live with inventory management' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-purple text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-purple mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="vehicle-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-pink">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Finance APIs', desc: 'Loan calculators and applications' },
            { title: 'HPI Checks', desc: 'Vehicle history reports' },
            { title: 'Valuation', desc: 'Auto-price suggestions' },
            { title: 'Part Exchange', desc: 'Trade-in valuations' },
            { title: 'Insurance', desc: 'Quote integrations' },
            { title: 'DMS', desc: 'Dealer management sync' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any automotive platform.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="vehicle-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Independent Car Dealership</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">60%</p>
              <p className="text-slate-400 text-sm">More Leads</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">£2M</p>
              <p className="text-slate-400 text-sm">Inventory Value Listed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Build Time</p>
            </div>
          </div>
          <p className="text-slate-300">A used car dealer needed a better platform than AutoTrader fees. We built direct listing with finance integration. Lead volume doubled in 30 days.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="vehicle-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-purple opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-purple">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can customers apply for finance?', a: 'Yes — integrated finance calculators and application forms.' },
            { q: 'Do you support part exchange?', a: 'Full trade-in valuation tools with condition assessment.' },
            { q: 'Can I import from my DMS?', a: 'Auto-import from most dealer management systems.' },
            { q: 'Is there test drive booking?', a: 'Online test drive scheduling with availability management.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="vehicle-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-purple morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Move <span className="neon-sign">Inventory?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live platform in as little as 2 weeks. Custom built for your dealership.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── membership slides content ───────────────────────────────────────────────
  const membershipSlides = [
    // 0 — Membership Intro
    <section key="membership-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-emerald opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-green opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-emerald" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Users className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Membership <span className="neon-text-green">Sites</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Subscription-based membership platforms with tiered access, content protection, and community features. Recurring revenue made easy.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Tiered Access', 'Content Protection', 'Community', 'Recurring Billing'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-green text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,

    // 1 — Features
    <section key="membership-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Membership Sites <span className="neon-text-green">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to build a thriving community</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Tiered Memberships', desc: 'Multiple subscription levels with different access rights. Bronze, Silver, Gold — you define the tiers.', icon: Star },
            { title: 'Content Protection', desc: 'Lock premium content behind paywalls. Dripped content releases over time to retain members.', icon: Shield },
            { title: 'Community Forums', desc: 'Member-only discussion boards, direct messaging, and group channels. Build real connections.', icon: Users },
            { title: 'Recurring Billing', desc: 'Automated subscription management. Failed payment recovery, upgrades, downgrades, cancellations.', icon: CreditCard },
            { title: 'Member Analytics', desc: 'Track engagement, churn rates, and lifetime value. Data-driven decisions to grow your community.', icon: Zap },
            { title: 'Gamification', desc: 'Points, badges, leaderboards, and rewards. Keep members engaged and coming back.', icon: Trophy },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-green" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-green" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 2 — Who It's For
    <section key="membership-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-green morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Build Your <span className="neon-text-green">Community</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Creators', desc: 'Content creators monetizing their audience' },
            { title: 'Coaches', desc: 'Group coaching and mastermind communities' },
            { title: 'Business', desc: 'Professional associations and trade groups' },
            { title: 'Fitness', desc: 'Online workout programs and wellness clubs' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-green" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From exclusive clubs to massive online communities — we build membership platforms that generate predictable recurring revenue.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="membership-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-green">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your community and content model' },
            { step: '02', title: 'Design', desc: 'Member portal with tiered access levels' },
            { step: '03', title: 'Integrate', desc: 'Payments, forums, and content protection' },
            { step: '04', title: 'Launch', desc: 'Go live with member onboarding tools' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-green mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="membership-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-pink">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Stripe', desc: 'Recurring subscriptions' },
            { title: 'PayPal', desc: 'Alternative payment option' },
            { title: 'Discourse', desc: 'Community forums' },
            { title: 'Zoom', desc: 'Member webinars' },
            { title: 'Email', desc: 'Member newsletters' },
            { title: 'Discord', desc: 'Private member chat' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any community platform.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="membership-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Business Coaching Community</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£15K</p>
              <p className="text-slate-400 text-sm">Monthly Recurring</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">800+</p>
              <p className="text-slate-400 text-sm">Paying Members</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">2 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A business coach wanted to monetize their audience. We built a tiered membership with exclusive content, forums, and monthly calls. Generated £15K MRR in 3 months.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="membership-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-green opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-green">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can I have multiple membership tiers?', a: 'Yes — unlimited tiers with different content access and pricing.' },
            { q: 'Do you support recurring payments?', a: 'Monthly, annual, and custom billing cycles with Stripe/PayPal.' },
            { q: 'Can I protect my content?', a: 'Full content protection — only paying members can access.' },
            { q: 'Is there a community forum?', a: 'Built-in forums or Discord/Discourse integration.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-green" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="membership-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-green morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Build Your <span className="neon-sign">Community?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live membership site in as little as 2 weeks. Custom built for your community.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── marketplace slides content ──────────────────────────────────────────────
  const marketplaceSlides = [
    <section key="marketplace-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-orange opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-pink" style={{ background: 'rgba(255,0,110,0.08)' }}>
          <Store className="w-4 h-4 text-slap-pink" />
          <span className="font-bold text-slap-pink text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Multi-Vendor <span className="neon-text-pink">Marketplaces</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Build your own Etsy, eBay, or Amazon. Multi-vendor platforms with vendor dashboards, commission tracking, and seamless payments.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Vendor Mgmt', 'Commission Tracking', 'Product Listings', 'Payment Splitting'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-orange text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,
    <section key="marketplace-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Marketplaces <span className="neon-text-pink">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Everything you need to run a thriving multi-vendor platform</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Vendor Dashboards', desc: 'Complete seller portals with inventory, orders, earnings, and analytics. Each vendor gets their own branded space.', icon: Store },
            { title: 'Commission Engine', desc: 'Flexible commission structures by category, vendor tier, or promotion. Automatic calculations and payouts.', icon: Banknote },
            { title: 'Product Management', desc: 'Bulk uploads, variants, categories, and reviews. Advanced filtering and search for thousands of products.', icon: Search },
            { title: 'Payment Splitting', desc: 'Automatic payment distribution to vendors. Hold periods, refunds, and dispute handling built-in.', icon: CreditCard },
            { title: 'Escrow System', desc: 'Secure transactions with buyer protection. Funds released only when delivery is confirmed.', icon: Shield },
            { title: 'Analytics & Reports', desc: 'Platform-wide and vendor-specific insights. Track sales, trends, and top performers.', icon: BarChart3 },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-pink" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,
    <section key="marketplace-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-pink morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Power Your <span className="neon-text-pink">Platform</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'B2C Marketplaces', desc: 'Direct-to-consumer product platforms' },
            { title: 'B2B Platforms', desc: 'Wholesale and bulk ordering systems' },
            { title: 'Niche Markets', desc: 'Specialized verticals (crafts, vintage, etc)' },
            { title: 'Service Marketplaces', desc: 'Fiverr-style service booking platforms' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From startup marketplaces to enterprise platforms — we build systems that scale with your seller base.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="marketplace-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-pink">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your marketplace model and vendors' },
            { step: '02', title: 'Design', desc: 'Buyer and seller interfaces with dashboards' },
            { step: '03', title: 'Integrate', desc: 'Payments, escrow, and shipping APIs' },
            { step: '04', title: 'Launch', desc: 'Go live with vendor onboarding tools' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-pink text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-pink mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="marketplace-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-orange">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Stripe Connect', desc: 'Split payments to vendors' },
            { title: 'PayPal', desc: 'Buyer protection enabled' },
            { title: 'Shipping', desc: 'Royal Mail, DHL, UPS' },
            { title: 'Reviews', desc: 'Trustpilot integration' },
            { title: 'Analytics', desc: 'Vendor sales reports' },
            { title: 'Tax', desc: 'VAT calculation tools' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-orange" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any marketplace tool.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="marketplace-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Artisan Goods Marketplace</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£50K</p>
              <p className="text-slate-400 text-sm">Monthly GMV</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">200+</p>
              <p className="text-slate-400 text-sm">Active Vendors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">An entrepreneur wanted an Etsy competitor for local artisans. We built multi-vendor platform with vendor dashboards and automatic payouts. Hit £50K monthly volume in 6 months.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="marketplace-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-pink opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-pink">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'How do vendors get paid?', a: 'Automatic payouts via Stripe Connect — funds split at time of purchase.' },
            { q: 'Can I charge commission fees?', a: 'Flexible commission structures by category or vendor tier.' },
            { q: 'Is there buyer protection?', a: 'Built-in escrow and dispute resolution systems.' },
            { q: 'Can vendors ship themselves?', a: 'Vendor-managed shipping or platform-managed fulfillment options.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="marketplace-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-pink morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready to Launch Your <span className="neon-sign">Marketplace?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live platform in as little as 3 weeks. Custom built for your vendor community.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── healthcare slides content ───────────────────────────────────────────────
  const healthcareSlides = [
    <section key="healthcare-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 neon-orb-green opacity-20 morph-blob" style={{ animationDelay: '-3s' }} />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-cyan" style={{ background: 'rgba(0,200,255,0.08)' }}>
          <Stethoscope className="w-4 h-4 text-slap-cyan" />
          <span className="font-bold text-slap-cyan text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Healthcare <span className="neon-text-cyan">Portals</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Patient portals, appointment booking, telehealth integration, and secure medical record management. HIPAA-aware systems.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Patient Portals', 'Telehealth', 'Appointments', 'Medical Records'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-green text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,
    <section key="healthcare-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Healthcare Systems <span className="neon-text-cyan">Slap</span></h2>
          <p className="text-slate-400 font-bold text-lg max-w-2xl mx-auto">Secure, compliant, patient-first digital health solutions</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Patient Portals', desc: 'Secure access to medical records, test results, and care plans. Two-factor authentication and audit trails.', icon: Users },
            { title: 'Appointment Booking', desc: 'Real-time scheduling with provider availability. Automated reminders and telehealth integration.', icon: Calendar },
            { title: 'Telehealth', desc: 'Video consultations, secure messaging, and digital prescriptions. HIPAA-compliant infrastructure.', icon: Smartphone },
            { title: 'Medical Records', desc: 'Electronic health records with role-based access. Integration with NHS and major health systems.', icon: FileText },
            { title: 'Prescription Management', desc: 'Digital prescriptions, pharmacy integration, and medication reminders for patients.', icon: HeartPulse },
            { title: 'Billing & Insurance', desc: 'Insurance verification, claims processing, and patient billing with payment plans.', icon: CreditCard },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-cyan" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,
    <section key="healthcare-who" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] neon-orb-cyan morph-blob opacity-15" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Care for <span className="neon-text-cyan">Providers</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'GP Practices', desc: 'Family doctors and primary care clinics' },
            { title: 'Specialists', desc: 'Dentists, physiotherapists, consultants' },
            { title: 'Clinics', desc: 'Multi-disciplinary health centers' },
            { title: 'Mental Health', desc: 'Therapists, counselors, psychiatry' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">From single practitioner to hospital groups — we build healthcare platforms that put patients first while keeping data secure.</p>
      </motion.div>
    </section>,

    // 3 — Process
    <section key="healthcare-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-cyan">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We understand your practice and compliance needs' },
            { step: '02', title: 'Design', desc: 'Patient-friendly and accessible interface' },
            { step: '03', title: 'Integrate', desc: 'EHR, telehealth, and booking systems' },
            { step: '04', title: 'Launch', desc: 'Go live with staff training' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-cyan text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-cyan mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="healthcare-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-green">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'EHR Systems', desc: 'Patient record sync' },
            { title: 'Telehealth', desc: 'Video consultation APIs' },
            { title: 'Payments', desc: 'Insurance and private billing' },
            { title: 'SMS Alerts', desc: 'Appointment reminders' },
            { title: 'Lab APIs', desc: 'Test results integration' },
            { title: 'Prescription', desc: 'Digital Rx systems' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-green" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">HIPAA-compliant and secure by design.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="healthcare-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Private Clinic Chain</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">40%</p>
              <p className="text-slate-400 text-sm">Fewer No-Shows</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">5K+</p>
              <p className="text-slate-400 text-sm">Patient Records</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A private clinic needed a patient portal with booking and video consultations. We built a secure platform integrated with their EHR. No-shows dropped 40% with SMS reminders.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="healthcare-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-cyan opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-cyan">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Is it HIPAA compliant?', a: 'Yes — all systems follow HIPAA guidelines with encryption and audit logs.' },
            { q: 'Can patients book appointments?', a: 'Full online booking with availability management.' },
            { q: 'Do you support telehealth?', a: 'Built-in video consultation or Zoom integration.' },
            { q: 'Can I see patient records?', a: 'Secure EHR integration with role-based access.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="healthcare-cta" className="slide flex items-center justify-center bg-[#070712]">
      <div className="absolute inset-0 neon-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] neon-orb-cyan morph-blob opacity-20" />
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Ready for Digital <span className="neon-sign">Healthcare?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live platform in as little as 3 weeks. HIPAA-compliant and secure.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" />
            Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" />
            WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── hotel slides content ────────────────────────────────────────────────────
  const hotelSlides = [
    <section key="hotel-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-purple" style={{ background: 'rgba(131,56,236,0.08)' }}>
          <BedDouble className="w-4 h-4 text-slap-purple" />
          <span className="font-bold text-slap-purple text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Hotel Booking <span className="neon-text-purple">Systems</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Your own booking platform. Why pay Airbnb & Booking.com 15-20% per booking? Keep every penny with your direct booking site.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['No Airbnb Fees', 'No Booking.com Cuts', 'Direct Bookings', '100% Revenue'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-pink text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,
    <section key="hotel-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Hotel Systems <span className="neon-text-purple">Slap</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Online Booking Engine', desc: 'Real-time availability with instant confirmations.', icon: BedDouble },
            { title: 'Escape the Fees', desc: 'Stop paying Airbnb & Booking.com 15-20%. Your own platform = 100% revenue.', icon: Globe },
            { title: 'Guest Portal', desc: 'Self-service check-in and room service.', icon: Users },
            { title: 'Property Management', desc: 'Housekeeping and staff management.', icon: Building2 },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-purple" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 3 — Process
    <section key="hotel-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-purple">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We understand your property and booking flow' },
            { step: '02', title: 'Design', desc: 'Booking engine with your branding' },
            { step: '03', title: 'Integrate', desc: 'Channel manager, payments, and PMS' },
            { step: '04', title: 'Launch', desc: 'Go live with direct booking site' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-purple text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-purple mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="hotel-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Escape <span className="neon-text-pink">Airbnb Fees</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Booking.com', desc: 'Channel manager sync' },
            { title: 'Airbnb', desc: 'Avoid 15-20% fees' },
            { title: 'Stripe', desc: 'Direct payments' },
            { title: 'Expedia', desc: 'Multi-channel sync' },
            { title: 'PMS', desc: 'Property management' },
            { title: 'Reviews', desc: 'Guest feedback system' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Keep 100% of your revenue with direct bookings.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="hotel-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Boutique Hotel Chain</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£25K</p>
              <p className="text-slate-400 text-sm">Saved in Fees</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">60%</p>
              <p className="text-slate-400 text-sm">Direct Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A 3-property hotel group was paying £25K/year in Airbnb/Booking.com fees. We built direct booking sites that now handle 60% of reservations — saving them thousands monthly.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="hotel-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-purple opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-purple">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Will I lose Airbnb bookings?', a: 'No — keep your Airbnb listing AND get direct bookings. Best of both worlds.' },
            { q: 'How do I sync calendars?', a: 'Two-way sync with all major platforms prevents double bookings.' },
            { q: 'Can guests pay online?', a: 'Secure card payments with Stripe — funds go directly to you.' },
            { q: 'What about cancellations?', a: 'Customizable policies with automated refund handling.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="hotel-cta" className="slide flex items-center justify-center bg-[#070712]">
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Ready to Fill <span className="neon-sign">Rooms?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live booking in as little as 3 weeks.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" /> Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" /> WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── fitness slides content ─────────────────────────────────────────────────
  const fitnessSlides = [
    <section key="fitness-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Dumbbell className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Fitness & Gym <span className="neon-text-green">Systems</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Complete gym management with class booking, member tracking, and workout plans.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Class Booking', 'Member Mgmt', 'Workout Tracking', 'Trainer Schedule'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-cyan text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,
    <section key="fitness-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Fitness Systems <span className="neon-text-green">Slap</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Class Booking', desc: 'Real-time schedules with waitlists.', icon: Calendar },
            { title: 'Member Management', desc: 'Profiles, check-ins, and progress.', icon: Users },
            { title: 'Workout Tracking', desc: 'Digital logs and goal setting.', icon: Zap },
            { title: 'Trainer Scheduling', desc: 'Personal training bookings.', icon: Calendar },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-green" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-green" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 3 — Process
    <section key="fitness-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-green opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-green">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your gym and class schedule' },
            { step: '02', title: 'Design', desc: 'Member app and trainer portal' },
            { step: '03', title: 'Integrate', desc: 'Booking, payments, and access control' },
            { step: '04', title: 'Launch', desc: 'Go live with member onboarding' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-green mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="fitness-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-cyan">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Stripe', desc: 'Membership payments' },
            { title: 'Access Control', desc: 'Door entry systems' },
            { title: 'Wearables', desc: 'Fitbit, Apple Watch sync' },
            { title: 'Zoom', desc: 'Virtual class streaming' },
            { title: 'Nutrition', desc: 'Meal planning APIs' },
            { title: 'Challenges', desc: 'Gamification tools' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Need something else? We integrate with any fitness tech.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="fitness-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Boutique Gym Chain</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£12K</p>
              <p className="text-slate-400 text-sm">Monthly MRR</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">800+</p>
              <p className="text-slate-400 text-sm">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">2 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A 2-location gym needed online class booking and member management. We built apps for iOS/Android with class schedules and progress tracking. Membership grew 40% in 3 months.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="fitness-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-green opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-green">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can members book classes?', a: 'Full class scheduling with waitlists and cancellation handling.' },
            { q: 'Do you support memberships?', a: 'Multiple membership tiers with different access levels and pricing.' },
            { q: 'Can trainers manage clients?', a: 'Trainer portal for client management and workout planning.' },
            { q: 'Is there a member app?', a: 'iOS and Android apps for booking and progress tracking.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-green" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="fitness-cta" className="slide flex items-center justify-center bg-[#070712]">
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Ready to Transform <span className="neon-sign">Fitness?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live platform in as little as 3 weeks.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" /> Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" /> WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── nonprofit slides content ──────────────────────────────────────────────
  const nonprofitSlides = [
    <section key="nonprofit-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-yellow opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-yellow" style={{ background: 'rgba(255,190,11,0.08)' }}>
          <HeartHandshake className="w-4 h-4 text-slap-yellow" />
          <span className="font-bold text-slap-yellow text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Non-Profit <span className="neon-text-yellow">Platforms</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Donation platforms, fundraising campaigns, volunteer management, and impact tracking.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Donations', 'Fundraising', 'Volunteers', 'Impact Tracking'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-pink text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,
    <section key="nonprofit-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Non-Profit Systems <span className="neon-text-yellow">Slap</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Donation Processing', desc: 'One-time and recurring donations.', icon: HeartHandshake },
            { title: 'Fundraising Campaigns', desc: 'Goal-based campaigns with tracking.', icon: Star },
            { title: 'Volunteer Management', desc: 'Recruit, schedule, and track hours.', icon: Users },
            { title: 'Impact Reporting', desc: 'Show donors their impact.', icon: BarChart3 },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-yellow" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-yellow" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 3 — Process
    <section key="nonprofit-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-yellow opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-yellow">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your cause and donor base' },
            { step: '02', title: 'Design', desc: 'Donor-friendly campaign pages' },
            { step: '03', title: 'Integrate', desc: 'Donations, volunteer, and impact tools' },
            { step: '04', title: 'Launch', desc: 'Go live with fundraising campaigns' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-yellow text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-yellow mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="nonprofit-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-pink opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-pink">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Stripe', desc: 'Donation processing' },
            { title: 'Gift Aid', desc: 'UK tax reclaim' },
            { title: 'Mailchimp', desc: 'Donor email campaigns' },
            { title: 'Salesforce', desc: 'CRM for nonprofits' },
            { title: 'Social', desc: 'Share campaigns' },
            { title: 'Events', desc: 'Fundraising events' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-pink" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Everything you need to run successful campaigns.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="nonprofit-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Environmental Charity</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">£45K</p>
              <p className="text-slate-400 text-sm">Raised in Year 1</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">2,000+</p>
              <p className="text-slate-400 text-sm">Donors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">2 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A new charity needed to fundraise quickly. We built a donation platform with Gift Aid, recurring donations, and impact tracking. Raised £45K in their first year.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="nonprofit-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-yellow opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-yellow">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Do you support Gift Aid?', a: 'Full UK Gift Aid integration with automatic tax reclaim handling.' },
            { q: 'Can I run fundraising campaigns?', a: 'Goal-based campaigns with progress tracking and social sharing.' },
            { q: 'What about recurring donations?', a: 'Monthly giving programs with donor management.' },
            { q: 'Is there volunteer management?', a: 'Volunteer sign-up, scheduling, and hour tracking included.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-yellow" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="nonprofit-cta" className="slide flex items-center justify-center bg-[#070712]">
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Ready to Amplify <span className="neon-sign">Impact?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live platform in as little as 3 weeks.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" /> Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" /> WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── saas slides content ───────────────────────────────────────────────────
  const saasSlides = [
    <section key="saas-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-orange" style={{ background: 'rgba(255,120,0,0.08)' }}>
          <BarChart3 className="w-4 h-4 text-slap-orange" />
          <span className="font-bold text-slap-orange text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">SaaS Dashboards <span className="neon-text-orange">& Analytics</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Analytics portals, admin panels, data visualization, and user management for SaaS applications.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Analytics', 'Data Viz', 'User Mgmt', 'Reporting'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-yellow text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,
    <section key="saas-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our SaaS Dashboards <span className="neon-text-orange">Slap</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Analytics Dashboards', desc: 'Real-time metrics and KPIs with customizable widgets.', icon: BarChart3 },
            { title: 'Data Visualization', desc: 'Charts, graphs, and custom visual components.', icon: Zap },
            { title: 'User Management', desc: 'Role-based access and user provisioning.', icon: Users },
            { title: 'Reporting Tools', desc: 'Scheduled reports and automated insights.', icon: FileText },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-orange" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-orange" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 3 — Process
    <section key="saas-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-orange opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-orange">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your data sources and KPIs' },
            { step: '02', title: 'Design', desc: 'Dashboard wireframes and visualizations' },
            { step: '03', title: 'Integrate', desc: 'APIs, ETL, and real-time connections' },
            { step: '04', title: 'Launch', desc: 'Go live with user training' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-orange text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-orange mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="saas-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-yellow opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-yellow">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'SQL/NoSQL', desc: 'Database connections' },
            { title: 'APIs', desc: 'REST and GraphQL' },
            { title: 'Excel/CSV', desc: 'File uploads' },
            { title: 'Salesforce', desc: 'CRM data sync' },
            { title: 'Stripe', desc: 'Revenue analytics' },
            { title: 'Zapier', desc: '5000+ app connections' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-yellow" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Connect to any data source you use.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="saas-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">E-commerce Analytics Platform</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">12</p>
              <p className="text-slate-400 text-sm">Data Sources</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">Real-time</p>
              <p className="text-slate-400 text-sm">Dashboards</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Build Time</p>
            </div>
          </div>
          <p className="text-slate-300">A scaling e-commerce brand needed to unify data from Shopify, Facebook, Google, and email. We built a real-time dashboard showing true CAC and LTV. Increased ROAS by 35%.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="saas-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-orange opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-orange">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Can you connect my database?', a: 'Yes — SQL, NoSQL, data warehouses, and APIs all supported.' },
            { q: 'Is it real-time?', a: 'Live dashboards with configurable refresh intervals.' },
            { q: 'Can I export reports?', a: 'PDF, Excel, and scheduled email reports built-in.' },
            { q: 'What about user permissions?', a: 'Role-based access with row-level security options.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-orange" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="saas-cta" className="slide flex items-center justify-center bg-[#070712]">
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Ready for <span className="neon-sign">Analytics?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live dashboard in as little as 3 weeks.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" /> Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" /> WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  // ── legal slides content ───────────────────────────────────────────────────
  const legalSlides = [
    <section key="legal-intro" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-cyan" style={{ background: 'rgba(0,200,255,0.08)' }}>
          <Scale className="w-4 h-4 text-slap-cyan" />
          <span className="font-bold text-slap-cyan text-sm tracking-widest uppercase">Specialty Service</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">Legal <span className="neon-text-cyan">Portals</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8 max-w-2xl mx-auto">Client portals, case management, document handling, and appointment booking for law firms and professionals.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Client Portals', 'Case Mgmt', 'Documents', 'Appointments'].map((tag, i) => (
            <span key={i} className="px-4 py-2 rounded-full neon-border-purple text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
        <p className="text-slate-500 text-sm">Press ↓ or scroll to explore</p>
      </motion.div>
    </section>,
    <section key="legal-features" className="slide bg-[#070712] neon-grid flex items-center">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-8 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3">Why Our Legal Systems <span className="neon-text-cyan">Slap</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Client Portals', desc: 'Secure access to case updates, documents, and billing.', icon: Users },
            { title: 'Case Management', desc: 'Track matters, deadlines, and tasks across your firm.', icon: Briefcase },
            { title: 'Document Handling', desc: 'Secure document storage, e-signatures, and version control.', icon: FileText },
            { title: 'Appointment Booking', desc: 'Client scheduling with conflict checking and reminders.', icon: Calendar },
          ].map((f, i) => (
            <motion.div key={i} className="p-5 rounded-2xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.7)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <f.icon className="w-8 h-8 mb-3 neon-text-cyan" />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>,

    // 3 — Process
    <section key="legal-process" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 neon-orb-cyan opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8">How We <span className="neon-text-cyan">Build It</span></h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Discovery', desc: 'We learn your practice and client needs' },
            { step: '02', title: 'Design', desc: 'Client portal and document workflows' },
            { step: '03', title: 'Integrate', desc: 'Case management and billing tools' },
            { step: '04', title: 'Launch', desc: 'Go live with client onboarding' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl neon-border-cyan text-left" style={{ background: 'rgba(10,10,30,0.7)' }}>
              <span className="text-3xl font-black text-slap-cyan mb-2 block">{item.step}</span>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 4 — Integrations
    <section key="legal-integrations" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 neon-orb-purple opacity-20 morph-blob" />
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Powerful <span className="neon-text-purple">Integrations</span></h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'DocuSign', desc: 'E-signature workflows' },
            { title: 'LawPay', desc: 'Legal payment processing' },
            { title: 'Clio', desc: 'Case management sync' },
            { title: 'Calendar', desc: 'Court date management' },
            { title: 'Email', desc: 'Client communications' },
            { title: 'Storage', desc: 'Secure document vault' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-purple" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 font-medium">Secure and compliant by design.</p>
      </motion.div>
    </section>,

    // 5 — Case Study
    <section key="legal-casestudy" className="slide bg-[#070712] neon-grid flex items-center justify-center">
      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 neon-border-green" style={{ background: 'rgba(6,255,165,0.08)' }}>
          <Star className="w-4 h-4 text-slap-green" />
          <span className="font-bold text-slap-green text-sm">Success Story</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Real <span className="neon-text-green">Results</span></h2>
        <div className="p-6 rounded-2xl neon-border-green text-left" style={{ background: 'rgba(10,10,30,0.8)' }}>
          <h3 className="text-2xl font-black text-white mb-4">Family Law Practice</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-slap-green">50%</p>
              <p className="text-slate-400 text-sm">Less Admin Time</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-cyan">300+</p>
              <p className="text-slate-400 text-sm">Active Clients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slap-pink">3 Weeks</p>
              <p className="text-slate-400 text-sm">Launch Time</p>
            </div>
          </div>
          <p className="text-slate-300">A family law firm was drowning in paperwork. We built a client portal with document upload, e-signatures, and automated intake. Reduced admin work by 50%.</p>
        </div>
      </motion.div>
    </section>,

    // 6 — FAQ
    <section key="legal-faq" className="slide bg-[#07070f] neon-grid flex items-center justify-center">
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 neon-orb-cyan opacity-15 morph-blob" />
      <motion.div className="relative z-10 w-full max-w-4xl mx-auto px-6" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 text-center">Common <span className="neon-text-cyan">Questions</span></h2>
        <div className="space-y-4">
          {[
            { q: 'Is client data secure?', a: 'Encrypted storage, audit logs, and compliance with legal industry standards.' },
            { q: 'Can clients upload documents?', a: 'Secure document portal with version control and access logs.' },
            { q: 'Do you support e-signatures?', a: 'DocuSign and Adobe Sign integration for legal documents.' },
            { q: 'What about billing?', a: 'Time tracking, invoicing, and trust accounting integration.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl neon-border-cyan" style={{ background: 'rgba(10,10,30,0.6)' }}>
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-slate-400 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>,

    // 7 — CTA
    <section key="legal-cta" className="slide flex items-center justify-center bg-[#070712]">
      <motion.div className="relative z-10 text-center px-6 max-w-3xl mx-auto" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Ready for <span className="neon-sign">Legal Tech?</span></h2>
        <p className="text-xl text-slate-400 font-bold mb-8">From concept to live portal in as little as 3 weeks.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a href="tel:07565871293" className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl rounded-full glow-emerald flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <PhoneCall className="w-6 h-6" /> Call Now
          </motion.a>
          <motion.a href="https://wa.me/447565871293" className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-xl rounded-full glow-green flex items-center gap-3" whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
            <MessageCircle className="w-6 h-6" /> WhatsApp Me
          </motion.a>
        </div>
        <p className="text-slate-500 text-sm mt-6">Press ESC to close</p>
      </motion.div>
    </section>,
  ]

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-neon">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => goToSlide(0)} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-slap flex items-center justify-center glow-pink">
              <span className="text-white font-black text-lg" style={{ fontFamily: 'Orbitron, sans-serif' }}>S</span>
            </div>
            <span className="font-black text-lg text-white tracking-tight">
              Sites That <span className="neon-text-pink">Slap</span>
            </span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {([['Services', 2], ['Work', 3], ['About', 4], ['Contact', 6]] as [string, number][]).map(([label, idx]) => (
              <button key={label} onClick={() => goToSlide(idx)} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                {label}
              </button>
            ))}
            <button onClick={() => goToSlide(6)} className="px-5 py-2 rounded-full neon-border-pink text-white font-bold text-sm transition-all duration-200">
              Get Started
            </button>
            <a 
              href="/login" 
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Client Login
            </a>
          </div>

          {/* Mobile Hamburger - Glowing Gradient */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient-x" />
            <div className="absolute inset-[2px] rounded-xl bg-[#0a0a1a]" />
            <div className="absolute inset-0 rounded-xl blur-md bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-50" />
            <div className="relative z-10">
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="glass-neon border-t border-white/10 mx-4 mt-2 rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,30,0.95)', backdropFilter: 'blur(20px)' }}>
              <div className="p-6 flex flex-col gap-4">
                {([['Services', 2], ['Work', 3], ['About', 4], ['Contact', 6]] as [string, number][]).map(([label, idx], i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => { goToSlide(idx); setMobileMenuOpen(false); }}
                    className="text-lg font-semibold text-slate-300 hover:text-white text-left py-3 border-b border-white/5 last:border-0 transition-colors"
                  >
                    {label}
                  </motion.button>
                ))}
                <motion.a
                  href="/login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-semibold text-slap-cyan hover:text-white text-left py-3 border-b border-white/5 transition-colors flex items-center gap-2"
                >
                  Client Login
                </motion.a>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => { goToSlide(6); setMobileMenuOpen(false); }}
                  className="mt-2 px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-pink-500/25"
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide dots */}
      {!isLoading && <SlideDots current={currentSlide} onGo={goToSlide} />}

      {/* Slide stage */}
      <div className="slide-container">
        <AnimatePresence
          initial={false}
          custom={direction}
          onExitComplete={() => { isAnimating.current = false }}
        >
          <motion.div
            key={currentSlide}
            className="slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Raffle Slides Modal */}
      <AnimatePresence>
        {raffleSlidesOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#07070f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (raffleAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextRaffle()
              else if (e.deltaY < -30) prevRaffle()
            }}
          >
            {/* Close button */}
            <button
              onClick={closeRaffleSlides}
              className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-pink flex items-center justify-center hover:scale-110 transition-transform"
              style={{ background: 'rgba(10,10,30,0.9)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Raffle slide dots */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: RAFFLE_TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToRaffleSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${currentRaffleSlide === i ? 'bg-slap-pink scale-125' : 'bg-slate-600 hover:bg-slate-500'}`}
                />
              ))}
            </div>

            {/* Raffle slide stage */}
            <div className="slide-container">
              <AnimatePresence
                initial={false}
                custom={raffleDirection}
                onExitComplete={() => { raffleAnimating.current = false }}
              >
                <motion.div
                  key={currentRaffleSlide}
                  className="slide"
                  custom={raffleDirection}
                  variants={raffleSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {raffleSlides[currentRaffleSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Slides Modal */}
      <AnimatePresence>
        {bookingSlidesOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#07070f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (bookingAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextBooking()
              else if (e.deltaY < -30) prevBooking()
            }}
          >
            {/* Close button */}
            <button
              onClick={closeBookingSlides}
              className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-cyan flex items-center justify-center hover:scale-110 transition-transform"
              style={{ background: 'rgba(10,10,30,0.9)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Booking slide dots */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: BOOKING_TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToBookingSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${currentBookingSlide === i ? 'bg-slap-cyan scale-125' : 'bg-slate-600 hover:bg-slate-500'}`}
                />
              ))}
            </div>

            {/* Booking slide stage */}
            <div className="slide-container">
              <AnimatePresence
                initial={false}
                custom={bookingDirection}
                onExitComplete={() => { bookingAnimating.current = false }}
              >
                <motion.div
                  key={currentBookingSlide}
                  className="slide"
                  custom={bookingDirection}
                  variants={bookingSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {bookingSlides[currentBookingSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restaurant Slides Modal */}
      <AnimatePresence>
        {restaurantSlidesOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#07070f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (restaurantAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextRestaurant()
              else if (e.deltaY < -30) prevRestaurant()
            }}
          >
            {/* Close button */}
            <button
              onClick={closeRestaurantSlides}
              className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-green flex items-center justify-center hover:scale-110 transition-transform"
              style={{ background: 'rgba(10,10,30,0.9)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Restaurant slide dots */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: RESTAURANT_TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToRestaurantSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${currentRestaurantSlide === i ? 'bg-slap-green scale-125' : 'bg-slate-600 hover:bg-slate-500'}`}
                />
              ))}
            </div>

            {/* Restaurant slide stage */}
            <div className="slide-container">
              <AnimatePresence
                initial={false}
                custom={restaurantDirection}
                onExitComplete={() => { restaurantAnimating.current = false }}
              >
                <motion.div
                  key={currentRestaurantSlide}
                  className="slide"
                  custom={restaurantDirection}
                  variants={restaurantSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {restaurantSlides[currentRestaurantSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real Estate Slides Modal */}
      <AnimatePresence>
        {realEstateSlidesOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#07070f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (realEstateAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextRealEstate()
              else if (e.deltaY < -30) prevRealEstate()
            }}
          >
            {/* Close button */}
            <button
              onClick={closeRealEstateSlides}
              className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-purple flex items-center justify-center hover:scale-110 transition-transform"
              style={{ background: 'rgba(10,10,30,0.9)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Real Estate slide dots */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: REAL_ESTATE_TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToRealEstateSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${currentRealEstateSlide === i ? 'bg-slap-purple scale-125' : 'bg-slate-600 hover:bg-slate-500'}`}
                />
              ))}
            </div>

            {/* Real Estate slide stage */}
            <div className="slide-container">
              <AnimatePresence
                initial={false}
                custom={realEstateDirection}
                onExitComplete={() => { realEstateAnimating.current = false }}
              >
                <motion.div
                  key={currentRealEstateSlide}
                  className="slide"
                  custom={realEstateDirection}
                  variants={realEstateSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {realEstateSlides[currentRealEstateSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* E-Learning Slides Modal */}
      <AnimatePresence>
        {elearningSlidesOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#07070f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (elearningAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextElearning()
              else if (e.deltaY < -30) prevElearning()
            }}
          >
            <button onClick={closeElearningSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-yellow flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: ELEARNING_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToElearningSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentElearningSlide === i ? 'bg-slap-yellow scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={elearningDirection} onExitComplete={() => { elearningAnimating.current = false }}>
                <motion.div key={currentElearningSlide} className="slide" custom={elearningDirection} variants={elearningSlideVariants} initial="enter" animate="center" exit="exit">
                  {elearningSlides[currentElearningSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Slides Modal */}
      <AnimatePresence>
        {eventSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (eventAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextEvent()
              else if (e.deltaY < -30) prevEvent()
            }}
>
            <button onClick={closeEventSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-orange flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: EVENT_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToEventSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentEventSlide === i ? 'bg-slap-orange scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={eventDirection} onExitComplete={() => { eventAnimating.current = false }}>
                <motion.div key={currentEventSlide} className="slide" custom={eventDirection} variants={eventSlideVariants} initial="enter" animate="center" exit="exit">
                  {eventSlides[currentEventSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Board Slides Modal */}
      <AnimatePresence>
        {jobSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (jobAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextJob()
              else if (e.deltaY < -30) prevJob()
            }}
>
            <button onClick={closeJobSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-cyan flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: JOB_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToJobSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentJobSlide === i ? 'bg-slap-cyan scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={jobDirection} onExitComplete={() => { jobAnimating.current = false }}>
                <motion.div key={currentJobSlide} className="slide" custom={jobDirection} variants={jobSlideVariants} initial="enter" animate="center" exit="exit">
                  {jobSlides[currentJobSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Slides Modal */}
      <AnimatePresence>
        {vehicleSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (vehicleAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextVehicle()
              else if (e.deltaY < -30) prevVehicle()
            }}
>
            <button onClick={closeVehicleSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-purple flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: VEHICLE_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToVehicleSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentVehicleSlide === i ? 'bg-slap-purple scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={vehicleDirection} onExitComplete={() => { vehicleAnimating.current = false }}>
                <motion.div key={currentVehicleSlide} className="slide" custom={vehicleDirection} variants={vehicleSlideVariants} initial="enter" animate="center" exit="exit">
                  {vehicleSlides[currentVehicleSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Membership Slides Modal */}
      <AnimatePresence>
        {membershipSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (membershipAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextMembership()
              else if (e.deltaY < -30) prevMembership()
            }}
>
            <button onClick={closeMembershipSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-green flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: MEMBERSHIP_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToMembershipSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentMembershipSlide === i ? 'bg-slap-green scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={membershipDirection} onExitComplete={() => { membershipAnimating.current = false }}>
                <motion.div key={currentMembershipSlide} className="slide" custom={membershipDirection} variants={membershipSlideVariants} initial="enter" animate="center" exit="exit">
                  {membershipSlides[currentMembershipSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marketplace Slides Modal */}
      <AnimatePresence>
        {marketplaceSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (marketplaceAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextMarketplace()
              else if (e.deltaY < -30) prevMarketplace()
            }}
>
            <button onClick={closeMarketplaceSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-pink flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: MARKETPLACE_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToMarketplaceSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentMarketplaceSlide === i ? 'bg-slap-pink scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={marketplaceDirection} onExitComplete={() => { marketplaceAnimating.current = false }}>
                <motion.div key={currentMarketplaceSlide} className="slide" custom={marketplaceDirection} variants={marketplaceSlideVariants} initial="enter" animate="center" exit="exit">
                  {marketplaceSlides[currentMarketplaceSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Healthcare Slides Modal */}
      <AnimatePresence>
        {healthcareSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (healthcareAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextHealthcare()
              else if (e.deltaY < -30) prevHealthcare()
            }}
>
            <button onClick={closeHealthcareSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-cyan flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: HEALTHCARE_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToHealthcareSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentHealthcareSlide === i ? 'bg-slap-cyan scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={healthcareDirection} onExitComplete={() => { healthcareAnimating.current = false }}>
                <motion.div key={currentHealthcareSlide} className="slide" custom={healthcareDirection} variants={healthcareSlideVariants} initial="enter" animate="center" exit="exit">
                  {healthcareSlides[currentHealthcareSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotel Slides Modal */}
      <AnimatePresence>
        {hotelSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (hotelAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextHotel()
              else if (e.deltaY < -30) prevHotel()
            }}
>
            <button onClick={closeHotelSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-purple flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: HOTEL_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToHotelSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentHotelSlide === i ? 'bg-slap-purple scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={hotelDirection} onExitComplete={() => { hotelAnimating.current = false }}>
                <motion.div key={currentHotelSlide} className="slide" custom={hotelDirection} variants={hotelSlideVariants} initial="enter" animate="center" exit="exit">
                  {hotelSlides[currentHotelSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fitness Slides Modal */}
      <AnimatePresence>
        {fitnessSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (fitnessAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextFitness()
              else if (e.deltaY < -30) prevFitness()
            }}
>
            <button onClick={closeFitnessSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-green flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: FITNESS_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToFitnessSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentFitnessSlide === i ? 'bg-slap-green scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={fitnessDirection} onExitComplete={() => { fitnessAnimating.current = false }}>
                <motion.div key={currentFitnessSlide} className="slide" custom={fitnessDirection} variants={fitnessSlideVariants} initial="enter" animate="center" exit="exit">
                  {fitnessSlides[currentFitnessSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nonprofit Slides Modal */}
      <AnimatePresence>
        {nonprofitSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (nonprofitAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextNonprofit()
              else if (e.deltaY < -30) prevNonprofit()
            }}
>
            <button onClick={closeNonprofitSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-yellow flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: NONPROFIT_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToNonprofitSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentNonprofitSlide === i ? 'bg-slap-yellow scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={nonprofitDirection} onExitComplete={() => { nonprofitAnimating.current = false }}>
                <motion.div key={currentNonprofitSlide} className="slide" custom={nonprofitDirection} variants={nonprofitSlideVariants} initial="enter" animate="center" exit="exit">
                  {nonprofitSlides[currentNonprofitSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SaaS Slides Modal */}
      <AnimatePresence>
        {saasSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (saasAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextSaas()
              else if (e.deltaY < -30) prevSaas()
            }}
>
            <button onClick={closeSaasSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-orange flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: SAAS_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToSaasSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentSaasSlide === i ? 'bg-slap-orange scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={saasDirection} onExitComplete={() => { saasAnimating.current = false }}>
                <motion.div key={currentSaasSlide} className="slide" custom={saasDirection} variants={saasSlideVariants} initial="enter" animate="center" exit="exit">
                  {saasSlides[currentSaasSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Slides Modal */}
      <AnimatePresence>
        {legalSlidesOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-[#07070f]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={(e) => {
              if (window.innerWidth < 768) return
              if (legalAnimating.current) return
              e.preventDefault()
              if (e.deltaY > 30) nextLegal()
              else if (e.deltaY < -30) prevLegal()
            }}
>
            <button onClick={closeLegalSlides} className="fixed top-6 right-6 z-[101] w-12 h-12 rounded-full neon-border-cyan flex items-center justify-center hover:scale-110 transition-transform" style={{ background: 'rgba(10,10,30,0.9)' }}>
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-3">
              {Array.from({ length: LEGAL_TOTAL_SLIDES }).map((_, i) => (
                <button key={i} onClick={() => goToLegalSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentLegalSlide === i ? 'bg-slap-cyan scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
            <div className="slide-container">
              <AnimatePresence initial={false} custom={legalDirection} onExitComplete={() => { legalAnimating.current = false }}>
                <motion.div key={currentLegalSlide} className="slide" custom={legalDirection} variants={legalSlideVariants} initial="enter" animate="center" exit="exit">
                  {legalSlides[currentLegalSlide]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
