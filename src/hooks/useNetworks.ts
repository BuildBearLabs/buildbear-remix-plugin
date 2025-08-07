import { useQuery } from '@tanstack/react-query'
import { fetchNetworks } from '~/lib/actions'
import type { Network } from '~/lib/types'

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
