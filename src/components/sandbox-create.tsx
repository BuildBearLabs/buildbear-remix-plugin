import { Loader2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { Icons } from '~/components/icons'
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui'
import { createSandbox, submitAnalytics } from '~/lib/actions'
import type { Network, NetworkOption, Sandbox, State } from '~/lib/types'
import { queryClient } from '~/main'

interface SandboxCreateProps {
  state: State
  setState: (state: State) => void
  isLoading: boolean
  networks: Network[]
}

export const SandboxCreate = ({
  state,
  setState,
  isLoading,
  networks,
}: SandboxCreateProps) => {
  const [isPending, startTransition] = React.useTransition()

  /**
   * Create a sandbox
   */
  const handleCreateSandbox = () => {
    startTransition(async () => {
      try {
        const res = await createSandbox({
          chainId: state.chainId,
        })
        setState({
          ...state,
          sandbox: res as Sandbox,
        })
        toast.success('Sandbox created successfully')
      } catch {
        toast.error('Failed to create sandbox')
      } finally {
        queryClient.refetchQueries({ queryKey: ['sandbox'] })
      }
    })
  }

  return (
    <div className="flex flex-col px-3 py-3 gap-3 border-b !border-gray-200 dark:!border-gray-700 dark:bg-gray-900 bg-slate-100">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="network">Select Network</Label>
        <Select
          defaultValue={state?.network?.id ?? ''}
          onValueChange={(value) => {
            const selectedNetwork = state.network?.options?.find(
              (network: NetworkOption) => network.value === value,
            )

            if (!selectedNetwork) {
              // Find the network by id instead
              const foundNetwork = networks?.find((network: Network) => network.id === value)
              if (foundNetwork) {
                setState({
                  ...state,
                  network: foundNetwork,
                  chainId: foundNetwork.options[0]?.value || '',
                })
              }
              return
            }

            setState({
              ...state,
              network: selectedNetwork as unknown as Network,
              chainId: selectedNetwork.value || '',
            })
          }}
          value={state?.network?.id ?? ''}
        >
          <SelectTrigger className="w-full dark:text-white">
            <SelectValue placeholder="Select a Network" />
            {isLoading && (
              <Loader2
                className="animate-spin !size-4 text-white"
                strokeWidth={1.5}
              />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {networks?.map((network: Network) => (
                <SelectItem key={network.id} value={network.id}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {state.network && state.network?.options?.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="network">Select Chain (Mainnet / Testnet)</Label>
          <Select
            defaultValue={state.chainId}
            onValueChange={(value) => setState({ ...state, chainId: value })}
            value={state.chainId}
          >
            <SelectTrigger className="w-full dark:text-white">
              <SelectValue placeholder="Select a Chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {state.network?.options.map((option: NetworkOption) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        onClick={handleCreateSandbox}
        disabled={isPending || !state.network || isLoading}
        onMouseDown={async () => {
          await submitAnalytics({
            button: 'create-sandbox',
            title: 'Create Sandbox',
            sandboxId: state.sandbox?.sandboxId || '',
          })
        }}
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <Loader2
              className="animate-spin !size-4 text-white"
              strokeWidth={1.5}
            />
            <span className="text-white">Creating Sandbox...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Icons.Sandbox className="!size-4 fill-white" strokeWidth={1.5} />
            <span className="text-white">Create Sandbox</span>
          </span>
        )}
      </Button>
    </div>
  )
}

SandboxCreate.displayName = 'SandboxCreate'
