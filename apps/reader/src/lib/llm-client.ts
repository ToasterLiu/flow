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
    const config = getLLMConfig()
    const requestBody = {
      messages,
      config,
    }

    const response = await fetch('/api/llm/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.content,
      finish_reason: data.finish_reason
    }
  }

  async* stream(messages: LLMMessage[]): AsyncGenerator<string, void, unknown> {
    const config = getLLMConfig()
    const requestBody = {
      messages,
      config,
    }

    const response = await fetch('/api/llm/generate?stream=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status} ${response.statusText}`)
    }

    if (!response.body) {
      return
    }

    const decoder = new TextDecoder()
    for await (const chunk of response.body) {
      yield decoder.decode(chunk, { stream: true })
    }
  }
}
