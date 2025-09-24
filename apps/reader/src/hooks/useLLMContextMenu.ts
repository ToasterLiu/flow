import { useState, useEffect, useCallback } from 'react'
import { getLLMConfig } from '../lib/llm-config'

export function useLLMContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    selectedText: string
  } | null>(null)

  const showContextMenu = useCallback((x: number, y: number, selectedText: string) => {
    const config = getLLMConfig()
    const hasValidConfig = config.baseUrl && config.apiKey && config.modelName
    
    if (selectedText.trim() && hasValidConfig) {
      setContextMenu({
        x,
        y,
        selectedText: selectedText.trim()
      })
    }
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  useEffect(() => {
    const handleClick = () => {
      closeContextMenu()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [closeContextMenu])

  return { contextMenu, showContextMenu, closeContextMenu }
}
