import { useCallback } from 'react'
import { useConfigStore } from '../store/configStore'
import { useChatStore } from '../store/chatStore'
import { AI_TOOLS } from '../lib/tools'
import { buildSystemPrompt } from '../data/systemPrompt'
import { PARTS } from '../data/products'
import { checkFullCompatibility } from '../data/compatibility'

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_MODEL = 'mistral-large-latest' // supports function calling + streaming

export function useAIChat() {
  const { config, setPartById, setExploded, setHighlighted } = useConfigStore()
  const { messages, addMessage, setLoading, setStreamingText, clearStreaming } = useChatStore()

  const processToolCall = useCallback((toolName, toolInput) => {
    const actions = []

    if (toolName === 'apply_part') {
      const success = setPartById(toolInput.category, toolInput.partId)
      if (success) {
        actions.push({
          type: 'part_applied',
          category: toolInput.category,
          partId: toolInput.partId,
          reason: toolInput.reason,
        })
      }
    }

    if (toolName === 'highlight_part') {
      setHighlighted(toolInput.category)
      actions.push({ type: 'highlighted', category: toolInput.category })
    }

    if (toolName === 'set_exploded_view') {
      setExploded(toolInput.exploded)
      actions.push({ type: 'exploded', value: toolInput.exploded })
    }

    if (toolName === 'check_compatibility') {
      const result = checkFullCompatibility(config)
      actions.push({ type: 'compatibility_check', result })
    }

    return actions
  }, [config, setPartById, setExploded, setHighlighted])

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return

    addMessage({ role: 'user', text: userText })
    setLoading(true)

    const apiMessages = [
      { role: 'system', content: buildSystemPrompt(config, PARTS) },
      ...messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.text || m.content })),
      { role: 'user', content: userText },
    ]

    try {
      const apiKey = import.meta.env.VITE_MISTRAL_KEY || ''

      // --- Streaming request ---
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          messages: apiMessages,
          tools: AI_TOOLS,
          tool_choice: 'auto',
          stream: true,
          max_tokens: 1024,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `HTTP ${response.status}`)
      }

      // --- Parse SSE stream ---
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''
      // Accumulate tool call deltas: { id, name, argumentsStr }
      const toolCallAccum = {}

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete last line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break

          let chunk
          try { chunk = JSON.parse(data) } catch { continue }

          const delta = chunk.choices?.[0]?.delta
          if (!delta) continue

          // Text streaming
          if (delta.content) {
            fullText += delta.content
            setStreamingText(fullText)
          }

          // Tool call streaming — Mistral streams arguments in pieces
          if (delta.tool_calls) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0
              if (!toolCallAccum[idx]) {
                toolCallAccum[idx] = { id: tc.id || '', name: '', argumentsStr: '' }
              }
              if (tc.function?.name) toolCallAccum[idx].name = tc.function.name
              if (tc.function?.arguments) toolCallAccum[idx].argumentsStr += tc.function.arguments
            }
          }
        }
      }

      // --- Process completed tool calls ---
      const toolActions = []
      for (const tc of Object.values(toolCallAccum)) {
        if (!tc.name) continue
        let args = {}
        try { args = JSON.parse(tc.argumentsStr) } catch { /* malformed args */ }
        const actions = processToolCall(tc.name, args)
        toolActions.push(...actions)
      }

      clearStreaming()
      addMessage({
        role: 'assistant',
        text: fullText || (toolActions.length > 0 ? '' : 'Done.'),
        toolActions,
      })
    } catch (err) {
      clearStreaming()
      console.error('Mistral error:', err)
      const errorMsg = err.message?.includes('401') || err.message?.includes('Unauthorized')
        ? 'Please add your Mistral API key in the .env file as VITE_MISTRAL_KEY'
        : `Error: ${err.message || 'Something went wrong'}`
      addMessage({
        role: 'assistant',
        text: errorMsg,
        isError: true,
      })
    } finally {
      setLoading(false)
    }
  }, [messages, config, addMessage, setLoading, setStreamingText, clearStreaming, processToolCall])

  return { sendMessage }
}
