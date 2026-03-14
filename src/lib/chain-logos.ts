// Chain logo URLs using public token/chain icon sources
const CHAIN_LOGOS: Record<string, string> = {
  Ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
  Polygon: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
  Avalanche: "https://cryptologos.cc/logos/avalanche-avax-logo.svg",
  Solana: "https://cryptologos.cc/logos/solana-sol-logo.svg",
  Sui: "https://cryptologos.cc/logos/sui-sui-logo.svg",
  Near: "https://cryptologos.cc/logos/near-protocol-near-logo.svg",
  Aptos: "https://cryptologos.cc/logos/aptos-apt-logo.svg",
  Hedera: "https://cryptologos.cc/logos/hedera-hbar-logo.svg",
  Sei: "https://cryptologos.cc/logos/sei-sei-logo.svg",
  Injective: "https://cryptologos.cc/logos/injective-inj-logo.svg",
  XDC: "https://cryptologos.cc/logos/xdc-network-xdc-logo.svg",
  Immutable: "https://cryptologos.cc/logos/immutable-x-imx-logo.svg",
  Mantra: "https://cryptologos.cc/logos/mantra-om-logo.svg",
};

export function getChainLogo(chain: string): string | null {
  return CHAIN_LOGOS[chain] ?? null;
}
