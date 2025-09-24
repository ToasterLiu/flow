import type { NextApiRequest, NextApiResponse } from 'next'
import { LLMClient, LLMMessage } from '../../../lib/llm-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body as { messages: LLMMessage[] }
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    const client = new LLMClient()
    const response = await client.generate(messages)
    
    res.status(200).json(response)
  } catch (error) {
    console.error('LLM generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
