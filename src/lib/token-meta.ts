import voltxLogo from "@/assets/tokens/VOLTx.svg";
import scopexLogo from "@/assets/tokens/SCOPEx.svg";
import cashxLogo from "@/assets/tokens/CASHx.svg";
import macroxLogo from "@/assets/tokens/MACROx.svg";

interface TokenMeta {
  logo: string;
  name: string;
}

const TOKEN_META: Record<string, TokenMeta> = {
  CASHx: { logo: cashxLogo, name: "Blackrock ICS US Dollar Liquidity Fund in SG (by KAIO)" },
  VOLTx: { logo: voltxLogo, name: "Laser Digital Carry Fund in SG (by KAIO)" },
  SCOPEx: { logo: scopexLogo, name: "Hamilton Lane Senior Credit Opportunities Fund in SG (by KAIO)" },
  MACROx: { logo: macroxLogo, name: "Brevan Howard Master Fund in SG (by KAIO)" },
};

export function getTokenMeta(symbol: string): TokenMeta | null {
  return TOKEN_META[symbol] ?? null;
}
