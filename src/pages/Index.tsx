import { useState, useEffect, useCallback } from "react";
import { useTvlData } from "@/hooks/use-tvl-data";
import { GlobalSummary } from "@/components/dashboard/GlobalSummary";
import { TvlCharts } from "@/components/dashboard/TvlCharts";
import { ProductTable } from "@/components/dashboard/ProductTable";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { Loader2, AlertTriangle } from "lucide-react";

const Index = () => {
  const [chainFilter, setChainFilter] = useState<string[]>([]);
  const [tokenTypeFilter, setTokenTypeFilter] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data: result, isLoading, isError, error, refetch, isFetching } = useTvlData();

  // Auto-refresh every 4 hours
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => refetch(), 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

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

  if (isError || !result) {
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

  const { data, errors } = result;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">KAIO</span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
              Analytics
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isFetching && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>TVL Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* API warnings */}
        {errors && errors.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Partial data: failed to load {errors.join(", ")} endpoint{errors.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Global Summary */}
        <GlobalSummary data={data} />

        {/* Filters */}
        <DashboardFilters
          allChains={data.allChains}
          chainFilter={chainFilter}
          setChainFilter={setChainFilter}
          tokenTypeFilter={tokenTypeFilter}
          setTokenTypeFilter={setTokenTypeFilter}
          onRefresh={handleRefresh}
          isRefreshing={isFetching}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
        />

        {/* Charts */}
        <TvlCharts data={data} chainFilter={chainFilter} tokenTypeFilter={tokenTypeFilter} />

        {/* Product Sections */}
        <div className="space-y-6">
          {data.products.map((product) => (
            <ProductTable
              key={product.product}
              product={product}
              chainFilter={chainFilter}
              tokenTypeFilter={tokenTypeFilter}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
