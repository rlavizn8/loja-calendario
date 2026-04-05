import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Calendar, List, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { profile, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive(path)
        ? 'bg-gold/20 text-gold'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-input'
    }`

  const navItems = (
    <>
      <Link to="/" className={navLinkClass('/')} onClick={() => setMenuOpen(false)}>
        <Calendar size={18} />
        Calendario
      </Link>
      <Link to="/eventos" className={navLinkClass('/eventos')} onClick={() => setMenuOpen(false)}>
        <List size={18} />
        Lista
      </Link>
      {isAdmin && (
        <>
          <Link to="/admin/eventos" className={navLinkClass('/admin/eventos')} onClick={() => setMenuOpen(false)}>
            <Settings size={18} />
            Gerir Eventos
          </Link>
          <Link to="/admin/membros" className={navLinkClass('/admin/membros')} onClick={() => setMenuOpen(false)}>
            <Users size={18} />
            Membros
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="bg-bg-secondary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/logo-aviz.jpeg" alt="R∴L∴ Aviz" className="h-10" />
            <div className="hidden sm:block">
              <h1 className="text-gold font-bold text-sm leading-tight">R∴L∴ Aviz Nº8</h1>
              <p className="text-text-muted text-xs">Calendario</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-text-secondary text-sm">{profile?.full_name}</span>
            {isAdmin && (
              <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">Admin</span>
            )}
            <button
              onClick={signOut}
              className="text-text-muted hover:text-danger transition p-1.5"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-text-secondary hover:text-text-primary p-1.5"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden py-3 border-t border-border flex flex-col gap-1">
            {navItems}
          </nav>
        )}
      </div>
    </header>
  )
}
