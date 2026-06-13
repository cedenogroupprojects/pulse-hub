import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { LeadershipMember } from '../types'

const SEED_LEADERSHIP: LeadershipMember[] = [
  { id: 'l1', name: 'Jeffry Giordano', title: 'COO / Team Leader', avatar_url: null, verticals: ['All Verticals'], sort_order: 0, created_at: '' },
  { id: 'l2', name: 'Robert Cedeño', title: 'CEO', avatar_url: null, verticals: ['Real Estate Team', 'Coaching'], sort_order: 1, created_at: '' },
  { id: 'l3', name: 'Alex Tait', title: 'Director of Operations', avatar_url: null, verticals: ['Agent Coaching', 'Onboarding'], sort_order: 2, created_at: '' },
  { id: 'l4', name: 'Reyes Abalos', title: 'Marketing & Sales Director', avatar_url: null, verticals: ['Ads & VA Services', 'Content'], sort_order: 3, created_at: '' },
]

function MemberCard({ member, idx }: { member: LeadershipMember; idx: number }) {
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div
      className="card-glow animate-fade-up"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        textAlign: 'center',
        minWidth: '200px',
        animationDelay: `${idx * 80}ms`,
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative' }}>
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: '2px solid rgba(0,170,255,0.5)',
              boxShadow: '0 0 16px rgba(0,170,255,0.25)',
            }}
          />
        ) : (
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,68,204,0.4), rgba(0,170,255,0.1))',
            border: '2px solid rgba(0,170,255,0.4)',
            boxShadow: '0 0 16px rgba(0,170,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', color: '#00aaff', fontWeight: 700,
          }}>
            {initials}
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.03em' }}>
          {member.name}
        </div>
        {member.title && (
          <div style={{ fontSize: '0.7rem', color: '#4a7aa8', marginTop: '0.2rem' }}>
            {member.title}
          </div>
        )}
      </div>

      {/* Vertical tags */}
      {member.verticals && member.verticals.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center' }}>
          {member.verticals.map(v => (
            <span key={v} style={{
              fontSize: '0.58rem', fontFamily: 'JetBrains Mono', color: '#4a7aa8',
              background: 'rgba(26,58,110,0.3)', border: '1px solid rgba(26,58,110,0.5)',
              borderRadius: '2px', padding: '0.15rem 0.4rem', letterSpacing: '0.06em',
            }}>
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeadershipSection() {
  const [members, setMembers] = useState<LeadershipMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase.from('leadership_team').select('*').order('sort_order')
      setMembers(data && data.length > 0 ? data : SEED_LEADERSHIP)
      setLoading(false)
    }
    fetchMembers()
  }, [])

  if (loading) return null

  return (
    <section style={{ padding: '0 2rem 2.5rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', color: '#4a7aa8', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Leadership Team
        </h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #00aaff, transparent)' }} />
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {members.map((m, i) => <MemberCard key={m.id} member={m} idx={i} />)}
      </div>
    </section>
  )
}
