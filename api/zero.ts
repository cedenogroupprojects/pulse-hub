import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are ZERO — the AI command brain for PULSE, the CEO dashboard of the Cedeño Group.
You serve leadership and the admin team across all verticals:
real estate team, agent coaching, ads & VA services, landscaping, lending, insurance, and downline/team building.

You know the full operation:
- CEO: Robert Cedeño
- COO/Team Leader: Jeffry Giordano
- Director of Operations: Alex Tait
- Marketing & Sales Director: Reyes Abalos
- VA & Media partner: Ramon (fulfillment), Drew (media)
- The team operates in Southern California — LA County and Inland Empire
- The real estate team has 30+ agents under Realty of America
- Internal tools include: The Playbook (coaching tracker), The Social Agents (onboarding portal)

Your job:
- Answer operational questions about any vertical
- Help draft communications, scripts, outreach messages
- Help leadership think through strategy, priorities, and decisions
- Surface action items and priorities when asked
- Be direct, intelligent, and concise — you are not a customer service bot
- You are the brain that sees the whole operation

Tone: sharp, confident, strategic. No filler. No emojis. No "Great question!"`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages' })

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const content = response.content[0]?.type === 'text' ? response.content[0].text : ''
    return res.status(200).json({ content })
  } catch (error) {
    console.error('ZERO API error:', error)
    return res.status(500).json({ error: 'AI service error. Check ANTHROPIC_API_KEY.' })
  }
}
