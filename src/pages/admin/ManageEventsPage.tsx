import { useState } from 'react'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../contexts/AuthContext'
import { useEvents } from '../../hooks/useEvents'
import { createEvent, updateEvent, deleteEvent } from '../../lib/events'
import { EventForm } from '../../components/events/EventForm'
import { EventTypeBadge } from '../../components/events/EventTypeBadge'
import type { CalendarEvent, CalendarEventInput } from '../../types'

export function ManageEventsPage() {
  const { profile } = useAuth()
  const { events, loading, refetch } = useEvents()
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  const handleCreate = async (data: CalendarEventInput) => {
    if (!profile) return
    await createEvent(data, profile.id)
    toast.success('Evento criado com sucesso')
    setShowForm(false)
    refetch()
  }

  const handleUpdate = async (data: CalendarEventInput) => {
    if (!editingEvent) return
    await updateEvent(editingEvent.id, data)
    toast.success('Evento atualizado')
    setEditingEvent(null)
    refetch()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este evento?')) return
    await deleteEvent(id)
    toast.success('Evento eliminado')
    refetch()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Gerir Eventos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-bg-primary font-semibold rounded-lg transition text-sm"
        >
          <Plus size={18} />
          Novo Evento
        </button>
      </div>

      {loading ? (
        <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-text-muted">Nenhum evento criado.</p>
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">Evento</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">Data</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">Hora</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">Local</th>
                  <th className="text-right px-4 py-3 text-text-secondary font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => {
                  const date = parse(ev.event_date, 'yyyy-MM-dd', new Date())
                  return (
                    <tr key={ev.id} className="border-b border-border last:border-0 hover:bg-bg-input/50 transition">
                      <td className="px-4 py-3 text-text-primary font-medium">{ev.title}</td>
                      <td className="px-4 py-3"><EventTypeBadge type={ev.event_type} /></td>
                      <td className="px-4 py-3 text-text-secondary capitalize">
                        {format(date, "d MMM yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {ev.start_time.substring(0, 5)}
                        {ev.end_time && ` - ${ev.end_time.substring(0, 5)}`}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{ev.location || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingEvent(ev)}
                            className="p-1.5 text-text-muted hover:text-gold transition"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="p-1.5 text-text-muted hover:text-danger transition"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <EventForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}

      {editingEvent && (
        <EventForm event={editingEvent} onSubmit={handleUpdate} onClose={() => setEditingEvent(null)} />
      )}
    </div>
  )
}
