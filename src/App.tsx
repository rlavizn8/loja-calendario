import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PublicRoute } from './components/guards/PublicRoute'
import { AuthRoute } from './components/guards/AuthRoute'
import { ApprovedRoute } from './components/guards/ApprovedRoute'
import { AdminRoute } from './components/guards/AdminRoute'
import { Layout } from './components/layout/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { PendingPage } from './pages/PendingPage'
import { CalendarPage } from './pages/CalendarPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { ManageEventsPage } from './pages/admin/ManageEventsPage'
import { ManageUsersPage } from './pages/admin/ManageUsersPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/registrar" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/aguardando" element={<AuthRoute><PendingPage /></AuthRoute>} />

          <Route element={<ApprovedRoute><Layout /></ApprovedRoute>}>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/eventos" element={<CalendarPage />} />
          </Route>

          <Route element={<AdminRoute><Layout /></AdminRoute>}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/eventos" element={<ManageEventsPage />} />
            <Route path="/admin/membros" element={<ManageUsersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
