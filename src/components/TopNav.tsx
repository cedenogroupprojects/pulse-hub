import { useUser, useClerk } from '@clerk/clerk-react'
import { Settings, LogOut } from 'lucide-react'
import { useUserRole } from '../hooks/useUserRole'

interface TopNavProps {
  onSettingsOpen: () => void
}

export default function TopNav({ onSettingsOpen }: TopNavProps) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const role = useUserRole()

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-base)',
        borderBottom: '1px solid rgba(0,170,255,0.2)',
        padding: '0 2rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#00aaff',
            textShadow: '0 0 20px rgba(0,170,255,0.6)',
            letterSpacing: '0.08em',
          }}
        >
          PULSE
        </span>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.55rem',
            color: '#4a7aa8',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          Command Center
        </span>
      </div>

      {/* Right: User info + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.fullName ?? ''}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(0,170,255,0.4)',
                boxShadow: '0 0 8px rgba(0,170,255,0.2)',
              }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              {user?.fullName ?? user?.emailAddresses[0]?.emailAddress}
            </span>
            {role && (
              <span
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#00aaff',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Settings (admin only) */}
        {role === 'admin' && (
          <button
            onClick={onSettingsOpen}
            title="Settings"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#00aaff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Settings size={17} />
          </button>
        )}

        {/* Sign out */}
        <button
          onClick={() => signOut()}
          title="Sign out"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff3366')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut size={17} />
        </button>
      </div>
    </nav>
  )
}
