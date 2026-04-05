import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar as CalIcon, List } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { CalendarView } from '../components/calendar/CalendarView'
import { EventList } from '../components/events/EventList'
import { EventDetail } from '../components/events/EventDetail'
import type { CalendarEvent } from '../types'

export function CalendarPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const viewMode = location.pathname === '/eventos' ? 'list' : 'calendar'

  const setViewMode = (mode: 'calendar' | 'list') => {
    navigate(mode === 'list' ? '/eventos' : '/', { replace: true })
  }
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const { events, loading } = useEvents()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">
          {viewMode === 'calendar' ? 'Calendario' : 'Proximos Eventos'}
        </h2>
        <div className="flex items-center gap-1 bg-bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              viewMode === 'calendar'
                ? 'bg-gold text-bg-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <CalIcon size={16} />
            Calendario
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              viewMode === 'list'
                ? 'bg-gold text-bg-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List size={16} />
            Lista
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto" />
          <p className="text-text-muted mt-3 text-sm">A carregar eventos...</p>
        </div>
      ) : viewMode === 'calendar' ? (
        <CalendarView
          events={events}
          onSelectEvent={setSelectedEvent}
          onNavigate={() => {}}
        />
      ) : (
        <EventList events={events} onSelectEvent={setSelectedEvent} />
      )}

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
