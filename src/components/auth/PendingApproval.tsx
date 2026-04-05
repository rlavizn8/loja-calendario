import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Clock, LogOut } from 'lucide-react'

export function PendingApproval() {
  const { profile, refreshProfile, signOut, isApproved } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshProfile()
    }, 30000)
    return () => clearInterval(interval)
  }, [refreshProfile])

  useEffect(() => {
    if (isApproved) navigate('/', { replace: true })
  }, [isApproved, navigate])

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <img src="/logo-aviz.jpeg" alt="R∴L∴ Aviz Nº8" className="h-24 mx-auto" />
        <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center">
          <Clock size={28} className="text-gold animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary">Aguardando Aprovacao</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          O seu pedido de acesso foi recebido, <strong className="text-gold">{profile?.full_name}</strong>.
          Um administrador ira rever o seu registo em breve.
        </p>
        <p className="text-text-muted text-xs">
          Esta pagina atualiza automaticamente. Sera redirecionado quando aprovado.
        </p>
        <button
          onClick={signOut}
          className="flex items-center justify-center gap-2 mx-auto text-text-secondary hover:text-danger transition text-sm"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  )
}
