import { useCallback, useEffect, useState } from 'react'
import type { Profile } from '../types'
import { fetchAllProfiles, fetchPendingUsers } from '../lib/profiles'

export function useUsers(pendingOnly = false) {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = pendingOnly ? await fetchPendingUsers() : await fetchAllProfiles()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [pendingOnly])

  useEffect(() => {
    load()
  }, [load])

  return { users, loading, error, refetch: load }
}
