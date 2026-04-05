import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function ApprovedRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading, isApproved } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />
  if (profile && !isApproved) return <Navigate to="/aguardando" replace />

  return <>{children}</>
}
