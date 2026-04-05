import { supabase } from '../config/supabase'
import type { Profile } from '../types'

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function fetchPendingUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function approveUser(userId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ approved: true })
    .eq('id', userId)

  if (error) throw error
}

export async function rejectUser(userId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) throw error
}
