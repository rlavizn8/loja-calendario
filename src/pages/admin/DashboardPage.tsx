import { Calendar, Users, Clock, CalendarCheck } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'
import { useUsers } from '../../hooks/useUsers'

export function DashboardPage() {
  const { events } = useEvents()
  const { users } = useUsers()

  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = events.filter(e => e.event_date >= today)
  const pendingUsers = users.filter(u => !u.approved)
  const approvedUsers = users.filter(u => u.approved)

  const stats = [
    { label: 'Total Eventos', value: events.length, icon: Calendar, color: 'text-gold' },
    { label: 'Proximos Eventos', value: upcomingEvents.length, icon: CalendarCheck, color: 'text-success' },
    { label: 'Membros Aprovados', value: approvedUsers.length, icon: Users, color: 'text-text-primary' },
    { label: 'Pendentes', value: pendingUsers.length, icon: Clock, color: 'text-danger' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-text-primary">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-text-muted text-sm">{label}</p>
          </div>
        ))}
      </div>

      {upcomingEvents.length > 0 && (
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gold mb-3">Proximos Eventos</h3>
          <div className="space-y-2">
            {upcomingEvents.slice(0, 5).map(ev => (
              <div key={ev.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-text-primary text-sm font-medium">{ev.title}</span>
                <span className="text-text-muted text-xs">{ev.event_date} {ev.start_time.substring(0, 5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
