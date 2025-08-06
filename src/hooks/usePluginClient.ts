import { PluginClient } from '@remixproject/plugin'
import { createClient } from '@remixproject/plugin-webview'
import React from 'react'
import Cookies from 'universal-cookie'
import type { Theme } from '~/lib/types'

// Create a singleton client instance
const client = new PluginClient()
createClient(client)

export const usePluginClient = () => {
  const [theme, setTheme] = React.useState<Theme>(null)

  React.useEffect(() => {
    const cookies = new Cookies()
    const isInstalled = cookies.get('plugin-installed')

    if (!isInstalled) {
      cookies.set('plugin-installed', 'true')
    }

    client.on('theme', 'themeChanged', (newTheme: React.CSSProperties) => {
      setTheme(newTheme)
    })

    // Cleanup function
    return () => {
      client.off('theme', 'themeChanged')
    }
  }, [])

  return {
    client,
    theme,
  }
}
