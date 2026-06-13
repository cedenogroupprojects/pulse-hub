import { useState } from 'react'
import TopNav from '../components/TopNav'
import QuoteBanner from '../components/QuoteBanner'
import VerticalsGrid from '../components/VerticalsGrid'
import LeadershipSection from '../components/LeadershipSection'
import ZeroButton from '../components/zero/ZeroButton'
import ZeroPanel from '../components/zero/ZeroPanel'
import SettingsPanel from '../components/settings/SettingsPanel'
import { useUserRole } from '../hooks/useUserRole'

export default function Dashboard() {
  const role = useUserRole()
  const [zeroOpen, setZeroOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <TopNav onSettingsOpen={() => setSettingsOpen(true)} />

      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <QuoteBanner />
        <VerticalsGrid />
        <LeadershipSection />
      </main>

      {/* ZERO floating button — all roles */}
      <ZeroButton onClick={() => setZeroOpen(true)} />

      {/* ZERO chat panel */}
      <ZeroPanel open={zeroOpen} onClose={() => setZeroOpen(false)} />

      {/* Settings panel — admin only */}
      {role === 'admin' && (
        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}
