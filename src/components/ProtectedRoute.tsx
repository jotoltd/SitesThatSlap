import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole?: 'admin' | 'client'
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
