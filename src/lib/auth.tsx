import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  role: 'client' | 'admin'
  name: string
  phone?: string
  company_name?: string
  notification_settings?: {
    email?: boolean
    projects?: boolean
    invoices?: boolean
    marketing?: boolean
  }
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  isLoading: boolean
  suppressAuthChange: boolean
  setSuppressAuthChange: (value: boolean) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [suppressAuthChange, setSuppressAuthChangeState] = useState(false)
  // Use ref for synchronous access in listener closure
  const suppressAuthChangeRef = useRef(false)
  
  const setSuppressAuthChange = (value: boolean) => {
    suppressAuthChangeRef.current = value
    setSuppressAuthChangeState(value)
  }

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // If suppressed (e.g. admin is creating a client), ignore the event
      // Use ref for synchronous check (state would be stale in closure)
      if (suppressAuthChangeRef.current) return
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setUser({
        id: userId,
        email: data.email,
        role: data.role,
        name: data.name,
        phone: data.phone,
        company_name: data.company_name,
        notification_settings: data.notification_settings
      })
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('No user returned')

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) throw new Error('Failed to load user profile')

    const userData: User = {
      id: data.user.id,
      email: data.user.email!,
      role: profile.role,
      name: profile.name,
      phone: profile.phone,
      company_name: profile.company_name,
      notification_settings: profile.notification_settings
    }

    setUser(userData)
    return userData
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const refreshUser = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading, suppressAuthChange, setSuppressAuthChange, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
