import React, { Suspense, lazy, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthProvider } from './lib/auth.tsx'
import App from './App.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import './index.css'

const Login = lazy(() => import('./pages/Login.tsx'))
const ClientDashboard = lazy(() => import('./pages/ClientDashboard.tsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'))
const ServicesPage = lazy(() => import('./pages/services/index.tsx'))
const ServiceDetail = lazy(() => import('./pages/services/ServiceDetail.tsx'))
const QuoteBuilder = lazy(() => import('./pages/QuoteBuilder.tsx'))
const IndianDevelopers = lazy(() => import('./pages/IndianDevelopers.tsx'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-pink-500 border-r-purple-500 animate-spin" />
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-black neon-text-pink mb-4">404</h1>
        <p className="text-2xl font-bold text-white mb-2">Page not found</p>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform inline-block">Go Home</Link>
      </div>
    </div>
  )
}

function PaymentHandler({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment === 'success') {
      toast.success('Payment successful! Your invoice has been marked as paid.')
      searchParams.delete('payment')
      setSearchParams(searchParams, { replace: true })
    } else if (payment === 'cancelled') {
      toast.error('Payment was cancelled.')
      searchParams.delete('payment')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])
  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/quote" element={<QuoteBuilder />} />
            <Route path="/join-team" element={<IndianDevelopers />} />
            <Route path="/client" element={
              <ProtectedRoute allowedRole="client">
                <PaymentHandler><ClientDashboard /></PaymentHandler>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
