import React from 'react'
import type { Network, State } from '~/lib/types'

interface UseNetworkInitializationProps {
  networks: Network[]
  state: State
  setState: (newState: State) => void
}

export const useNetworkInitialization = ({
  networks,
  state,
  setState,
}: UseNetworkInitializationProps) => {
  const hasInitializedNetwork = React.useRef(false)

  /**
   * Validate and update localStorage state when networks are available
   */
  React.useEffect(() => {
    if (
      networks.length > 0 &&
      hasInitializedNetwork.current &&
      state.network?.id
    ) {
      // Validate that the saved network still exists
      const savedNetwork = networks.find((n) => n.id === state.network?.id)
      if (savedNetwork) {
        // Update with the validated network object
        setState({
          network: savedNetwork,
          chainId: state.chainId,
          sandbox: state.sandbox,
        })
      } else {
        // If saved network no longer exists, fall back to default
        hasInitializedNetwork.current = false
      }
    }
  }, [networks, state.network?.id, state.chainId, state.sandbox, setState])

  /**
   * Set the first network as default if no network is selected
   */
  React.useEffect(() => {
    if (
      networks.length > 0 &&
      !state.network?.id &&
      !hasInitializedNetwork.current
    ) {
      const firstNetwork = networks[0]
      hasInitializedNetwork.current = true
      setState({
        network: firstNetwork,
        chainId: firstNetwork.options[0]?.value || '',
        sandbox: state.sandbox,
      })
    }
  }, [networks, state, setState])

  /**
   * Mark as initialized when state is loaded from localStorage
   */
  React.useEffect(() => {
    if (state.network?.id && state.chainId && !hasInitializedNetwork.current) {
      hasInitializedNetwork.current = true
    }
  }, [state.network?.id, state.chainId])

  return {
    hasInitializedNetwork: hasInitializedNetwork.current,
  }
}
