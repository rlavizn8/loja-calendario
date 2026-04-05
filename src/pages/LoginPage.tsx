import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <img src="/logo-aviz.jpeg" alt="R∴L∴ Aviz Nº8" className="h-28 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-gold">R∴L∴ Aviz Nº8</h1>
            <p className="text-text-secondary text-sm mt-1">Calendario de Sessoes e Eventos</p>
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <LoginForm />
        </div>
        <div className="flex justify-center">
          <img src="/logo-glsp.jpeg" alt="Grande Loja Soberana de Portugal" className="h-10 opacity-60" />
        </div>
      </div>
    </div>
  )
}
