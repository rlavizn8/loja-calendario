import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LogIn } from 'lucide-react'

export function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) setError(error)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
          placeholder="••••••••"
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
        <LogIn size={18} />
        {loading ? 'A entrar...' : 'Entrar'}
      </button>
      <p className="text-center text-text-secondary text-sm">
        Ainda nao tem conta?{' '}
        <Link to="/registrar" className="text-gold hover:text-gold-light transition">
          Registar
        </Link>
      </p>
    </form>
  )
}
