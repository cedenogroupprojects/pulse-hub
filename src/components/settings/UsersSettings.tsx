import { useEffect, useState } from 'react'

interface ClerkUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: { emailAddress: string }[]
  publicMetadata: { role?: string }
  imageUrl: string
}

export default function UsersSettings() {
  const [users, setUsers] = useState<ClerkUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users')
        if (!res.ok) throw new Error('Failed to load users')
        const data = await res.json()
        setUsers(data)
      } catch (e) {
        setError('User management requires the /api/users endpoint to be deployed.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const updateRole = async (userId: string, role: string) => {
    setUpdating(userId)
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      })
      setUsers(u => u.map(user => user.id === userId ? { ...user, publicMetadata: { ...user.publicMetadata, role } } : user))
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading users...</div>
  if (error) return <div style={{ color: '#ff3366', fontSize: '0.78rem', lineHeight: 1.6 }}>{error}</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#4a7aa8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        User Access Control
      </div>

      {users.map(user => (
        <div key={user.id} className="card-glow" style={{ padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user.imageUrl && (
              <img src={user.imageUrl} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,170,255,0.3)' }} />
            )}
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#4a7aa8' }}>{user.emailAddresses[0]?.emailAddress}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              className="input-glow"
              style={{ width: 'auto', fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
              value={user.publicMetadata?.role ?? 'va'}
              onChange={e => updateRole(user.id, e.target.value)}
              disabled={updating === user.id}
            >
              <option value="admin">Admin</option>
              <option value="leadership">Leadership</option>
              <option value="va">VA</option>
            </select>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', padding: '2rem' }}>No users found.</div>
      )}
    </div>
  )
}
