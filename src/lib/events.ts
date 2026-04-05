import { supabase } from '../config/supabase'
import type { CalendarEvent, CalendarEventInput, EventType } from '../types'

export async function fetchEvents(filters?: {
  month?: Date
  type?: EventType
}): Promise<CalendarEvent[]> {
  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  if (filters?.month) {
    const year = filters.month.getFullYear()
    const month = filters.month.getMonth()
    const start = new Date(year, month, 1).toISOString().split('T')[0]
    const end = new Date(year, month + 1, 0).toISOString().split('T')[0]
    query = query.gte('event_date', start).lte('event_date', end)
  }

  if (filters?.type) {
    query = query.eq('event_type', filters.type)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function fetchAllEvents(): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createEvent(event: CalendarEventInput, userId: string): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('events')
    .insert({ ...event, created_by: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEvent(id: string, event: Partial<CalendarEventInput>): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw error
}
