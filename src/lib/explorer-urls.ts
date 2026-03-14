const EXPLORER_MAP: Record<string, { url: string; label: string; addressPath: string }> = {
  Ethereum: { url: "https://etherscan.io", label: "Etherscan", addressPath: "/address/" },
  Polygon: { url: "https://polygonscan.com", label: "PolygonScan", addressPath: "/address/" },
  Avalanche: { url: "https://snowtrace.io", label: "Snowtrace", addressPath: "/address/" },
  Sei: { url: "https://seitrace.com", label: "SeiTrace", addressPath: "/address/" },
  Solana: { url: "https://solscan.io", label: "Solscan", addressPath: "/account/" },
  Immutable: { url: "https://explorer.immutable.com", label: "Immutable Explorer", addressPath: "/address/" },
  XDC: { url: "https://xdcscan.com", label: "XDCScan", addressPath: "/address/" },
  Mantra: { url: "https://explorer.mantra.zone", label: "Mantra Explorer", addressPath: "/address/" },
  Injective: { url: "https://explorer.injective.network", label: "Injective Explorer", addressPath: "/contract/" },
  Sui: { url: "https://suiscan.xyz/mainnet", label: "SuiScan", addressPath: "/object/" },
  Near: { url: "https://nearblocks.io", label: "NearBlocks", addressPath: "/address/" },
  Aptos: { url: "https://explorer.aptoslabs.com", label: "Aptos Explorer", addressPath: "/object/" },
  Hedera: { url: "https://hashscan.io/mainnet", label: "HashScan", addressPath: "/contract/" },
};

export function getExplorerUrl(chain: string, address: string): string | null {
  const explorer = EXPLORER_MAP[chain];
  if (!explorer) return null;
  return `${explorer.url}${explorer.addressPath}${address}`;
}

export function getExplorerLabel(chain: string): string {
  return EXPLORER_MAP[chain]?.label ?? "Explorer";
}
