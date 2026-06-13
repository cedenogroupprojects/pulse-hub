export interface Vertical {
  id: string
  name: string
  description: string | null
  leader_name: string | null
  leader_avatar_url: string | null
  manager_name: string | null
  manager_avatar_url: string | null
  tool_url: string | null
  status: 'active' | 'building' | 'coming-soon'
  sort_order: number
  created_at: string
}

export interface LeadershipMember {
  id: string
  name: string
  title: string | null
  avatar_url: string | null
  verticals: string[] | null
  sort_order: number
  created_at: string
}

export interface Quote {
  id: string
  quote: string
  attribution: string | null
  active: boolean
  sort_order: number
  created_at: string
}

export interface ZeroMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export type UserRole = 'admin' | 'leadership' | 'va'
