export type UserRole = 'admin' | 'member'

export type EventType = 'sessao_regular' | 'evento'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  approved: boolean
  created_at: string
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string
  end_time: string | null
  location: string | null
  event_type: EventType
  created_by: string
  created_at: string
}

export interface CalendarEventInput {
  title: string
  description?: string
  event_date: string
  start_time: string
  end_time?: string
  location?: string
  event_type: EventType
}
