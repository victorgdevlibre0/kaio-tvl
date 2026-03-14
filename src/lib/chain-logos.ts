import ethereumLogo from "@/assets/chains/ethereum.png";
import polygonLogo from "@/assets/chains/polygon.png";
import avalancheLogo from "@/assets/chains/avalanche.png";
import solanaLogo from "@/assets/chains/solana.png";
import suiLogo from "@/assets/chains/sui.png";
import nearLogo from "@/assets/chains/near.png";
import aptosLogo from "@/assets/chains/aptos.png";
import hederaLogo from "@/assets/chains/hedera.png";
import seiLogo from "@/assets/chains/sei.png";
import injectiveLogo from "@/assets/chains/injective.png";
import xdcLogo from "@/assets/chains/xdc.png";
import immutableLogo from "@/assets/chains/immutable.png";
import mantraLogo from "@/assets/chains/mantra.png";

const CHAIN_LOGOS: Record<string, string> = {
  Ethereum: ethereumLogo,
  Polygon: polygonLogo,
  Avalanche: avalancheLogo,
  Solana: solanaLogo,
  Sui: suiLogo,
  Near: nearLogo,
  Aptos: aptosLogo,
  Hedera: hederaLogo,
  Sei: seiLogo,
  Injective: injectiveLogo,
  XDC: xdcLogo,
  Immutable: immutableLogo,
  Mantra: mantraLogo,
};

export function getChainLogo(chain: string): string | null {
  return CHAIN_LOGOS[chain] ?? null;
}
