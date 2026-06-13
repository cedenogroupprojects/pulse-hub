import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Vertical } from '../types'
import { X } from 'lucide-react'

interface Props {
  vertical: Vertical | null
  onClose: () => void
  onSaved: () => void
}

export default function VerticalFormModal({ vertical, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: vertical?.name ?? '',
    description: vertical?.description ?? '',
    leader_name: vertical?.leader_name ?? '',
    leader_avatar_url: vertical?.leader_avatar_url ?? '',
    manager_name: vertical?.manager_name ?? '',
    manager_avatar_url: vertical?.manager_avatar_url ?? '',
    tool_url: vertical?.tool_url ?? '',
    status: vertical?.status ?? 'building',
  })
  const [saving, setSaving] = useState(false)

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      name: form.name,
      description: form.description || null,
      leader_name: form.leader_name || null,
      leader_avatar_url: form.leader_avatar_url || null,
      manager_name: form.manager_name || null,
      manager_avatar_url: form.manager_avatar_url || null,
      tool_url: form.tool_url || null,
      status: form.status,
    }
    if (vertical && !vertical.id.startsWith('s')) {
      await supabase.from('verticals').update(payload).eq('id', vertical.id)
    } else {
      await supabase.from('verticals').insert({ ...payload, sort_order: 99 })
    }
    setSaving(false)
    onSaved()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(2,8,24,0.85)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card-glow" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
            {vertical ? 'Edit Vertical' : 'Add Vertical'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Field label="Name *"><input className="input-glow" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vertical name" /></Field>
          <Field label="Description"><input className="input-glow" value={form.description} onChange={e => set('description', e.target.value)} placeholder="One-line description" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Leader Name"><input className="input-glow" value={form.leader_name} onChange={e => set('leader_name', e.target.value)} placeholder="Leader" /></Field>
            <Field label="Leader Avatar URL"><input className="input-glow" value={form.leader_avatar_url} onChange={e => set('leader_avatar_url', e.target.value)} placeholder="https://..." /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Manager Name"><input className="input-glow" value={form.manager_name} onChange={e => set('manager_name', e.target.value)} placeholder="Manager" /></Field>
            <Field label="Manager Avatar URL"><input className="input-glow" value={form.manager_avatar_url} onChange={e => set('manager_avatar_url', e.target.value)} placeholder="https://..." /></Field>
          </div>
          <Field label="Tool URL"><input className="input-glow" value={form.tool_url} onChange={e => set('tool_url', e.target.value)} placeholder="https://..." /></Field>
          <Field label="Status">
            <select className="input-glow" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="building">Building</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
          </Field>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'flex-end' }}>
          <button className="btn-glow btn-glow-danger" onClick={onClose}>Cancel</button>
          <button className="btn-glow" onClick={handleSave} disabled={saving || !form.name}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
