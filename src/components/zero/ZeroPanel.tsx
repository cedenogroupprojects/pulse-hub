import { useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../../lib/supabase'
import type { ZeroMessage } from '../../types'
import { X, Send } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.75rem 1rem' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#00aaff',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}

export default function ZeroPanel({ open, onClose }: Props) {
  const { user } = useUser()
  const [messages, setMessages] = useState<ZeroMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !user) return
    const fetchHistory = async () => {
      const { data } = await supabase
        .from('zero_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at')
        .limit(50)
      if (data) setMessages(data)
    }
    fetchHistory()
  }, [open, user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = async () => {
    if (!input.trim() || loading || !user) return
    const userMsg: ZeroMessage = {
      id: crypto.randomUUID(),
      user_id: user.id,
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages(m => [...m, userMsg])
    setInput('')
    setThinking(true)
    setLoading(true)

    // Persist user message
    await supabase.from('zero_messages').insert({
      user_id: user.id, role: 'user', content: userMsg.content,
    })

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/zero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()
      const reply = data.content ?? data.error ?? 'No response'

      const assistantMsg: ZeroMessage = {
        id: crypto.randomUUID(),
        user_id: user.id,
        role: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
      }
      setMessages(m => [...m, assistantMsg])
      await supabase.from('zero_messages').insert({
        user_id: user.id, role: 'assistant', content: reply,
      })
    } catch {
      setMessages(m => [...m, {
        id: crypto.randomUUID(), user_id: user.id, role: 'assistant',
        content: 'System error. Check the API connection.', created_at: new Date().toISOString(),
      }])
    } finally {
      setThinking(false)
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(2,8,24,0.4)' }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '420px',
          height: '100vh',
          background: '#060f2e',
          borderLeft: '1px solid #1a3a6e',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
          zIndex: 195,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Panel header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0,170,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(0,68,204,0.08)',
        }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', color: '#00aaff', textShadow: '0 0 16px rgba(0,170,255,0.5)', letterSpacing: '0.1em' }}>
              ZERO
            </div>
            <div style={{ fontSize: '0.62rem', color: '#4a7aa8', fontFamily: 'JetBrains Mono', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              AI Command Brain
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#4a7aa8', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff3366')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a7aa8')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#4a7aa8' }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>ZERO ONLINE</div>
              <div style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>Ask me anything about the operation.<br />I see the whole machine.</div>
            </div>
          )}
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '0.7rem 1rem',
                borderRadius: '4px',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                fontFamily: 'Inter, sans-serif',
                ...(msg.role === 'user'
                  ? { background: 'rgba(0,68,204,0.3)', border: '1px solid rgba(0,170,255,0.25)', color: 'var(--text-primary)', borderBottomRightRadius: '1px' }
                  : { background: 'rgba(6,15,46,0.8)', border: '1px solid rgba(26,58,110,0.6)', color: '#c8dff0', borderBottomLeftRadius: '1px' }
                ),
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(6,15,46,0.8)', border: '1px solid rgba(26,58,110,0.6)', borderRadius: '4px 4px 4px 1px' }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(0,170,255,0.1)',
          display: 'flex', gap: '0.75rem', alignItems: 'flex-end',
        }}>
          <textarea
            className="input-glow"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask ZERO..."
            rows={2}
            style={{ resize: 'none', flex: 1, fontFamily: 'Inter', fontSize: '0.82rem', lineHeight: 1.5 }}
          />
          <button
            className="btn-glow"
            onClick={send}
            disabled={loading || !input.trim()}
            style={{ padding: '0.6rem 0.9rem', flexShrink: 0, opacity: loading || !input.trim() ? 0.5 : 1 }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  )
}
