import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  streamingText: '',

  setOpen: (val) => set({ isOpen: val }),

  addMessage: (message) => set(state => ({
    messages: [...state.messages, { ...message, id: Date.now() }]
  })),

  setLoading: (val) => set({ isLoading: val }),

  setStreamingText: (text) => set({ streamingText: text }),

  clearStreaming: () => set({ streamingText: '' }),

  clearMessages: () => set({ messages: [] }),
}))
