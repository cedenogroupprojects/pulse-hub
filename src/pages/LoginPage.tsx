import { SignIn } from '@clerk/clerk-react'

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020818',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow orb */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,68,204,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#00aaff',
            textShadow: '0 0 30px rgba(0,170,255,0.7), 0 0 60px rgba(0,170,255,0.3)',
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}
        >
          PULSE
        </div>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.7rem',
            color: '#4a7aa8',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: '0.4rem',
          }}
        >
          Command Center
        </div>
      </div>

      {/* Clerk Sign In — styled via appearance prop */}
      <div style={{ zIndex: 1, width: '100%', maxWidth: '420px' }}>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#00aaff',
              colorBackground: '#060f2e',
              colorInputBackground: '#020818',
              colorInputText: '#e8f4ff',
              colorText: '#e8f4ff',
              colorTextSecondary: '#4a7aa8',
              colorDanger: '#ff3366',
              borderRadius: '4px',
              fontFamily: 'Inter, sans-serif',
            },
            elements: {
              card: {
                background: '#060f2e',
                border: '1px solid #1a3a6e',
                boxShadow: '0 0 24px rgba(0,170,255,0.15), inset 0 0 12px rgba(0,170,255,0.03)',
                borderRadius: '6px',
              },
              headerTitle: {
                fontFamily: 'Orbitron, sans-serif',
                color: '#e8f4ff',
                fontSize: '1rem',
                letterSpacing: '0.05em',
              },
              headerSubtitle: {
                color: '#4a7aa8',
              },
              formButtonPrimary: {
                background: 'rgba(0,170,255,0.15)',
                border: '1px solid #00aaff',
                color: '#00aaff',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                boxShadow: 'none',
                ':hover': {
                  background: 'rgba(0,170,255,0.25)',
                  boxShadow: '0 0 16px rgba(0,170,255,0.4)',
                },
              },
              formFieldInput: {
                background: '#020818',
                border: '1px solid #1a3a6e',
                color: '#e8f4ff',
                borderRadius: '4px',
                ':focus': {
                  border: '1px solid #00aaff',
                  boxShadow: '0 0 12px rgba(0,170,255,0.25)',
                },
              },
              footerActionLink: {
                color: '#00aaff',
              },
              identityPreviewText: {
                color: '#e8f4ff',
              },
              dividerLine: {
                background: '#1a3a6e',
              },
              dividerText: {
                color: '#4a7aa8',
              },
            },
          }}
        />
      </div>

      {/* Bottom label */}
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: '#1a3a6e',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          zIndex: 1,
        }}
      >
        Cedeño Group // Internal Access Only
      </div>
    </div>
  )
}
