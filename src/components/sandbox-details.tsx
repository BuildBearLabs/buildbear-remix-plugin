import { useQuery } from '@tanstack/react-query'
import { Copy, FolderSync, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Badge,
  Button,
  CopyToClipboard,
  DataRow,
  Label,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components'
import { Icons } from '~/components/icons'
import { getSandbox, submitAnalytics } from '~/lib/actions'
import type { State } from '~/lib/types'
import {
  addSandboxToMetaMask,
  getChainIcon,
  isMetaMaskAvailable,
} from '~/utils'

interface SandboxDetailsProps {
  state: State
  setState: (state: State) => void
}

export const SandboxDetails = ({ state, setState }: SandboxDetailsProps) => {
  const [isAddingToMetaMask, setIsAddingToMetaMask] = useState(false)

  /**
   * Fetch the sandbox data from the API
   */
  const { data, isPending, isRefetching } = useQuery({
    queryKey: ['sandbox'],
    queryFn: () =>
      getSandbox({
        sandboxId: state?.sandbox?.sandboxId ?? '',
      }),
    enabled: !!state?.sandbox?.sandboxId,
    staleTime: 0,
  })

  /**
   * Get the chain icon
   */
  const ChainIcon = getChainIcon(state?.sandbox?.forkingDetails?.chainId ?? 1)

  /**
   * Add the sandbox to MetaMask
   */
  const handleAddToMetaMask = async () => {
    if (!state?.sandbox) {
      toast.error('No sandbox data available')
      return
    }

    if (!isMetaMaskAvailable()) {
      toast.error('MetaMask is not installed or not available')
      return
    }

    setIsAddingToMetaMask(true)

    try {
      const result = await addSandboxToMetaMask(state.sandbox)

      if (result.success) {
        toast.success('Network added to MetaMask successfully!')
      } else {
        toast.error(result.error || 'Failed to add network to MetaMask')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsAddingToMetaMask(false)
    }
  }

  /**
   * Remove the sandbox from the state
   * (This does not delete the sandbox from the backend)
   */
  const handleRemoveSandbox = () => {
    if (!state?.sandbox) {
      toast.error('No sandbox to remove')
      return
    }
    setState({
      ...state,
      sandbox: null,
    })
    toast.success('Sandbox removed successfully!')
  }

  return (
    <div className="p-3 flex flex-col gap-3 w-full break-all dark:!bg-gray-900 flex-1 bg-white">
      <div className="flex flex-col gap-1 border !border-gray-200 dark:!border-gray-700 !rounded-sm p-3 flex-1 bg-white dark:!bg-transparent">
        <div className="flex w-full items-center justify-between gap-3">
          <Label className="shrink-0 m-0 flex items-center gap-1">Status</Label>

          {!isPending && !isRefetching && data?.status === 'live' && (
            <Badge variant="green">Live</Badge>
          )}

          {!isPending && !isRefetching && data?.status !== 'live' && (
            <Badge variant="yellow">Stopped</Badge>
          )}

          {(isPending || isRefetching) && (
            <Badge>
              <Loader2 className="!size-3 animate-spin" />
            </Badge>
          )}
        </div>

        <DataRow
          label="Sandbox ID"
          value={state?.sandbox?.sandboxId}
          icon={
            <ChainIcon className="size-[18px] shrink-0 border border-gray-200 dark:!border-gray-700 rounded-full" />
          }
          isCopyable
          copyValue={state?.sandbox?.sandboxId}
          copyTooltip="Copy Sandbox ID"
        />

        <DataRow
          label="Chain ID"
          value={state?.sandbox?.chainId}
          isCopyable
          copyValue={state?.sandbox?.chainId?.toString() ?? ''}
          copyTooltip="Copy Chain ID"
        />

        <Separator className="my-1" />

        <DataRow
          label="Forked Chain ID"
          value={state?.sandbox?.forkingDetails?.chainId}
          isCopyable
          copyValue={state?.sandbox?.forkingDetails?.chainId?.toString() ?? ''}
          copyTooltip="Copy Forked Chain ID"
        />

        <DataRow
          label="Block Number"
          value={state?.sandbox?.forkingDetails?.blockNumber}
          isCopyable
          copyValue={
            state?.sandbox?.forkingDetails?.blockNumber?.toString() ?? ''
          }
          copyTooltip="Copy Block Number"
        />

        <Separator className="my-1" />

        <div className="flex flex-col gap-1 w-full">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleAddToMetaMask}
            disabled={isAddingToMetaMask || !state?.sandbox}
            onMouseDown={async () => {
              await submitAnalytics({
                button: 'add-to-metamask',
                title: 'Add to MetaMask',
                sandboxId: state.sandbox?.sandboxId || '',
              })
            }}
          >
            {isAddingToMetaMask ? (
              <Loader2 className="!size-3.5 animate-spin" />
            ) : (
              <Icons.MetaMask className="!size-3.5" />
            )}
            {isAddingToMetaMask ? 'Adding to MetaMask...' : 'Add to MetaMask'}
          </Button>
          <CopyToClipboard
            value={state?.sandbox?.rpcUrl}
            tooltipLabel="Use the RPC URL to connect to your sandbox network"
            as="div"
            noCopyIcon
          >
            <Button
              className="w-full"
              variant="outline"
              onMouseDown={async () => {
                await submitAnalytics({
                  button: 'copy-rpc-url',
                  title: 'Copy RPC URL',
                  sandboxId: state.sandbox?.sandboxId || '',
                })
              }}
            >
              <Copy className="!size-3.5" strokeWidth={1.5} />
              Copy RPC URL
            </Button>
          </CopyToClipboard>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={state?.sandbox?.explorerUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full"
                onMouseDown={async () => {
                  await submitAnalytics({
                    button: 'open-explorer',
                    title: 'Open Explorer',
                    sandboxId: state.sandbox?.sandboxId || '',
                  })
                }}
              >
                <Button className="w-full gap-1.5" variant="outline">
                  <Icons.Explorer className="!size-3.5" />
                  Open Explorer
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-none !w-[var(--radix-tooltip-trigger-width)]"
              side="top"
            >
              View your transactions on the explorer
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={state?.sandbox?.faucetUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full"
                onMouseDown={async () => {
                  await submitAnalytics({
                    button: 'open-faucet',
                    title: 'Open Faucet',
                    sandboxId: state.sandbox?.sandboxId || '',
                  })
                }}
              >
                <Button className="w-full gap-1.5" variant="outline">
                  <Icons.Faucet className="!size-3.5" />
                  Open Faucet
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent
              className="max-w-none !w-[var(--radix-tooltip-trigger-width)]"
              side="top"
            >
              Get Free test tokens from the faucet
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <a
          href={import.meta.env.VITE_TALLY_FORM ?? ''}
          target="_blank"
          rel="noreferrer noopener"
          onMouseDown={async () => {
            await submitAnalytics({
              button: 'claim-sandbox',
              title: 'Claim Sandbox',
              sandboxId: state.sandbox?.sandboxId || '',
            })
          }}
        >
          <Button className="w-full gap-1.5" variant="secondary">
            <FolderSync className="!size-3.5" strokeWidth={1.5} />
            Claim Sandbox
          </Button>
        </a>

        <Button
          className="w-full gap-1.5"
          variant="destructive"
          onClick={handleRemoveSandbox}
          disabled={!state?.sandbox}
          onMouseDown={async () => {
            await submitAnalytics({
              button: 'remove-sandbox',
              title: 'Remove Sandbox',
              sandboxId: state.sandbox?.sandboxId || '',
            })
          }}
        >
          <Trash2 className="!size-3.5 stroke-red-500" strokeWidth={1.5} />
          Remove Sandbox
        </Button>
      </div>
    </div>
  )
}

SandboxDetails.displayName = 'SandboxDetails'
