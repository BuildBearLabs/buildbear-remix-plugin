import { PluginClient } from '@remixproject/plugin'
import { createClient } from '@remixproject/plugin-webview'

import React from 'react'
import Cookies from 'universal-cookie'
import {
  Header,
  SandboxCreate,
  SandboxDetails,
  SandboxHelp,
} from '~/components'
import type { Network, State } from '~/lib/types'
import { fetchNetworks } from './lib/actions'
import { useQuery } from '@tanstack/react-query'

const client = new PluginClient()
createClient(client)

function App() {
  const [theme, setTheme] = React.useState<React.CSSProperties | null>(null)
  const hasInitializedNetwork = React.useRef(false)

  /**
   * Local state for the data
   */
  const [state, setStateInternal] = React.useState<State>({
    network: {
      id: '',
      name: '',
      options: [],
    },
    chainId: '',
    sandbox: null,
  })

  /**
   * Wrapper to save to localStorage when state changes
   * and update the app state
   */
  const setState = React.useCallback((newState: State) => {
    setStateInternal(newState)
    localStorage.setItem('buildbear-sandbox-state', JSON.stringify(newState))
  }, [])

  /**
   * Fetch available networks
   */
  const {
    data: networks,
    isPending: isNetworksPending,
    isRefetching: isNetworksRefetching,
  } = useQuery<Network[]>({
    queryKey: ['networks'],
    queryFn: fetchNetworks,
    initialData: [],
  })

  /**
   * Load state from localStorage first (before networks are loaded)
   */
  React.useEffect(() => {
    const saved = localStorage.getItem('buildbear-sandbox-state')

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.network?.id && parsed.chainId) {
          hasInitializedNetwork.current = true
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
        setStateInternal({
          network: savedNetwork,
          chainId: state.chainId,
          sandbox: state.sandbox,
        })
      } else {
        // If saved network no longer exists, fall back to default
        hasInitializedNetwork.current = false
      }
    }
  }, [networks, state.network?.id, state.chainId, state.sandbox])

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
   * Initialize the plugin and set the theme
   */
  React.useEffect(() => {
    const cookies = new Cookies()
    const isInstalled = cookies.get('plugin-installed')
    if (!isInstalled) {
      cookies.set('plugin-installed', 'true')
    }
    client.on('theme', 'themeChanged', (theme: React.CSSProperties) => {
      setTheme(theme)
    })
  }, [])

  return (
    <div className="p-0 flex w-full flex-col min-h-screen" style={{ ...theme }}>
      <Header />
      <div className="flex w-full flex-col flex-1">
        <SandboxCreate
          state={state}
          setState={setState}
          isLoading={isNetworksPending || isNetworksRefetching}
          networks={networks || []}
        />

        {!state?.sandbox && (
          <div className="p-3 flex flex-col gap-1 w-full break-all dark:!bg-gray-900 flex-1 bg-white justify-center items-center">
            <h2 className="text-sm font-medium">No sandbox selected</h2>
            <p className="text-sm text-gray-500">
              Please create a sandbox to get started
            </p>
          </div>
        )}

        {state?.sandbox && <SandboxDetails state={state} setState={setState} />}
      </div>
      <SandboxHelp />
    </div>
  )
}

export default App
