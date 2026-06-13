import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { LeadershipMember } from '../../types'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'

const EMPTY = { name: '', title: '', avatar_url: '', verticals: '' }

export default function LeadershipSettings() {
  const [members, setMembers] = useState<LeadershipMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY)
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState(EMPTY)

  const load = async () => {
    const { data } = await supabase.from('leadership_team').select('*').order('sort_order')
    setMembers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toArr = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean)

  const handleAdd = async () => {
    if (!newForm.name.trim()) return
    await supabase.from('leadership_team').insert({
      name: newForm.name, title: newForm.title || null,
      avatar_url: newForm.avatar_url || null, verticals: toArr(newForm.verticals), sort_order: 99,
    })
    setAdding(false); setNewForm(EMPTY); load()
  }

  const startEdit = (m: LeadershipMember) => {
    setEditingId(m.id)
    setEditForm({ name: m.name, title: m.title ?? '', avatar_url: m.avatar_url ?? '', verticals: (m.verticals ?? []).join(', ') })
  }

  const saveEdit = async () => {
    if (!editingId) return
    await supabase.from('leadership_team').update({
      name: editForm.name, title: editForm.title || null,
      avatar_url: editForm.avatar_url || null, verticals: toArr(editForm.verticals),
    }).eq('id', editingId)
    setEditingId(null); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member?')) return
    await supabase.from('leadership_team').delete().eq('id', id)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#4a7aa8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Leadership Team</div>
        <button className="btn-glow" style={{ fontSize: '0.7rem' }} onClick={() => setAdding(true)}><Plus size={12} /> Add Member</button>
      </div>

      {adding && <MemberForm form={newForm} setForm={setNewForm} onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {members.map(m => (
        <div key={m.id} className="card-glow" style={{ padding: '0.9rem 1rem' }}>
          {editingId === m.id ? (
            <MemberForm form={editForm} setForm={setEditForm} onSave={saveEdit} onCancel={() => setEditingId(null)} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{m.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#4a7aa8', marginTop: '0.15rem' }}>{m.title}</div>
                {m.verticals && m.verticals.length > 0 && (
                  <div style={{ fontSize: '0.65rem', color: '#2a5a8e', marginTop: '0.3rem' }}>{m.verticals.join(', ')}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-glow" style={{ padding: '0.3rem 0.5rem' }} onClick={() => startEdit(m)}><Pencil size={11} /></button>
                <button className="btn-glow btn-glow-danger" style={{ padding: '0.3rem 0.5rem' }} onClick={() => handleDelete(m.id)}><Trash2 size={11} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

type FormState = typeof EMPTY
function MemberForm({ form, setForm, onSave, onCancel }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; onSave: () => void; onCancel: () => void }) {
  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="card-glow" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <input className="input-glow" placeholder="Name *" value={form.name} onChange={e => set('name', e.target.value)} />
      <input className="input-glow" placeholder="Title / Role" value={form.title} onChange={e => set('title', e.target.value)} />
      <input className="input-glow" placeholder="Avatar URL" value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} />
      <input className="input-glow" placeholder="Verticals (comma-separated)" value={form.verticals} onChange={e => set('verticals', e.target.value)} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn-glow" onClick={onSave}><Check size={12} /> Save</button>
        <button className="btn-glow btn-glow-danger" onClick={onCancel}><X size={12} /> Cancel</button>
      </div>
    </div>
  )
}
