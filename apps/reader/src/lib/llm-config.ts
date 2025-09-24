export interface LLMConfig {
  baseUrl: string
  apiKey: string
  modelName: string
  systemPrompt: string
}

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  baseUrl: process.env.NEXT_PUBLIC_LLM_API_BASE_URL || '',
  apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY || '',
  modelName: process.env.NEXT_PUBLIC_LLM_MODEL_NAME || 'gpt-3.5-turbo',
  systemPrompt: process.env.NEXT_PUBLIC_LLM_SYSTEM_PROMPT || 'You are a helpful assistant.'
}

export const getLLMConfig = (): LLMConfig => {
  if (typeof window === 'undefined') {
    return DEFAULT_LLM_CONFIG
  }

  try {
    const stored = localStorage.getItem('llm-config')
    if (stored) {
      return { ...DEFAULT_LLM_CONFIG, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.warn('Failed to parse LLM config from localStorage', e)
  }

  return DEFAULT_LLM_CONFIG
}

export const saveLLMConfig = (config: Partial<LLMConfig>): void => {
  if (typeof window === 'undefined') {
    return
  }

  const current = getLLMConfig()
  const updated = { ...current, ...config }
  localStorage.setItem('llm-config', JSON.stringify(updated))
}
