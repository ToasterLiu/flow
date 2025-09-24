import { getLLMConfig } from './llm-config'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  finish_reason: string
}

export class LLMClient {
  private config = getLLMConfig()

  async generate(messages: LLMMessage[]): Promise<LLMResponse> {
    const systemMessage: LLMMessage = {
      role: 'system',
      content: this.config.systemPrompt
    }

    const requestBody = {
      model: this.config.modelName,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000
    }

    const response = await fetch(this.config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
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

  updateConfig(): void {
    this.config = getLLMConfig()
  }
}
