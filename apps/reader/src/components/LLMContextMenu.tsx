import { HTMLStreamRenderer } from './HTMLStreamRenderer'
import { useState, useEffect, useRef } from 'react'
import { LLMClient, LLMMessage } from '../lib/llm-client'
import { getLLMConfig } from '../lib/llm-config'

interface LLMContextMenuProps {
  x: number
  y: number
  selectedText: string
  onClose: () => void
}

export function LLMContextMenu({ x, y, selectedText, onClose }: LLMContextMenuProps) {
  const [response, setResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleAskLLM = async () => {
    if (!selectedText.trim()) return
    
    setIsLoading(true)
    setError(null)
    setResponse('')
    
    try {
      const client = new LLMClient()
      const messages: LLMMessage[] = [
        { role: 'user', content: selectedText }
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

  const config = getLLMConfig()
  const hasValidConfig = config.baseUrl && config.apiKey && config.modelName

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-surface border border-outline rounded-md shadow-lg p-3 min-w-[200px] max-w-[400px]"
      style={{ left: x, top: y }}
    >
      <div className="text-sm mb-2">
        <div className="font-medium text-on-surface">选中的文本:</div>
        <div className="text-on-surface-variant text-xs break-words">{selectedText}</div>
      </div>
      
      {!hasValidConfig && (
        <div className="text-xs text-red-500 mb-2">
          请先在设置中配置LLM API
        </div>
      )}
      
      <button
        onClick={handleAskLLM}
        disabled={!hasValidConfig || isLoading || !selectedText.trim()}
        className="w-full px-3 py-2 text-sm bg-primary text-on-primary rounded-md hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '生成中...' : '询问AI'}
      </button>
      
      {error && (
        <div className="mt-2 text-xs text-red-500 break-words">{error}</div>
      )}
      
      {response && (
        <div className="mt-2 p-2 bg-surface-variant rounded-md max-h-60 overflow-y-auto">
          <HTMLStreamRenderer htmlContent={response} />
        </div>
      )}
    </div>
  )
}
