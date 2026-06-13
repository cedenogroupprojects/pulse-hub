interface Props {
  onClick: () => void
}

export default function ZeroButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="pulse-glow"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(0,68,204,0.6), rgba(0,170,255,0.2))',
        border: '1px solid #00aaff',
        color: '#00aaff',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        cursor: 'pointer',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      title="Open ZERO — AI Command Brain"
    >
      ZERO
    </button>
  )
}
