import React from 'react'
import type { State } from '~/lib/types'

const STORAGE_KEY = 'buildbear-sandbox-state'

const createInitialState = (): State => ({
  network: {
    id: '',
    name: '',
    options: [],
  },
  chainId: '',
  sandbox: null,
})

export const useAppState = () => {
  const [state, setStateInternal] = React.useState<State>(createInitialState)

  /**
   * Wrapper to save to localStorage when state changes
   */
  const setState = React.useCallback((newState: State) => {
    setStateInternal(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }, [])

  /**
   * Load state from localStorage on mount
   */
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.network?.id && parsed.chainId) {
          setStateInternal({
            network: parsed.network,
            chainId: parsed.chainId,
            sandbox: parsed.sandbox || null,
          })
        }
      } catch (error) {
        console.warn('Failed to parse saved state:', error)
      }
    }
  }, [])

  return {
    state,
    setState,
  }
}
