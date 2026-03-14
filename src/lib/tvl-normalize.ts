import { RawTvlRow, TokenType, ChainData, ProductData, NormalizedData, ContractInfo } from "./tvl-types";

type MergeKey = string;

function key(product: string, chain: string): MergeKey {
  return `${product}|||${chain}`;
}

export function normalizeData(
  security: RawTvlRow[],
  bridged: RawTvlRow[],
  receipts: RawTvlRow[]
): NormalizedData {
  const map = new Map<
    MergeKey,
    {
      product: string;
      chain: string;
      supply: number;
      nav: number;
      tvl: number;
      tokenTypes: Set<TokenType>;
      contracts: ContractInfo[];
      securityTVL: number;
      bridgedTVL: number;
      receiptTVL: number;
    }
  >();

  function upsert(rows: RawTvlRow[], type: TokenType, tvlField: "securityTVL" | "bridgedTVL" | "receiptTVL") {
    for (const row of rows) {
      const k = key(row.product, row.chain);
      let entry = map.get(k);
      if (!entry) {
        entry = {
          product: row.product,
          chain: row.chain,
          supply: 0,
          nav: 0,
          tvl: 0,
          tokenTypes: new Set(),
          contracts: [],
          securityTVL: 0,
          bridgedTVL: 0,
          receiptTVL: 0,
        };
        map.set(k, entry);
      }
      entry.supply += row.supply || 0;
      entry.nav = row.nav || entry.nav;
      entry.tvl += row.tvl || 0;
      entry.tokenTypes.add(type);
      entry[tvlField] += row.tvl || 0;
    }
  }

  upsert(security, "Security Token", "securityTVL");
  upsert(bridged, "Bridged Security Token", "bridgedTVL");
  upsert(receipts, "Receipt Token", "receiptTVL");

  const productMap = new Map<string, ChainData[]>();

  for (const entry of map.values()) {
    const chainData: ChainData = {
      chain: entry.chain,
      supply: entry.supply,
      nav: entry.nav,
      tvl: entry.tvl,
      tokenTypes: Array.from(entry.tokenTypes),
      breakdown: {
        securityTVL: entry.securityTVL,
        bridgedTVL: entry.bridgedTVL,
        receiptTVL: entry.receiptTVL,
      },
    };
    if (!productMap.has(entry.product)) {
      productMap.set(entry.product, []);
    }
    productMap.get(entry.product)!.push(chainData);
  }

  const products: ProductData[] = [];
  const allChainsSet = new Set<string>();

  for (const [product, chains] of productMap) {
    chains.sort((a, b) => b.tvl - a.tvl);
    chains.forEach((c) => allChainsSet.add(c.chain));
    products.push({
      product,
      chains,
      totalTVL: chains.reduce((s, c) => s + c.tvl, 0),
    });
  }

  products.sort((a, b) => b.totalTVL - a.totalTVL);

  return {
    products,
    allChains: Array.from(allChainsSet).sort(),
    allProducts: products.map((p) => p.product),
    totalTVL: products.reduce((s, p) => s + p.totalTVL, 0),
  };
}
