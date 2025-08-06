import type { Sandbox } from '~/lib/types'

export interface AddNetworkParams {
  chainId: number
  chainName: string
  rpcUrl: string
  blockExplorerUrl?: string
  nativeCurrency?: {
    name: string
    symbol: string
    decimals: number
  }
}

/**
 * Add a custom network to MetaMask
 * Follows EIP-3085 standard for wallet_addEthereumChain
 */
export async function addNetworkToMetaMask(params: AddNetworkParams): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Check if MetaMask is available
    if (typeof window === 'undefined' || !window.ethereum) {
      return {
        success: false,
        error: 'MetaMask is not installed or not available',
      }
    }

    const provider = window.ethereum

    // Convert chainId to hex format as required by MetaMask
    const chainIdHex = `0x${params.chainId.toString(16)}`

    // First, try to switch to the network if it already exists
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })

      return { success: true }
    } catch (switchError: unknown) {
      // If network doesn't exist (error code 4902), add it
      if (
        switchError &&
        typeof switchError === 'object' &&
        'code' in switchError &&
        switchError.code === 4902
      ) {
        const addChainParams = {
          chainId: chainIdHex,
          chainName: params.chainName,
          rpcUrls: [params.rpcUrl],
          blockExplorerUrls: params.blockExplorerUrl
            ? [params.blockExplorerUrl]
            : undefined,
          nativeCurrency: params.nativeCurrency || {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
        }

        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [addChainParams],
        })

        return { success: true }
      }
      // User rejected or other error
      throw switchError
    }
  } catch (error: unknown) {
    console.error('Error adding network to MetaMask:', error)

    let errorMessage = 'Failed to add network to MetaMask'

    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 4001) {
        errorMessage = 'User rejected the request'
      } else if (error.code === -32602) {
        errorMessage = 'Invalid parameters'
      }
    }

    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Add BuildBear sandbox network to MetaMask
 * Convenience function that extracts network parameters from sandbox data
 */
export async function addSandboxToMetaMask(sandbox: Sandbox): Promise<{
  success: boolean
  error?: string
}> {
  if (!sandbox) {
    return {
      success: false,
      error: 'No sandbox data provided',
    }
  }

  // Generate network name based on sandbox
  const networkName = `BuildBear - ${sandbox.sandboxName}`

  return addNetworkToMetaMask({
    chainId: sandbox.chainId,
    chainName: networkName,
    rpcUrl: sandbox.rpcUrl,
    blockExplorerUrl: sandbox.explorerUrl,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  })
}

/**
 * Check if MetaMask is available
 */
export function isMetaMaskAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum
}

/**
 * Get current MetaMask chain ID
 */
export async function getCurrentChainId(): Promise<string | null> {
  try {
    if (!isMetaMaskAvailable() || !window.ethereum) return null

    const response = await window.ethereum.request({
      method: 'eth_chainId',
    })

    return typeof response === 'string' ? response : null
  } catch (error) {
    console.error('Error getting current chain ID:', error)
    return null
  }
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string
        params?: unknown[]
      }) => Promise<unknown>
      isMetaMask?: boolean
    }
  }
}
