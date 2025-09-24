import type { NextApiRequest, NextApiResponse } from 'next'
import { LLMClient, LLMMessage } from '../../../lib/llm-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 允许流式响应
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body as { messages: LLMMessage[] }
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    const client = new LLMClient()
    
    // 检查是否请求流式响应
    const stream = req.query.stream === 'true'
    
    if (stream) {
      // 流式响应
      for await (const chunk of client.stream(messages)) {
        res.write(chunk)
        // 确保数据立即发送
        if ('flush' in res) {
          (res as any).flush()
        }
      }
      res.end()
    } else {
      // 普通响应
      const response = await client.generate(messages)
      res.status(200).json(response)
    }
  } catch (error) {
    console.error('LLM generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
