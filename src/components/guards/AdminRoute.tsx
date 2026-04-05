import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, isAdmin, isApproved } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />
  if (!isApproved) return <Navigate to="/aguardando" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
