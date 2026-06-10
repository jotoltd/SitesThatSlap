import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UserPlus, Edit2, Trash2, MessageSquare, 
  CheckCircle, Clock, AlertCircle, Download, Filter,
  Loader2, RefreshCw
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface Activity {
  id: string
  user_id: string
  user_name?: string
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'messaged' | 'paid' | 'status_changed'
  entity_type: 'client' | 'project' | 'invoice' | 'message' | 'file'
  entity_id: string
  entity_name?: string
  details?: string
  created_at: string
}

const actionIcons: Record<string, React.ElementType> = {
  created: UserPlus,
  updated: Edit2,
  deleted: Trash2,
  viewed: CheckCircle,
  messaged: MessageSquare,
  paid: CheckCircle,
  status_changed: AlertCircle
}

const actionColors: Record<string, string> = {
  created: 'text-green-400 bg-green-500/20',
  updated: 'text-blue-400 bg-blue-500/20',
  deleted: 'text-red-400 bg-red-500/20',
  viewed: 'text-slate-400 bg-slate-500/20',
  messaged: 'text-cyan-400 bg-cyan-500/20',
  paid: 'text-green-400 bg-green-500/20',
  status_changed: 'text-yellow-400 bg-yellow-500/20'
}

export function useActivityLog() {
  const logActivity = async (
    action: Activity['action'],
    entityType: Activity['entity_type'],
    entityId: string,
    entityName?: string,
    details?: string
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      details
    })
  }

  return { logActivity }
}

export default function ActivityLog({ limit = 50 }: { limit?: number }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchActivities()

    // Real-time subscription
    const channel = supabase
      .channel('activity-logs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, fetchActivities)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [filter])

  const fetchActivities = async () => {
    setLoading(true)
    let query = supabase
      .from('activity_logs')
      .select('*, user:profiles(name)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (filter !== 'all') {
      query = query.eq('action', filter)
    }

    const { data } = await query
    
    setActivities(data?.map(item => ({
      ...item,
      user_name: item.user?.name || 'Unknown'
    })) || [])
    setLoading(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchActivities()
    setRefreshing(false)
    toast.success('Activity log refreshed')
  }

  const handleExport = () => {
    const csvContent = [
      ['Date', 'User', 'Action', 'Type', 'Entity', 'Details'].join(','),
      ...activities.map(a => [
        new Date(a.created_at).toLocaleString(),
        a.user_name,
        a.action,
        a.entity_type,
        a.entity_name || a.entity_id,
        a.details || ''
      ].map(f => `"${f}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Activity log exported')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-pink-500 outline-none"
          >
            <option value="all">All Activities</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="messaged">Messages</option>
            <option value="paid">Payments</option>
          </select>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass-neon text-slate-400 hover:text-white text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass-neon text-slate-400 hover:text-white text-sm ml-auto"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No activities yet</p>
        ) : (
          activities.map((activity, i) => {
            const Icon = actionIcons[activity.action] || Clock
            const colorClass = actionColors[activity.action] || 'text-slate-400 bg-slate-500/20'
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{activity.user_name}</span>
                    <span className="text-slate-400 text-sm">{activity.action.replace('_', ' ')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                      {activity.entity_type}
                    </span>
                    {activity.entity_name && (
                      <span className="text-white text-sm truncate">{activity.entity_name}</span>
                    )}
                  </div>
                  {activity.details && (
                    <p className="text-slate-400 text-sm mt-1">{activity.details}</p>
                  )}
                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
