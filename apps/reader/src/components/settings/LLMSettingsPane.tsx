import { useState, useEffect } from 'react'
import { getLLMConfig, saveLLMConfig, LLMConfig } from '../../lib/llm-config'
import { TextField } from '../Form'

export function LLMSettingsPane() {
  const [config, setConfig] = useState<LLMConfig>(getLLMConfig())
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSaved) {
        setIsSaved(false)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [isSaved])

  const handleChange = (field: keyof LLMConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    saveLLMConfig(config)
    setIsSaved(true)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-on-surface-variant">
        配置您的 LLM API 设置。这些值会覆盖环境变量中的默认值。
      </p>
      
      <TextField
        label="API 基础 URL"
        value={config.baseUrl}
        onChange={(e) => handleChange('baseUrl', e.target.value)}
        placeholder="https://api.openai.com/v1/chat/completions"
      />
      
      <TextField
        label="API 密钥"
        type="password"
        value={config.apiKey}
        onChange={(e) => handleChange('apiKey', e.target.value)}
        placeholder="输入您的 API 密钥"
      />
      
      <TextField
        label="模型名称"
        value={config.modelName}
        onChange={(e) => handleChange('modelName', e.target.value)}
        placeholder="gpt-3.5-turbo"
      />
      
      <div>
        <label className="block text-sm font-medium text-on-surface mb-1">系统提示</label>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => handleChange('systemPrompt', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-outline rounded-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
          rows={3}
          placeholder="您是一个乐于助人的助手。"
        />
      </div>
      
      <button
        onClick={handleSave}
        className="px-3 py-2 text-sm bg-primary text-on-primary rounded-md hover:bg-primary-container transition-colors"
      >
        保存配置
      </button>
      
      {isSaved && (
        <div className="text-green-600 text-sm">配置已保存！</div>
      )}
    </div>
  )
}
