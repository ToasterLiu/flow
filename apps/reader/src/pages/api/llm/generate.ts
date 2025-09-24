import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

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

    // 在服务器端，我们只能使用环境变量配置
    const baseUrl = process.env.NEXT_PUBLIC_LLM_API_BASE_URL || ''
    const apiKey = process.env.NEXT_PUBLIC_LLM_API_KEY || ''
    const modelName = process.env.NEXT_PUBLIC_LLM_MODEL_NAME || 'gpt-3.5-turbo'
    const systemPrompt = process.env.NEXT_PUBLIC_LLM_SYSTEM_PROMPT || 'You are a helpful assistant.'
    
    // 验证配置 - 只检查必需的字段
    if (!baseUrl || !apiKey) {
      console.error('LLM configuration is incomplete. Check your .env.local file.')
      console.error('baseUrl:', baseUrl)
      console.error('apiKey:', apiKey ? '***' : 'missing')
      return res.status(400).json({ 
        error: 'LLM configuration is incomplete. Please check your .env.local file.' 
      })
    }

    // 创建OpenAI客户端
    const openai = new OpenAI({
      baseURL: baseUrl,
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // 允许在浏览器环境中使用（仅用于API路由）
    })

    // 检查是否请求流式响应
    const stream = req.query.stream === 'true'
    
    if (stream) {
      // 流式响应需要不同的Content-Type
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
    }

    // 构建系统消息
    const systemMessage: LLMMessage = {
      role: 'system',
      content: systemPrompt
    }

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
      stream: stream
    })

    if (stream) {
      // 流式响应
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          res.write(content)
          if ('flush' in res) {
            (res as any).flush()
          }
        }
      }
      res.end()
    } else {
      // 普通响应
      const content = completion.choices[0].message.content || ''
      const finish_reason = completion.choices[0].finish_reason || 'stop'
      res.status(200).json({
        content,
        finish_reason
      })
    }
  } catch (error) {
    console.error('LLM generation error:', error)
    if (error instanceof Error) {
      res.status(500).json({ 
        error: 'Failed to generate response',
        details: error.message
      })
    } else {
      res.status(500).json({ 
        error: 'Failed to generate response',
        details: 'Unknown error'
      })
    }
  }
}
