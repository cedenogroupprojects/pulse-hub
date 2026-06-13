import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Quote } from '../../types'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'

export default function QuotesSettings() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ quote: '', attribution: '' })
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState({ quote: '', attribution: '' })

  const load = async () => {
    const { data } = await supabase.from('quotes').select('*').order('sort_order')
    setQuotes(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete quote?')) return
    await supabase.from('quotes').delete().eq('id', id)
    load()
  }

  const startEdit = (q: Quote) => {
    setEditingId(q.id)
    setEditForm({ quote: q.quote, attribution: q.attribution ?? '' })
  }

  const saveEdit = async () => {
    if (!editingId) return
    await supabase.from('quotes').update({ quote: editForm.quote, attribution: editForm.attribution || null }).eq('id', editingId)
    setEditingId(null)
    load()
  }

  const handleAdd = async () => {
    if (!newForm.quote.trim()) return
    await supabase.from('quotes').insert({ quote: newForm.quote, attribution: newForm.attribution || null, active: true, sort_order: 99 })
    setAdding(false)
    setNewForm({ quote: '', attribution: '' })
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionLabel>Rotating Banner Quotes</SectionLabel>
        <button className="btn-glow" onClick={() => setAdding(true)} style={{ fontSize: '0.7rem' }}>
          <Plus size={12} /> Add Quote
        </button>
      </div>

      {adding && (
        <div className="card-glow" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <textarea className="input-glow" value={newForm.quote} onChange={e => setNewForm(f => ({ ...f, quote: e.target.value }))} placeholder="Quote text..." rows={3} style={{ resize: 'vertical', fontFamily: 'Inter', fontSize: '0.82rem' }} />
          <input className="input-glow" value={newForm.attribution} onChange={e => setNewForm(f => ({ ...f, attribution: e.target.value }))} placeholder="Attribution (optional)" />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-glow" onClick={handleAdd}><Check size={12} /> Save</button>
            <button className="btn-glow btn-glow-danger" onClick={() => setAdding(false)}><X size={12} /> Cancel</button>
          </div>
        </div>
      )}

      {quotes.map(q => (
        <div key={q.id} className="card-glow" style={{ padding: '1rem' }}>
          {editingId === q.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <textarea className="input-glow" value={editForm.quote} onChange={e => setEditForm(f => ({ ...f, quote: e.target.value }))} rows={3} style={{ resize: 'vertical', fontFamily: 'Inter', fontSize: '0.82rem' }} />
              <input className="input-glow" value={editForm.attribution} onChange={e => setEditForm(f => ({ ...f, attribution: e.target.value }))} placeholder="Attribution" />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-glow" onClick={saveEdit}><Check size={12} /> Save</button>
                <button className="btn-glow btn-glow-danger" onClick={() => setEditingId(null)}><X size={12} /> Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>"{q.quote}"</p>
                {q.attribution && <p style={{ fontSize: '0.72rem', color: '#4a7aa8', marginTop: '0.3rem' }}>— {q.attribution}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                <button className="btn-glow" style={{ padding: '0.3rem 0.5rem' }} onClick={() => startEdit(q)}><Pencil size={11} /></button>
                <button className="btn-glow btn-glow-danger" style={{ padding: '0.3rem 0.5rem' }} onClick={() => handleDelete(q.id)}><Trash2 size={11} /></button>
              </div>
            </div>
          )}
        </div>
      ))}

      {quotes.length === 0 && !adding && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', padding: '2rem' }}>
          No quotes yet. Add one to populate the banner.
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#4a7aa8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{children}</div>
}
