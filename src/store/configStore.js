import { create } from 'zustand'
import { DEFAULT_CONFIG, PARTS } from '../data/products'
import { checkFullCompatibility } from '../data/compatibility'

export const useConfigStore = create((set, get) => ({
  config: DEFAULT_CONFIG,
  exploded: false,
  highlightedPart: null,
  compatibility: { isCompatible: true, errors: [], warnings: [] },

  setPart: (category, part) => {
    set(state => {
      const newConfig = { ...state.config, [category]: part }
      const compatibility = checkFullCompatibility(newConfig)
      return { config: newConfig, compatibility }
    })
  },

  setPartById: (category, partId) => {
    const categoryParts = PARTS[category === 'case' ? 'cases' :
      category === 'switches' ? 'switches' :
      category === 'keycaps' ? 'keycaps' :
      category === 'pcb' ? 'pcb' :
      category === 'plate' ? 'plates' : 'cases']
    const part = categoryParts?.find(p => p.id === partId)
    if (part) get().setPart(category, part)
    return !!part
  },

  setExploded: (val) => set({ exploded: val }),

  setHighlighted: (partId) => {
    set({ highlightedPart: partId })
    setTimeout(() => set({ highlightedPart: null }), 3000)
  },

  getTotalPrice: () => {
    const { config } = get()
    return Object.values(config).reduce((sum, part) => sum + (part?.price || 0), 0)
  },

  resetConfig: () => set({ config: DEFAULT_CONFIG }),
}))
