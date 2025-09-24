import { useState } from 'react'
import { LLMClient, LLMMessage } from '../lib/llm-client'
import { getLLMConfig } from '../lib/llm-config'

interface LLMMenuItemProps {
  selectedText: string
  onShowResponse: (response: string) => void
}

export function LLMMenuItem({ selectedText, onShowResponse }: LLMMenuItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const config = getLLMConfig()
  const hasValidConfig = config.baseUrl && config.apiKey && config.modelName

  const handleAskLLM = async () => {
    if (!selectedText.trim() || !hasValidConfig) return
    
    setIsLoading(true)
    let fullResponse = ''
    
    try {
      const client = new LLMClient()
      const messages: LLMMessage[] = [
        { role: 'user', content: selectedText }
      ]
      
      for await (const chunk of client.stream(messages)) {
        fullResponse += chunk
        onShowResponse(fullResponse)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response'
      onShowResponse(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAskLLM}
      disabled={!hasValidConfig || isLoading}
      className="px-3 py-2 text-sm text-on-surface hover:bg-surface-variant w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? '询问AI...' : '询问AI'}
    </button>
  )
}
