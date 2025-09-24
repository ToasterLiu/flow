import type { NextApiRequest, NextApiResponse } from 'next'
import { LLMConfig, getLLMConfig } from '../../../lib/llm-config'

interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface StreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    delta: {
      content?: string
      role?: string
    }
    index: number
    finish_reason: string | null
  }>
}

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

    // 在服务器端，我们只能使用环境变量配置
    const config: LLMConfig = {
      baseUrl: process.env.NEXT_PUBLIC_LLM_API_BASE_URL || '',
      apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY || '',
      modelName: process.env.NEXT_PUBLIC_LLM_MODEL_NAME || 'gpt-3.5-turbo',
      systemPrompt: process.env.NEXT_PUBLIC_LLM_SYSTEM_PROMPT || 'You are a helpful assistant.'
    }
    
    // 验证配置
    if (!config.baseUrl || !config.apiKey || !config.modelName) {
      console.error('LLM configuration is incomplete. Check your .env.local file.')
      return res.status(400).json({ 
        error: 'LLM configuration is incomplete. Please check your .env.local file.' 
      })
    }

    // 构建系统消息
    const systemMessage: LLMMessage = {
      role: 'system',
      content: config.systemPrompt
    }

    const requestBody = {
      model: config.modelName,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    }

    // 检查是否请求流式响应
    const stream = req.query.stream === 'true'
    
    if (stream) {
      requestBody.stream = true
    }

    const apiResponse = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('LLM API error:', apiResponse.status, apiResponse.statusText, errorText)
      return res.status(apiResponse.status).json({ 
        error: `LLM API error: ${apiResponse.statusText}`,
        details: errorText
      })
    }

    if (stream) {
      // 流式响应
      const reader = apiResponse.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                res.end()
                return
              }
              try {
                const chunk: StreamChunk = JSON.parse(data)
                const content = chunk.choices[0]?.delta?.content
                if (content) {
                  res.write(content)
                  if ('flush' in res) {
                    (res as any).flush()
                  }
                }
              } catch (e) {
                // Ignore malformed JSON
              }
            }
          }
        }
        res.end()
      } finally {
        reader!.releaseLock()
      }
    } else {
      // 普通响应
      const data = await apiResponse.json()
      res.status(200).json({
        content: data.choices[0].message.content,
        finish_reason: data.choices[0].finish_reason
      })
    }
  } catch (error) {
    console.error('LLM generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
