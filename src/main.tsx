import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth.tsx'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import ClientDashboard from './pages/ClientDashboard.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import ServicesPage from './pages/services/index.tsx'
import ServiceDetail from './pages/services/ServiceDetail.tsx'
import QuoteBuilder from './pages/QuoteBuilder.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/quote" element={<QuoteBuilder />} />
          <Route path="/client" element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
