import { useState, useEffect, useCallback, useMemo } from "react";
import kaioLogo from "@/assets/kaio-logo.svg";
import { useTvlData } from "@/hooks/use-tvl-data";
import { GlobalSummary } from "@/components/dashboard/GlobalSummary";
import { TvlCharts } from "@/components/dashboard/TvlCharts";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { isProductVisible, RwaCategory } from "@/lib/product-categories";
import { Loader2, AlertTriangle } from "lucide-react";
import { NormalizedData } from "@/lib/tvl-types";

const Index = () => {
  const [chainFilter, setChainFilter] = useState<string[]>([]);
  const [rwaCategory, setRwaCategory] = useState<RwaCategory>("production");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [hideZeroBalances, setHideZeroBalances] = useState(false);

  const { data: result, isLoading, isError, error, refetch, isFetching } = useTvlData();

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => refetch(), 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Filter data by RWA category
  const filteredData = useMemo<NormalizedData | null>(() => {
    if (!result?.data) return null;
    const data = result.data;
    const products = data.products.filter((p) => isProductVisible(p.product, rwaCategory));
    const allChainsSet = new Set<string>();
    products.forEach((p) => p.chains.forEach((c) => allChainsSet.add(c.chain)));
    return {
      products,
      allChains: Array.from(allChainsSet).sort(),
      allProducts: products.map((p) => p.product),
      totalTVL: products.reduce((s, p) => s + p.totalTVL, 0),
    };
  }, [result?.data, rwaCategory]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading TVL data…</p>
        </div>
      </div>
    );
  }

  if (isError || !result || !filteredData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card rounded-lg p-8 max-w-md text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">Failed to load data</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { errors } = result;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <img src={kaioLogo} alt="KAIO" className="h-10" />
          {isFetching && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground absolute right-6" />}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {errors && errors.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Partial data: failed to load {errors.join(", ")} endpoint{errors.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <GlobalSummary data={filteredData} />

        <DashboardFilters
          allChains={filteredData.allChains}
          chainFilter={chainFilter}
          setChainFilter={setChainFilter}
          rwaCategory={rwaCategory}
          setRwaCategory={setRwaCategory}
          hideZeroBalances={hideZeroBalances}
          setHideZeroBalances={setHideZeroBalances}
          onRefresh={handleRefresh}
          isRefreshing={isFetching}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
        />

        <TvlCharts data={filteredData} chainFilter={chainFilter} />

        <div className="space-y-6">
          {filteredData.products.map((product, idx) => (
            <ProductTable
              key={product.product}
              product={product}
              chainFilter={chainFilter}
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
