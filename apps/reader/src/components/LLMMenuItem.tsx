import { HTMLStreamRenderer } from './HTMLStreamRenderer'
import { useState, useEffect } from 'react'
import { LLMClient, LLMMessage } from '../lib/llm-client'
import { getLLMConfig } from '../lib/llm-config'
import { BookTab } from '../models'
import { MdSmartButton } from 'react-icons/md'

interface LLMMenuItemProps {
  text: string
  hide: () => void
  cfi: string
  tab: BookTab
}

export function LLMMenuItem({ text, hide, cfi, tab }: LLMMenuItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const config = getLLMConfig()
  const hasValidConfig = config.baseUrl && config.apiKey && config.modelName

  const handleAskLLM = async () => {
    if (!text.trim() || !hasValidConfig) return
    
    setIsLoading(true)
    setError(null)
    setResponse('')
    
    try {
      const client = new LLMClient()
      const messages: LLMMessage[] = [
        { role: 'user', content: text }
      ]
      
      for await (const chunk of client.stream(messages)) {
        setResponse(prev => prev + chunk)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }

  // 如果没有有效配置，不显示菜单项
  if (!hasValidConfig) {
    return null
  }

  return (
    <div className="mt-2 pt-2 border-t border-outline">
      <button
        onClick={handleAskLLM}
        disabled={isLoading}
        className="flex items-center gap-2 px-2 py-1 text-sm text-on-surface hover:bg-surface-variant rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MdSmartButton size={16} />
        {isLoading ? '询问AI...' : '询问AI'}
      </button>
      
      {error && (
        <div className="mt-1 text-xs text-red-500 break-words px-2">{error}</div>
      )}
      
      {response && (
        <div className="mt-1 p-2 bg-surface-variant rounded-md max-h-40 overflow-y-auto text-sm">
          <HTMLStreamRenderer htmlContent={response} />
        </div>
      )}
    </div>
  )
}
