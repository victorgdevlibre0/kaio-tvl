import { useQuery } from "@tanstack/react-query";
import { RawTvlRow } from "@/lib/tvl-types";
import { normalizeData } from "@/lib/tvl-normalize";

const BASE = "https://api.l1-prod.librecapital.com/api/v1/tvl";

async function fetchEndpoint(url: string): Promise<RawTvlRow[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

export function useTvlData(enabled = true) {
  return useQuery({
    queryKey: ["tvl-data"],
    queryFn: async () => {
      const results = await Promise.allSettled([
        fetchEndpoint(BASE),
        fetchEndpoint(`${BASE}/bridged`),
        fetchEndpoint(`${BASE}/receipts`),
      ]);

      const security = results[0].status === "fulfilled" ? results[0].value : [];
      const bridged = results[1].status === "fulfilled" ? results[1].value : [];
      const receipts = results[2].status === "fulfilled" ? results[2].value : [];

      const errors = results
        .map((r, i) => (r.status === "rejected" ? ["security", "bridged", "receipts"][i] : null))
        .filter(Boolean);

      return {
        data: normalizeData(security, bridged, receipts),
        errors,
      };
    },
    enabled,
    staleTime: 4 * 60 * 60 * 1000,
    refetchInterval: false,
  });
}
