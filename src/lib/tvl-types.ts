export type TokenType = "Security Token" | "Bridged Security Token" | "Receipt Token";

export interface RawTvlRow {
  product: string;
  chain: string;
  supply: number;
  nav: number;
  tvl: number;
}

export interface ChainData {
  chain: string;
  supply: number;
  nav: number;
  tvl: number;
  tokenTypes: TokenType[];
  breakdown: {
    securityTVL: number;
    bridgedTVL: number;
    receiptTVL: number;
  };
}

export interface ProductData {
  product: string;
  chains: ChainData[];
  totalTVL: number;
}

export interface NormalizedData {
  products: ProductData[];
  allChains: string[];
  allProducts: string[];
  totalTVL: number;
}
