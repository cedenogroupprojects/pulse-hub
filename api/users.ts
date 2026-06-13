import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const response = await clerk.users.getUserList({ limit: 100 })
      return res.status(200).json(response.data)
    } catch (error) {
      console.error('Users GET error:', error)
      return res.status(500).json({ error: 'Failed to fetch users' })
    }
  }

  if (req.method === 'PATCH') {
    const { userId, role } = req.body
    if (!userId || !role) return res.status(400).json({ error: 'userId and role required' })
    try {
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { role },
      })
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Users PATCH error:', error)
      return res.status(500).json({ error: 'Failed to update role' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
