<img src="https://r2.buildbear.io/brand-v2/logo/svg/Logo-Full-Green-Mark-On-Dark-Text.svg" alt="BuildBear Labs Logo" height="44" />

# BuildBear Remix Plugin

A Remix IDE plugin that allows developers to easily create and manage blockchain sandboxes for testing and development.

## Features

- **Multi-Chain Support**: Create sandboxes for Ethereum, Arbitrum, Avalanche, Base, Polygon, and more
- **One-Click Sandbox Creation**: Quickly spin up blockchain environments
- **Integrated Tools**: Access to RPC endpoints, block explorers, and faucets
- **MetaMask Integration**: Seamless wallet connection
- **Persistent State**: Your sandbox settings are saved locally

## Installation

### Prerequisites

- Node.js 20 or higher
- pnpm package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/BuildBearLabs/buildbear-remix-plugin.git
cd buildbear-remix-plugin
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Build for production:
```bash
pnpm build
```

## Usage

1. **Select Network**: Choose your desired blockchain network from the dropdown
2. **Create Sandbox**: Click "Create Sandbox" to spin up a new environment
3. **Access Tools**: Use the provided RPC URL, explorer, and faucet links
4. **Connect Wallet**: Connect your MetaMask wallet to interact with the sandbox

## Development

This plugin is built with:

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Biome** - Linting and formatting

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm format` - Format code with Biome

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run formatting: `pnpm format`
5. Submit a pull request

## Support

If you have any issues, you can reach out to us on team@buildbear.io or https://t.me/Web3_dApp_Developers
