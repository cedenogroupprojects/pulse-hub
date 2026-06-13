import { useState } from 'react'
import { X } from 'lucide-react'
import QuotesSettings from './QuotesSettings'
import VerticalsSettings from './VerticalsSettings'
import LeadershipSettings from './LeadershipSettings'
import UsersSettings from './UsersSettings'

interface Props {
  open: boolean
  onClose: () => void
}

const TABS = [
  { id: 'quotes', label: 'Quotes' },
  { id: 'verticals', label: 'Verticals' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'users', label: 'Users' },
]

export default function SettingsPanel({ open, onClose }: Props) {
  const [tab, setTab] = useState('quotes')

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(2,8,24,0.7)', backdropFilter: 'blur(4px)' }} />

      {/* Panel */}
      <div style={{
        width: '680px',
        background: '#060f2e',
        borderLeft: '1px solid #1a3a6e',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(0,170,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(0,68,204,0.06)',
        }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', color: 'var(--text-primary)', letterSpacing: '0.08em' }}>Settings</div>
            <div style={{ fontSize: '0.62rem', color: '#4a7aa8', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Access</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a7aa8', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff3366')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a7aa8')}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(26,58,110,0.5)', padding: '0 1.75rem' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.85rem 1rem',
                fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 500,
                color: tab === t.id ? '#00aaff' : '#4a7aa8',
                borderBottom: tab === t.id ? '2px solid #00aaff' : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
          {tab === 'quotes' && <QuotesSettings />}
          {tab === 'verticals' && <VerticalsSettings />}
          {tab === 'leadership' && <LeadershipSettings />}
          {tab === 'users' && <UsersSettings />}
        </div>
      </div>
    </div>
  )
}
