import type { ToolbarProps } from 'react-big-calendar'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CalendarToolbar({ label, onNavigate, onView, view }: ToolbarProps<any, object>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('PREV')}
          className="p-2 bg-bg-card border border-border rounded-lg text-text-secondary hover:text-gold hover:border-gold transition"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-2 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-gold hover:border-gold transition"
        >
          Hoje
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="p-2 bg-bg-card border border-border rounded-lg text-text-secondary hover:text-gold hover:border-gold transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <h2 className="text-gold-light font-semibold text-lg capitalize">{label}</h2>

      <div className="flex items-center gap-1">
        {(['month', 'agenda'] as const).map(v => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              view === v
                ? 'bg-gold text-bg-primary'
                : 'bg-bg-card border border-border text-text-secondary hover:text-gold hover:border-gold'
            }`}
          >
            {v === 'month' ? 'Mes' : 'Agenda'}
          </button>
        ))}
      </div>
    </div>
  )
}
