import { useState } from 'react'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Clock, Search } from 'lucide-react'
import type { CalendarEvent, EventType } from '../../types'
import { EventTypeBadge } from './EventTypeBadge'

interface Props {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
}

export function EventList({ events, onSelectEvent }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<EventType | ''>('')

  const filtered = events.filter(ev => {
    if (typeFilter && ev.event_type !== typeFilter) return false
    if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar eventos..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as EventType | '')}
          className="px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-gold"
        >
          <option value="">Todos os tipos</option>
          <option value="sessao_regular">Sessao Regular</option>
          <option value="evento">Evento</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-text-muted">Nenhum evento encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ev => {
            const date = parse(ev.event_date, 'yyyy-MM-dd', new Date())
            return (
              <button
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="w-full text-left bg-bg-card border border-border rounded-xl p-4 hover:border-gold/50 transition group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <EventTypeBadge type={ev.event_type} />
                      <span className="text-text-muted text-xs capitalize">
                        {format(date, "EEE, d MMM yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-gold transition truncate">
                      {ev.title}
                    </h3>
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {ev.start_time.substring(0, 5)}
                        {ev.end_time && ` - ${ev.end_time.substring(0, 5)}`}
                      </span>
                      {ev.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={14} />
                          {ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-gold">{format(date, 'd')}</div>
                    <div className="text-xs text-text-muted capitalize">{format(date, 'MMM', { locale: ptBR })}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
