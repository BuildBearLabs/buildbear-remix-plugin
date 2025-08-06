import { NetworkIcons } from '~/components/icons/networks'

export const getChainIcon = (chainId?: number | null | string) => {
  if (!chainId) return NetworkIcons.None

  const numericChainId =
    typeof chainId === 'string' ? Number.parseInt(chainId, 10) : chainId

  if (Number.isNaN(numericChainId)) return NetworkIcons.None

  const mapChainIdToIcon = {
    1: 'Ethereum',
    5: 'Ethereum',
    17000: 'Ethereum',
    11155111: 'Ethereum',
    137: 'Polygon',
    80001: 'Polygon',
    80002: 'Polygon',
    42161: 'Arbitrum',
    421613: 'Arbitrum',
    421614: 'Arbitrum',
    10: 'Optimism',
    43114: 'Avalanche',
    56: 'Binance',
    97: 'Binance',
    1101: 'Polygon',
    59144: 'Linea',
    59141: 'Linea',
    100: 'Gnosis',
    2222: 'Kava',
    60808: 'Bob',
    808813: 'Bob',
    80084: 'Berachain',
    8453: 'Base',
    84532: 'Base',
    10143: 'Monad',
  }

  const iconName =
    mapChainIdToIcon[numericChainId as keyof typeof mapChainIdToIcon]

  const Icon = NetworkIcons[iconName as keyof typeof NetworkIcons]

  return Icon || NetworkIcons.None
}
