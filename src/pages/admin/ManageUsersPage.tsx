import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { UserCheck, UserX, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useUsers } from '../../hooks/useUsers'
import { approveUser, rejectUser } from '../../lib/profiles'

export function ManageUsersPage() {
  const { users, loading, refetch } = useUsers()

  const pendingUsers = users.filter(u => !u.approved)
  const approvedUsers = users.filter(u => u.approved)

  const handleApprove = async (userId: string, name: string) => {
    await approveUser(userId)
    toast.success(`${name} aprovado`)
    refetch()
  }

  const handleReject = async (userId: string, name: string) => {
    if (!confirm(`Tem a certeza que deseja rejeitar ${name}?`)) return
    await rejectUser(userId)
    toast.success(`${name} rejeitado`)
    refetch()
  }

  if (loading) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-text-primary">Gestao de Membros</h2>

      {pendingUsers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gold flex items-center gap-2">
            <Shield size={16} />
            Pendentes de Aprovacao ({pendingUsers.length})
          </h3>
          <div className="bg-bg-card border border-gold/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-secondary">
                    <th className="text-left px-4 py-3 text-text-secondary font-medium">Nome</th>
                    <th className="text-left px-4 py-3 text-text-secondary font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-text-secondary font-medium">Data Registo</th>
                    <th className="text-right px-4 py-3 text-text-secondary font-medium">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map(u => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-text-primary font-medium">{u.full_name}</td>
                      <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {format(new Date(u.created_at), "d MMM yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(u.id, u.full_name)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-success/20 text-success rounded-lg hover:bg-success/30 transition text-xs font-medium"
                          >
                            <UserCheck size={14} />
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleReject(u.id, u.full_name)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-danger/20 text-danger rounded-lg hover:bg-danger/30 transition text-xs font-medium"
                          >
                            <UserX size={14} />
                            Rejeitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-secondary">
          Membros Aprovados ({approvedUsers.length})
        </h3>
        {approvedUsers.length === 0 ? (
          <div className="bg-bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-text-muted text-sm">Nenhum membro aprovado.</p>
          </div>
        ) : (
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-secondary">
                    <th className="text-left px-4 py-3 text-text-secondary font-medium">Nome</th>
                    <th className="text-left px-4 py-3 text-text-secondary font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-text-secondary font-medium">Role</th>
                    <th className="text-left px-4 py-3 text-text-secondary font-medium">Data Registo</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedUsers.map(u => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-text-primary font-medium">{u.full_name}</td>
                      <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          u.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-bg-input text-text-secondary'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : 'Membro'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {format(new Date(u.created_at), "d MMM yyyy", { locale: ptBR })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
