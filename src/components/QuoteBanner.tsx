import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Quote } from '../types'

const SEED_QUOTES: Quote[] = [
  { id: '1', quote: "You don't rise to the level of your goals. You fall to the level of your systems.", attribution: 'James Clear', active: true, sort_order: 0, created_at: '' },
  { id: '2', quote: "The scoreboard doesn't lie. Build the machine, then let it run.", attribution: 'Jeffry Giordano', active: true, sort_order: 1, created_at: '' },
  { id: '3', quote: 'Leadership is not about being in charge. It is about taking care of those in your charge.', attribution: 'Simon Sinek', active: true, sort_order: 2, created_at: '' },
  { id: '4', quote: 'Speed is irrelevant if you are going in the wrong direction.', attribution: 'Mahatma Gandhi', active: true, sort_order: 3, created_at: '' },
  { id: '5', quote: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', attribution: 'Aristotle', active: true, sort_order: 4, created_at: '' },
  { id: '6', quote: "Don't watch the clock; do what it does. Keep going.", attribution: 'Sam Levenson', active: true, sort_order: 5, created_at: '' },
  { id: '7', quote: 'A small team of A+ players can run circles around a giant team of B and C players.', attribution: 'Steve Jobs', active: true, sort_order: 6, created_at: '' },
]

export default function QuoteBanner() {
  const [quotes, setQuotes] = useState<Quote[]>(SEED_QUOTES)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .eq('active', true)
        .order('sort_order')
      if (data && data.length > 0) setQuotes(data)
    }
    fetchQuotes()
  }, [])

  // Build ticker items — duplicate for seamless loop
  const items = [...quotes, ...quotes]

  return (
    <div
      style={{
        width: '100%',
        height: '36px',
        background: 'rgba(0, 8, 32, 0.95)',
        borderBottom: '1px solid rgba(0,170,255,0.2)',
        borderTop: '1px solid rgba(0,170,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Left fade */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
        background: 'linear-gradient(90deg, rgba(0,8,32,1) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Right fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
        background: 'linear-gradient(270deg, rgba(0,8,32,1) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          animation: 'ticker-scroll 60s linear infinite',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {items.map((q, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
            {/* Separator diamond */}
            <span style={{
              color: '#00aaff',
              fontSize: '0.5rem',
              margin: '0 1.5rem',
              opacity: 0.6,
            }}>◆</span>
            {/* Quote */}
            <span style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 500,
              color: '#00aaff',
              letterSpacing: '0.06em',
              textShadow: '0 0 12px rgba(0,170,255,0.4)',
            }}>
              {q.quote}
            </span>
            {/* Attribution */}
            {q.attribution && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.58rem',
                color: '#2a5a8e',
                marginLeft: '0.75rem',
                letterSpacing: '0.08em',
              }}>
                — {q.attribution}
              </span>
            )}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ticker-scroll {
            0%, 100% { transform: translateX(0); }
          }
        }
      `}</style>
    </div>
  )
}
