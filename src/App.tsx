import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {
  if (!clerkPubKey) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: 'Orbitron, sans-serif',
        color: '#00aaff',
        background: '#020818',
      }}>
        <div style={{ fontSize: '2rem', textShadow: '0 0 20px rgba(0,170,255,0.6)' }}>PULSE</div>
        <div style={{ fontFamily: 'Inter, sans-serif', color: '#4a7aa8', fontSize: '0.85rem' }}>
          Add VITE_CLERK_PUBLISHABLE_KEY to .env.local to initialize
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </ClerkProvider>
  )
}

export default App
