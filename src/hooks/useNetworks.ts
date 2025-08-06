import { useQuery } from '@tanstack/react-query'
import type { Network } from '~/lib/types'
import { fetchNetworks } from '~/lib/actions'

export const useNetworks = () => {
  const {
    data: networks,
    isPending: isNetworksPending,
    isRefetching: isNetworksRefetching,
    error,
  } = useQuery<Network[]>({
    queryKey: ['networks'],
    queryFn: fetchNetworks,
    initialData: [],
  })

  return {
    networks: networks || [],
    isLoading: isNetworksPending || isNetworksRefetching,
    error,
  }
} 