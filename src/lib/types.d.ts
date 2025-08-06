import React from 'react'

export interface NetworkOption {
	label: string;
	value: string;
	networkRpc: string;
}

export interface Network {
	id: string;
	name: string;
	options: NetworkOption[];
}

export interface Sandbox {
	status: "live" | "stopped";
	sandboxId: string;
	sandboxName: string;
	forkingDetails: { chainId: string; blockNumber: number };
	chainId: number;
	mnemonic: string;
	rpcUrl: string;
	explorerUrl: string;
	faucetUrl: string;
	verificationUrl: string;
}

export interface State {
	network: Network;
	chainId: string;
	sandbox: Sandbox | null;
}

export interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
}

export type TrackEventPayload = {
	element: string
	type: string
	location: string
	title: string
}

export type Theme = React.CSSProperties | null