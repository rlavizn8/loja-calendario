import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { UserPlus } from 'lucide-react'

export function RegisterForm() {
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signUp(email, password, fullName)
    if (error) {
      setError(error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
          <UserPlus size={28} className="text-success" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">Registo efetuado!</h3>
        <p className="text-text-secondary text-sm">
          A sua conta foi criada com sucesso. Aguarde a aprovacao do administrador para aceder ao calendario.
        </p>
        <Link to="/login" className="inline-block text-gold hover:text-gold-light transition text-sm">
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Nome completo</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
          placeholder="O seu nome"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
          placeholder="seu@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Palavra-passe</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
          placeholder="Minimo 6 caracteres"
        />
      </div>
      {error && (
        <p className="text-danger text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gold hover:bg-gold-light text-bg-primary font-semibold rounded-lg transition disabled:opacity-50"
      >
        <UserPlus size={18} />
        {loading ? 'A registar...' : 'Criar Conta'}
      </button>
      <p className="text-center text-text-secondary text-sm">
        Ja tem conta?{' '}
        <Link to="/login" className="text-gold hover:text-gold-light transition">
          Entrar
        </Link>
      </p>
    </form>
  )
}
