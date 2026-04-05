import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Save } from 'lucide-react'
import type { CalendarEvent, CalendarEventInput } from '../../types'

const schema = z.object({
  title: z.string().min(1, 'Titulo obrigatorio'),
  description: z.string().optional(),
  event_date: z.string().min(1, 'Data obrigatoria'),
  start_time: z.string().min(1, 'Hora de inicio obrigatoria'),
  end_time: z.string().optional(),
  location: z.string().optional(),
  event_type: z.enum(['sessao_regular', 'evento']),
})

type FormData = z.infer<typeof schema>

interface Props {
  event?: CalendarEvent | null
  onSubmit: (data: CalendarEventInput) => Promise<void>
  onClose: () => void
}

export function EventForm({ event, onSubmit, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description ?? '',
          event_date: event.event_date,
          start_time: event.start_time.substring(0, 5),
          end_time: event.end_time?.substring(0, 5) ?? '',
          location: event.location ?? '',
          event_type: event.event_type,
        }
      : {
          event_type: 'sessao_regular',
        },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      title: data.title,
      description: data.description || undefined,
      event_date: data.event_date,
      start_time: data.start_time,
      end_time: data.end_time || undefined,
      location: data.location || undefined,
      event_type: data.event_type,
    })
  }

  const inputClass =
    'w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition text-sm'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-bg-card border border-border rounded-xl max-w-lg w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary">
            {event ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Titulo</label>
            <input {...register('title')} className={inputClass} placeholder="Nome do evento" />
            {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tipo</label>
            <select {...register('event_type')} className={inputClass}>
              <option value="sessao_regular">Sessao Regular</option>
              <option value="evento">Evento</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Data</label>
              <input type="date" {...register('event_date')} className={inputClass} />
              {errors.event_date && <p className="text-danger text-xs mt-1">{errors.event_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Local</label>
              <input {...register('location')} className={inputClass} placeholder="Local do evento" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Hora inicio</label>
              <input type="time" {...register('start_time')} className={inputClass} />
              {errors.start_time && <p className="text-danger text-xs mt-1">{errors.start_time.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Hora fim</label>
              <input type="time" {...register('end_time')} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Descricao</label>
            <textarea
              {...register('description')}
              rows={3}
              className={inputClass}
              placeholder="Detalhes do evento (ordem de trabalhos, notas, etc.)"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-bg-input border border-border rounded-lg text-text-secondary hover:text-text-primary transition text-sm">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gold hover:bg-gold-light text-bg-primary font-semibold rounded-lg transition disabled:opacity-50 text-sm"
            >
              <Save size={16} />
              {isSubmitting ? 'A guardar...' : event ? 'Guardar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
