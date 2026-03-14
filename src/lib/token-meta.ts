import voltxLogo from "@/assets/tokens/VOLTx.svg";
import scopexLogo from "@/assets/tokens/SCOPEx.svg";
import cashxLogo from "@/assets/tokens/CASHx.svg";
import macroxLogo from "@/assets/tokens/MACROx.svg";

interface TokenMeta {
  logo: string;
  name: string;
}

const TOKEN_META: Record<string, TokenMeta> = {
  VOLTx: { logo: voltxLogo, name: "Volt Token" },
  SCOPEx: { logo: scopexLogo, name: "Scope Token" },
  CASHx: { logo: cashxLogo, name: "Cash Token" },
  MACROx: { logo: macroxLogo, name: "Macro Token" },
};

export function getTokenMeta(symbol: string): TokenMeta | null {
  return TOKEN_META[symbol] ?? null;
}
