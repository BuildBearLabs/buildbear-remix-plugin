import {
  Header,
  SandboxCreate,
  SandboxDetails,
  SandboxHelp,
} from '~/components'
import {
  useAppState,
  useNetworkInitialization,
  useNetworks,
  usePluginClient,
} from '~/hooks'

function App() {
  const { theme } = usePluginClient()
  const { state, setState } = useAppState()
  const { networks, isLoading } = useNetworks()

  useNetworkInitialization({
    networks,
    state,
    setState,
  })

  return (
    <div className="p-0 flex w-full flex-col min-h-screen" style={{ ...theme }}>
      <Header />

      <div className="flex w-full flex-col flex-1">
        <SandboxCreate
          state={state}
          setState={setState}
          isLoading={isLoading}
          networks={networks}
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
