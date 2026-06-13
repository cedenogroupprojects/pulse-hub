import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Vertical } from '../types'
import { useUserRole } from '../hooks/useUserRole'
import { ExternalLink, Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import VerticalFormModal from './VerticalFormModal'

const SEED_VERTICALS: Vertical[] = [
  { id: 's1', name: 'Ads & VA Services', description: 'White-label VA placement and media services for agents', leader_name: 'Reyes Abalos', leader_avatar_url: null, manager_name: 'Ramon', manager_avatar_url: null, tool_url: null, status: 'active', sort_order: 0, created_at: '' },
  { id: 's2', name: 'Landscaping', description: 'Landscaping vertical business', leader_name: 'Jeffry Giordano', leader_avatar_url: null, manager_name: 'Jeffry Giordano', manager_avatar_url: null, tool_url: null, status: 'building', sort_order: 1, created_at: '' },
  { id: 's3', name: 'Lending', description: 'Mortgage and lending services', leader_name: 'Robert Cedeño', leader_avatar_url: null, manager_name: 'Robert Cedeño', manager_avatar_url: null, tool_url: null, status: 'active', sort_order: 2, created_at: '' },
  { id: 's4', name: 'Insurance', description: 'Life and health insurance, GFI downline', leader_name: 'Robert Cedeño', leader_avatar_url: null, manager_name: 'Robert Cedeño', manager_avatar_url: null, tool_url: null, status: 'active', sort_order: 3, created_at: '' },
  { id: 's5', name: 'Agent Coaching', description: 'Coaching program for real estate agents', leader_name: 'Alex Tait', leader_avatar_url: null, manager_name: 'Alex Tait', manager_avatar_url: null, tool_url: null, status: 'active', sort_order: 4, created_at: '' },
  { id: 's6', name: 'Downline / Team Building', description: 'Recruiting and team growth across verticals', leader_name: 'Jeffry Giordano', leader_avatar_url: null, manager_name: 'Jeffry Giordano', manager_avatar_url: null, tool_url: null, status: 'building', sort_order: 5, created_at: '' },
]

function StatusBadge({ status }: { status: Vertical['status'] }) {
  const cls = status === 'active' ? 'badge-active' : status === 'building' ? 'badge-building' : 'badge-coming-soon'
  const label = status === 'coming-soon' ? 'Coming Soon' : status.charAt(0).toUpperCase() + status.slice(1)
  return <span className={cls}>{label}</span>
}

function Avatar({ name, url }: { name: string | null; url: string | null }) {
  if (url) return (
    <img src={url} alt={name ?? ''} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(0,170,255,0.3)' }} />
  )
  const initials = (name ?? '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: 'rgba(0,68,204,0.3)', border: '1px solid rgba(0,170,255,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#00aaff', fontWeight: 600,
    }}>{initials}</div>
  )
}

export default function VerticalsGrid() {
  const role = useUserRole()
  const isAdmin = role === 'admin'
  const [verticals, setVerticals] = useState<Vertical[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Vertical | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase.from('verticals').select('*').order('sort_order')
    setVerticals(data && data.length > 0 ? data : SEED_VERTICALS)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vertical?')) return
    if (id.startsWith('s')) {
      setVerticals(v => v.filter(x => x.id !== id))
      return
    }
    await supabase.from('verticals').delete().eq('id', id)
    load()
  }

  const handleDragStart = (id: string) => setDragging(id)
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOver(id) }

  const handleDrop = async (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return }
    const arr = [...verticals]
    const fromIdx = arr.findIndex(v => v.id === dragging)
    const toIdx = arr.findIndex(v => v.id === targetId)
    const [item] = arr.splice(fromIdx, 1)
    arr.splice(toIdx, 0, item)
    const updated = arr.map((v, i) => ({ ...v, sort_order: i }))
    setVerticals(updated)
    setDragging(null)
    setDragOver(null)
    // Persist order for non-seed items
    const dbItems = updated.filter(v => !v.id.startsWith('s'))
    for (const v of dbItems) {
      await supabase.from('verticals').update({ sort_order: v.sort_order }).eq('id', v.id)
    }
  }

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
      Loading verticals...
    </div>
  )

  return (
    <section style={{ padding: '2.5rem 2rem' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', color: '#4a7aa8', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Business Verticals
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #00aaff, transparent)' }} />
        </div>
        {isAdmin && (
          <button
            className="btn-glow"
            onClick={() => { setEditing(null); setModalOpen(true) }}
          >
            <Plus size={14} /> Add Vertical
          </button>
        )}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {verticals.map((v, idx) => (
          <div
            key={v.id}
            draggable={isAdmin}
            onDragStart={() => handleDragStart(v.id)}
            onDragOver={e => handleDragOver(e, v.id)}
            onDrop={() => handleDrop(v.id)}
            onDragEnd={() => { setDragging(null); setDragOver(null) }}
            className="card-glow animate-fade-up"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              cursor: isAdmin ? 'grab' : 'default',
              animationDelay: `${idx * 80}ms`,
              opacity: dragOver === v.id ? 0.6 : 1,
              outline: dragOver === v.id ? '1px dashed rgba(0,170,255,0.4)' : 'none',
            }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  {isAdmin && <GripVertical size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                  <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                    {v.name}
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{v.description}</p>
              </div>
              <StatusBadge status={v.status} />
            </div>

            {/* People */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {v.leader_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Avatar name={v.leader_name} url={v.leader_avatar_url} />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-primary)', fontWeight: 500 }}>{v.leader_name}</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: '0.4rem', fontFamily: 'JetBrains Mono' }}>Leader</span>
                  </div>
                </div>
              )}
              {v.manager_name && v.manager_name !== v.leader_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Avatar name={v.manager_name} url={v.manager_avatar_url} />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-primary)', fontWeight: 500 }}>{v.manager_name}</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: '0.4rem', fontFamily: 'JetBrains Mono' }}>Manager</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(26,58,110,0.5)' }}>
              {v.tool_url ? (
                <a
                  href={v.tool_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={12} /> Launch Tool
                </a>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>No tool linked</span>
              )}

              {isAdmin && (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn-glow"
                    style={{ padding: '0.35rem 0.6rem' }}
                    onClick={() => { setEditing(v); setModalOpen(true) }}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    className="btn-glow btn-glow-danger"
                    style={{ padding: '0.35rem 0.6rem' }}
                    onClick={() => handleDelete(v.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <VerticalFormModal
          vertical={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); load() }}
        />
      )}
    </section>
  )
}
