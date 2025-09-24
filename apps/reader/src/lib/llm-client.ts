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

}
