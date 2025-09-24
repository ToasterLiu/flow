import { getLLMConfig } from './llm-config'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  finish_reason: string
}

export interface StreamChunk {
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

export class LLMClient {
  async generate(messages: LLMMessage[]): Promise<LLMResponse> {
    // 每次调用时都获取最新配置
    const config = getLLMConfig()
    
    const systemMessage: LLMMessage = {
      role: 'system',
      content: config.systemPrompt
    }

    const requestBody = {
      model: config.modelName,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000
    }

    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // 假设是OpenAI兼容的API格式
    return {
      content: data.choices[0].message.content,
      finish_reason: data.choices[0].finish_reason
    }
  }

  async* stream(messages: LLMMessage[]): AsyncGenerator<string, void, unknown> {
    const config = getLLMConfig()
    
    const systemMessage: LLMMessage = {
      role: 'system',
      content: config.systemPrompt
    }

    const requestBody = {
      model: config.modelName,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    }

    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`)
    }

    const reader = response.body?.getReader()
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
              return
            }
            try {
              const chunk: StreamChunk = JSON.parse(data)
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                yield content
              }
            } catch (e) {
              // Ignore malformed JSON
            }
          }
        }
      }
    } finally {
      reader!.releaseLock()
    }
  }
}
