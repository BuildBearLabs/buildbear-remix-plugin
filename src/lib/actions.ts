import type { Network } from '~/lib/types'

/**
 * Fetches available networks/chains from the backend API.
 */
export const fetchNetworks = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_API_BASE}/chains`)

  if (!res.ok) {
    throw new Error('Failed to fetch networks')
  }

  const networks = (await res.json()) as Array<Network>

  // Filter out duplicate networks based on their ID
  const uniqueNetworks = networks.filter(
    (network, index, self) =>
      index === self.findIndex((t) => t.id === network.id),
  )
  return uniqueNetworks
}

/**
 * Creates a new BuildBear sandbox for the -
 * specified blockchain network.
 */
export const createSandbox = async ({ chainId }: { chainId: string }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE}/buildbear-sandbox`,
    {
      method: 'POST',
      body: JSON.stringify({ chainId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to create sandbox')
  }

  const data = await res.json()
  return data
}

/**
 * Retrieves details for an existing BuildBear sandbox -
 * by its ID.
 * (Saved LocalStorage sandboxId)
 */
export const getSandbox = async ({ sandboxId }: { sandboxId: string }) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_API_BASE}/user/container/${sandboxId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch sandbox')
  }

  const sandbox = await res.json()
  return sandbox
}

/*
 * Submit Analytics
 */
export const submitAnalytics = async ({
  button,
  title,
  sandboxId,
}: {
  button: string
  title: string
  sandboxId?: string
}) => {
  const res = await fetch(`${import.meta.env.VITE_FE_API_BASE}/t`, {
    method: 'POST',
    body: JSON.stringify({
      payload: {
        sandboxId,
        event: {
          element: `remix-ide-${button}`,
          type: 'click',
          location: 'remix-plugin-ide',
          title,
        },
      },
    }),
  })

  if (!res.ok) {
    return { status: 'error' }
  }

  return { status: 'success' }
}
