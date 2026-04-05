import { useCallback, useEffect, useState } from 'react'
import type { CalendarEvent, EventType } from '../types'
import { fetchEvents, fetchAllEvents } from '../lib/events'

export function useEvents(filters?: { month?: Date; type?: EventType }) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = filters ? await fetchEvents(filters) : await fetchAllEvents()
      setEvents(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters?.month?.getTime(), filters?.type])

  useEffect(() => {
    load()
  }, [load])

  return { events, loading, error, refetch: load }
}
