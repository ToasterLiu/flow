import { useState, useEffect } from 'react'
import { getLLMConfig } from '../lib/llm-config'

export function useLLMContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    selectedText: string
  } | null>(null)

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const selection = window.getSelection()
      const selectedText = selection ? selection.toString().trim() : ''
      
      // 只有在有选中文本且配置有效时才显示菜单
      const config = getLLMConfig()
      const hasValidConfig = config.baseUrl && config.apiKey && config.modelName
      
      if (selectedText && hasValidConfig) {
        e.preventDefault()
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          selectedText
        })
      } else {
        setContextMenu(null)
      }
    }

    const handleClick = () => {
      setContextMenu(null)
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  return { contextMenu, closeContextMenu }
}
