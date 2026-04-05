import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X, MapPin, Clock, CalendarDays } from 'lucide-react'
import type { CalendarEvent } from '../../types'
import { EventTypeBadge } from './EventTypeBadge'

interface Props {
  event: CalendarEvent
  onClose: () => void
}

function formatTime(time: string) {
  return time.substring(0, 5)
}

export function EventDetail({ event, onClose }: Props) {
  const date = parse(event.event_date, 'yyyy-MM-dd', new Date())

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <EventTypeBadge type={event.event_type} />
            <h2 className="text-xl font-bold text-text-primary">{event.title}</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition p-1">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-text-secondary">
            <CalendarDays size={18} className="text-gold shrink-0" />
            <span className="capitalize">
              {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>

          <div className="flex items-center gap-3 text-text-secondary">
            <Clock size={18} className="text-gold shrink-0" />
            <span>
              {formatTime(event.start_time)}
              {event.end_time && ` - ${formatTime(event.end_time)}`}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-text-secondary">
              <MapPin size={18} className="text-gold shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.description && (
          <div className="border-t border-border pt-4">
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
