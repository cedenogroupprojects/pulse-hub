import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Vertical } from '../../types'
import { Trash2, Pencil } from 'lucide-react'
import VerticalFormModal from '../VerticalFormModal'

export default function VerticalsSettings() {
  const [verticals, setVerticals] = useState<Vertical[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Vertical | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('verticals').select('*').order('sort_order')
    setVerticals(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vertical?')) return
    await supabase.from('verticals').delete().eq('id', id)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#4a7aa8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        Manage Verticals
      </div>

      {verticals.map(v => (
        <div key={v.id} className="card-glow" style={{ padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{v.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#4a7aa8', marginTop: '0.15rem' }}>{v.description}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            <button className="btn-glow" style={{ padding: '0.3rem 0.5rem' }} onClick={() => { setEditing(v); setModalOpen(true) }}><Pencil size={11} /></button>
            <button className="btn-glow btn-glow-danger" style={{ padding: '0.3rem 0.5rem' }} onClick={() => handleDelete(v.id)}><Trash2 size={11} /></button>
          </div>
        </div>
      ))}

      {verticals.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', padding: '2rem' }}>No verticals yet.</div>
      )}

      {modalOpen && (
        <VerticalFormModal vertical={editing} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); load() }} />
      )}
    </div>
  )
}
