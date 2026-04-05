import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth()

  if (loading) return null

  if (session && profile?.approved) return <Navigate to="/" replace />
  if (session && profile && !profile.approved) return <Navigate to="/aguardando" replace />

  return <>{children}</>
}
