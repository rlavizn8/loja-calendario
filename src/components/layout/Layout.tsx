import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Toaster } from 'sonner'

export function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          },
        }}
      />
    </div>
  )
}
