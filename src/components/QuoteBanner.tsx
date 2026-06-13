import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Quote } from '../types'

const SEED_QUOTES: Quote[] = [
  { id: '1', quote: "You don't rise to the level of your goals. You fall to the level of your systems.", attribution: 'James Clear', active: true, sort_order: 0, created_at: '' },
  { id: '2', quote: 'The scoreboard doesn\'t lie. Build the machine, then let it run.', attribution: 'Jeffry Giordano', active: true, sort_order: 1, created_at: '' },
  { id: '3', quote: 'Leadership is not about being in charge. It is about taking care of those in your charge.', attribution: 'Simon Sinek', active: true, sort_order: 2, created_at: '' },
  { id: '4', quote: 'Speed is irrelevant if you are going in the wrong direction.', attribution: 'Mahatma Gandhi', active: true, sort_order: 3, created_at: '' },
  { id: '5', quote: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', attribution: 'Aristotle', active: true, sort_order: 4, created_at: '' },
  { id: '6', quote: "Don't watch the clock; do what it does. Keep going.", attribution: 'Sam Levenson', active: true, sort_order: 5, created_at: '' },
  { id: '7', quote: 'A small team of A+ players can run circles around a giant team of B and C players.', attribution: 'Steve Jobs', active: true, sort_order: 6, created_at: '' },
]

export default function QuoteBanner() {
  const [quotes, setQuotes] = useState<Quote[]>(SEED_QUOTES)
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

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

  useEffect(() => {
    if (quotes.length <= 1) return
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrent(c => (c + 1) % quotes.length)
        setFade(true)
      }, 500)
    }, 6000)
    return () => clearInterval(interval)
  }, [quotes.length])

  const q = quotes[current]
  if (!q) return null

  return (
    <div
      style={{
        width: '100%',
        padding: '2rem 3rem',
        background: 'linear-gradient(180deg, rgba(0,68,204,0.06) 0%, rgba(2,8,24,0) 100%)',
        borderBottom: '1px solid rgba(0,170,255,0.08)',
        textAlign: 'center',
        minHeight: '110px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Particle-like background dots */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,68,204,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          transition: 'opacity 0.5s ease',
          opacity: fade ? 1 : 0,
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            color: '#00aaff',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
            maxWidth: '800px',
            margin: '0 auto',
            textShadow: '0 0 20px rgba(0,170,255,0.3)',
          }}
        >
          "{q.quote}"
        </p>
        {q.attribution && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#4a7aa8',
              marginTop: '0.6rem',
              letterSpacing: '0.08em',
            }}
          >
            — {q.attribution}
          </p>
        )}
      </div>

      {/* Dots indicator */}
      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', zIndex: 1 }}>
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true) }, 300) }}
            style={{
              width: i === current ? '16px' : '6px',
              height: '3px',
              borderRadius: '2px',
              background: i === current ? '#00aaff' : '#1a3a6e',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
