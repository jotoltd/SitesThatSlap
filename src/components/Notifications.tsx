import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  link?: string
  created_at: string
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    fetchNotifications()

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, fetchNotifications)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(50)
    
    setNotifications(data || [])
    setUnreadCount(data?.filter(n => !n.read).length || 0)
  }

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    fetchNotifications()
  }

  const markAllAsRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', user?.id)
    fetchNotifications()
  }

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id)
    fetchNotifications()
  }

  const createNotification = async (title: string, message: string, type: Notification['type'] = 'info', link?: string) => {
    if (!user) return
    
    await supabase.from('notifications').insert({
      user_id: user.id,
      title,
      message,
      type,
      link,
      read: false
    })
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, createNotification, refetch: fetchNotifications }
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />
      default: return <Info className="w-4 h-4 text-cyan-400" />
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 md:w-96 glass-neon rounded-2xl border border-white/10 shadow-2xl z-50 max-h-[500px] overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-pink-400 hover:text-pink-300"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-white/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">{notification.title}</p>
                          <p className="text-slate-400 text-sm mt-0.5">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-pink-400 hover:text-pink-300"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
