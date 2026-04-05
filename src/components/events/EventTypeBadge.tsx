import type { EventType } from '../../types'

const config: Record<EventType, { label: string; className: string }> = {
  sessao_regular: {
    label: 'Sessao Regular',
    className: 'bg-gold/20 text-gold',
  },
  evento: {
    label: 'Evento',
    className: 'bg-[#8B7355]/20 text-[#D4B896]',
  },
}

export function EventTypeBadge({ type }: { type: EventType }) {
  const { label, className } = config[type]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
