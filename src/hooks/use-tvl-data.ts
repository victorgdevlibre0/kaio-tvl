import { useQuery } from "@tanstack/react-query";
import { NormalizedData, ProductData, ChainData, TokenType, ContractInfo } from "@/lib/tvl-types";

const BASE = "https://api.l1-prod.librecapital.com/api/v1/tvl";

interface MainAsset {
  symbol: string;
  instrumentId: string;
  latestNav: number;
  securitySupply: number;
  securityTvl: number;
  bridgedSupply: number;
  bridgedTvl: number;
  receiptsSupply: number;
  receiptsTvl: number;
  totalSupply: number;
  tvl: number;
}

interface ChainAsset {
  symbol: string;
  instrumentId: string;
  latestNav: number | null;
  totalSupply: number;
  tvl: number;
}

interface ChainEntry {
  chain: string;
  tvl: number;
  assets: ChainAsset[];
}

interface MainResponse {
  tvl: number;
  assets: MainAsset[];
}

interface ChainResponse {
  tvl: number;
  chains: ChainEntry[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

function normalize(
  main: MainResponse | null,
  bridged: ChainResponse | null,
  receipts: ChainResponse | null
): NormalizedData {
  // Build instrumentId → product name mapping from main endpoint
  const idToProduct = new Map<string, string>();
  if (main) {
    for (const asset of main.assets) {
      idToProduct.set(asset.instrumentId, asset.symbol);
    }
  }

  // Key: product|||chain
  const map = new Map<string, {
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
  }>();

  function getOrCreate(product: string, chain: string) {
    const k = `${product}|||${chain}`;
    let entry = map.get(k);
    if (!entry) {
      entry = { product, chain, supply: 0, nav: 0, tvl: 0, tokenTypes: new Set(), contracts: [], securityTVL: 0, bridgedTVL: 0, receiptTVL: 0 };
      map.set(k, entry);
    }
    return entry;
  }

  // Process main /tvl (security tokens on Ethereum)
  if (main) {
    for (const asset of main.assets) {
      const entry = getOrCreate(asset.symbol, "Ethereum");
      entry.supply += asset.securitySupply || 0;
      entry.nav = asset.latestNav || 0;
      entry.tvl += asset.securityTvl || 0;
      entry.securityTVL += asset.securityTvl || 0;
      if (asset.securityTvl > 0 || asset.securitySupply > 0) {
        entry.tokenTypes.add("Security Token");
      }
      if (asset.address) {
        entry.contracts.push({ address: asset.address, symbol: asset.symbol, tokenType: "Security Token" });
      }
    }
  }

  // Process bridged chains
  if (bridged) {
    for (const chainEntry of bridged.chains) {
      for (const asset of chainEntry.assets) {
        const productName = idToProduct.get(asset.instrumentId) || asset.symbol;
        const entry = getOrCreate(productName, chainEntry.chain);
        entry.supply += asset.totalSupply || 0;
        entry.nav = asset.latestNav || entry.nav || 0;
        entry.tvl += asset.tvl || 0;
        entry.bridgedTVL += asset.tvl || 0;
        if (asset.tvl > 0 || asset.totalSupply > 0) {
          entry.tokenTypes.add("Bridged Security Token");
        }
        if (asset.address) {
          entry.contracts.push({ address: asset.address, symbol: asset.symbol, tokenType: "Bridged Security Token" });
        }
      }
    }
  }

  // Process receipts chains
  if (receipts) {
    for (const chainEntry of receipts.chains) {
      for (const asset of chainEntry.assets) {
        const productName = idToProduct.get(asset.instrumentId) || asset.symbol;
        const entry = getOrCreate(productName, chainEntry.chain);
        entry.supply += asset.totalSupply || 0;
        entry.nav = asset.latestNav || entry.nav || 0;
        entry.tvl += asset.tvl || 0;
        entry.receiptTVL += asset.tvl || 0;
        if (asset.tvl > 0 || asset.totalSupply > 0) {
          entry.tokenTypes.add("Receipt Token");
        }
        if (asset.address) {
          entry.contracts.push({ address: asset.address, symbol: asset.symbol, tokenType: "Receipt Token" });
        }
      }
    }
  }

  // Group by product
  const productMap = new Map<string, ChainData[]>();
  for (const entry of map.values()) {
    // Skip entries with no meaningful data
    const types = Array.from(entry.tokenTypes);
    if (types.length === 0 && entry.tvl === 0 && entry.supply === 0) continue;

    const chainData: ChainData = {
      chain: entry.chain,
      supply: entry.supply,
      nav: entry.nav,
      tvl: entry.tvl,
      tokenTypes: types.length > 0 ? types : ["Security Token"],
      breakdown: {
        securityTVL: entry.securityTVL,
        bridgedTVL: entry.bridgedTVL,
        receiptTVL: entry.receiptTVL,
      },
    };
    if (!productMap.has(entry.product)) productMap.set(entry.product, []);
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

export function useTvlData(enabled = true) {
  return useQuery({
    queryKey: ["tvl-data"],
    queryFn: async () => {
      const results = await Promise.allSettled([
        fetchJson<MainResponse>(BASE),
        fetchJson<ChainResponse>(`${BASE}/bridged`),
        fetchJson<ChainResponse>(`${BASE}/receipts`),
      ]);

      const main = results[0].status === "fulfilled" ? results[0].value : null;
      const bridged = results[1].status === "fulfilled" ? results[1].value : null;
      const receipts = results[2].status === "fulfilled" ? results[2].value : null;

      const errors = results
        .map((r, i) => (r.status === "rejected" ? ["security", "bridged", "receipts"][i] : null))
        .filter(Boolean);

      return {
        data: normalize(main, bridged, receipts),
        errors,
      };
    },
    enabled,
    staleTime: 4 * 60 * 60 * 1000,
  });
}
