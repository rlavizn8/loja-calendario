import { useCallback, useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { CalendarEvent } from '../../types'
import { CalendarToolbar } from './CalendarToolbar'
import '../../styles/calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales: { 'pt-BR': ptBR },
})

const messages = {
  today: 'Hoje',
  previous: 'Anterior',
  next: 'Proximo',
  month: 'Mes',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Sem eventos neste periodo.',
  showMore: (count: number) => `+${count} mais`,
}

interface Props {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
  onNavigate?: (date: Date) => void
}

interface BigCalendarEvent {
  title: string
  start: Date
  end: Date
  resource: CalendarEvent
}

export function CalendarView({ events, onSelectEvent, onNavigate }: Props) {
  const [view, setView] = useState<View>(() =>
    window.innerWidth < 768 ? 'agenda' : 'month'
  )

  const calendarEvents: BigCalendarEvent[] = useMemo(
    () =>
      events.map(ev => {
        const [year, month, day] = ev.event_date.split('-').map(Number)
        const [sh, sm] = ev.start_time.split(':').map(Number)
        const start = new Date(year, month - 1, day, sh, sm)
        let end: Date
        if (ev.end_time) {
          const [eh, em] = ev.end_time.split(':').map(Number)
          end = new Date(year, month - 1, day, eh, em)
        } else {
          end = new Date(start.getTime() + 60 * 60 * 1000)
        }
        return { title: ev.title, start, end, resource: ev }
      }),
    [events]
  )

  const eventPropGetter = useCallback((event: BigCalendarEvent) => ({
    className: event.resource.event_type === 'sessao_regular' ? 'event-sessao' : 'event-evento',
  }), [])

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ minHeight: 600 }}
        culture="pt-BR"
        messages={messages}
        views={['month', 'agenda']}
        view={view}
        onView={setView}
        onNavigate={onNavigate}
        onSelectEvent={e => onSelectEvent(e.resource)}
        eventPropGetter={eventPropGetter}
        components={{ toolbar: CalendarToolbar }}
        popup
      />
    </div>
  )
}
