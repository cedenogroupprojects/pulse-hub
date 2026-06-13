import { useUser } from '@clerk/clerk-react'
import type { UserRole } from '../types'

export function useUserRole(): UserRole | null {
  const { user } = useUser()
  if (!user) return null
  return (user.publicMetadata?.role as UserRole) ?? null
}
