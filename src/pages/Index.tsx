import { useState, useEffect, useCallback, useMemo } from "react";
import kaioLogo from "@/assets/kaio-logo.svg";
import { useTvlData } from "@/hooks/use-tvl-data";
import { GlobalSummary } from "@/components/dashboard/GlobalSummary";
import { TvlCharts } from "@/components/dashboard/TvlCharts";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { LegalDrawer } from "@/components/dashboard/LegalDrawer";
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
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <img
              src={kaioLogo}
              alt="KAIO"
              className="h-16 animate-pulse"
            />
            <div className="absolute -inset-4 rounded-full border-2 border-primary/20 animate-[spin_3s_linear_infinite]" />
            <div className="absolute -inset-4 rounded-full border-t-2 border-primary animate-[spin_1.5s_linear_infinite]" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading TVL data…</p>
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
      <header className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <img src={kaioLogo} alt="KAIO" className="h-10 sm:h-14" />
          {isFetching && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground absolute right-4 sm:right-6" />}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 bg-surface/50 sm:rounded-2xl sm:my-2 sm:border sm:border-border/30">
        {errors && errors.length > 0 && (
          <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <div>
                <span className="font-medium">Some data is unavailable</span>
                <span className="text-destructive/70"> — The {errors.join(", ")} endpoint{errors.length > 1 ? "s are" : " is"} currently down. Data has been hidden to avoid displaying incomplete information.</span>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="shrink-0 px-3 py-1 rounded-md bg-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/30 transition-colors disabled:opacity-50"
            >
              {isFetching ? "Retrying…" : "Retry"}
            </button>
          </div>
        )}

        <GlobalSummary data={filteredData} errors={errors} />

        <DashboardFilters
          allChains={filteredData.allChains}
          chainFilter={chainFilter}
          setChainFilter={setChainFilter}
          hideZeroBalances={hideZeroBalances}
          setHideZeroBalances={setHideZeroBalances}
          onRefresh={handleRefresh}
          isRefreshing={isFetching}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          data={filteredData}
        />

        <TvlCharts data={filteredData} chainFilter={chainFilter} errors={errors} />

        <div className="space-y-6">
          {errors && errors.length > 0 ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <AlertTriangle className="h-6 w-6 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground/60">Product data hidden due to endpoint errors</p>
            </div>
          ) : (
            filteredData.products.map((product) => (
              <ProductTable
                key={product.product}
                product={product}
                chainFilter={chainFilter}
                hideZeroBalances={hideZeroBalances}
                defaultOpen={false}
              />
            ))
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-6 mt-4">
        <p className="text-[11px] leading-relaxed text-muted-foreground/50 text-center">
          KAIO Explorer is a technology interface operated by the KAIO Foundation. This Platform does not constitute an offer, solicitation, or recommendation to invest in any fund or financial product.
          KAIO operates solely as a tokenization service provider.{" "}
          <LegalDrawer>
            <button className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Read full disclaimer
            </button>
          </LegalDrawer>
        </p>
      </footer>
    </div>
  );
};

export default Index;
