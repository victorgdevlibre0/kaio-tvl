import { Button } from "@/components/ui/button";
import { RefreshCw, X, Download, Search, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { NormalizedData } from "@/lib/tvl-types";
import { getChainLogo } from "@/lib/chain-logos";

interface DashboardFiltersProps {
  allChains: string[];
  chainFilter: string[];
  setChainFilter: (v: string[]) => void;
  hideZeroBalances: boolean;
  setHideZeroBalances: (v: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (v: boolean) => void;
  data: NormalizedData;
}

export function DashboardFilters({
  allChains,
  chainFilter,
  setChainFilter,
  hideZeroBalances,
  setHideZeroBalances,
  onRefresh,
  isRefreshing,
  autoRefresh,
  setAutoRefresh,
  data,
}: DashboardFiltersProps) {
  const [chainOpen, setChainOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chainRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (chainRef.current && !chainRef.current.contains(e.target as Node)) {
        setChainOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (chainOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [chainOpen]);

  const filteredChains = useMemo(() => {
    if (!searchQuery) return allChains;
    const q = searchQuery.toLowerCase();
    return allChains.filter((c) => c.toLowerCase().includes(q));
  }, [allChains, searchQuery]);

  const toggleChain = (chain: string) => {
    setChainFilter(
      chainFilter.includes(chain)
        ? chainFilter.filter((c) => c !== chain)
        : [...chainFilter, chain]
    );
  };

  const selectAll = () => setChainFilter([...allChains]);
  const clearAll = () => setChainFilter([]);

  const hasFilters = chainFilter.length > 0;

  const downloadContractsCsv = (data: NormalizedData, chainFilter: string[], hideZero: boolean) => {
    const rows: string[][] = [["Product", "Chain", "Symbol", "Token Type", "Address", "Supply", "TVL"]];
    for (const product of data.products) {
      for (const chain of product.chains) {
        if (chainFilter.length > 0 && !chainFilter.includes(chain.chain)) continue;
        if (hideZero && chain.tvl === 0 && chain.supply === 0) continue;
        for (const contract of chain.contracts) {
          rows.push([
            product.product,
            chain.chain,
            contract.symbol,
            contract.tokenType,
            contract.address,
            String(chain.supply),
            String(chain.tvl),
          ]);
        }
      }
    }
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kaio-contract-registry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Chain Multi-Select Dropdown */}
      <div className="relative" ref={chainRef}>
        <button
          onClick={() => setChainOpen(!chainOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground border border-border/50 hover:border-primary/30 transition-colors"
        >
          <span>Chains</span>
          {chainFilter.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {chainFilter.length}
            </span>
          )}
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${chainOpen ? "rotate-180" : ""}`} />
        </button>

        {chainOpen && (
          <div className="absolute z-50 mt-1 w-64 rounded-lg bg-card border border-border shadow-xl overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chains…"
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-secondary/50 rounded-md border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Select all / Clear */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30">
              <button
                onClick={selectAll}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Select all
              </button>
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Chain list */}
            <div className="max-h-56 overflow-y-auto p-1.5">
              {filteredChains.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3">No chains found</p>
              )}
              {filteredChains.map((chain) => {
                const logo = getChainLogo(chain);
                const isSelected = chainFilter.includes(chain);
                return (
                  <button
                    key={chain}
                    onClick={() => toggleChain(chain)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    {logo ? (
                      <img src={logo} alt={chain} className="h-5 w-5 rounded-full shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {chain.charAt(0)}
                      </div>
                    )}
                    <span className="flex-1 text-left">{chain}</span>
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border/60"
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer: selected count */}
            {chainFilter.length > 0 && (
              <div className="px-3 py-2 border-t border-border/30 text-xs text-muted-foreground">
                {chainFilter.length} of {allChains.length} selected
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active chain filter pills */}
      {chainFilter.length > 0 && chainFilter.length <= 5 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chainFilter.map((chain) => {
            const logo = getChainLogo(chain);
            return (
              <button
                key={chain}
                onClick={() => toggleChain(chain)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-xs text-foreground border border-primary/20 hover:border-primary/40 transition-colors group"
              >
                {logo ? (
                  <img src={logo} alt={chain} className="h-3.5 w-3.5 rounded-full" />
                ) : null}
                <span>{chain}</span>
                <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            );
          })}
        </div>
      )}

      {/* Clear all filters */}
      {hasFilters && chainFilter.length > 5 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" /> Clear {chainFilter.length} filters
        </button>
      )}

      {/* Hide zero balances */}
      <label className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground cursor-pointer select-none">
        <input
          type="checkbox"
          checked={hideZeroBalances}
          onChange={(e) => setHideZeroBalances(e.target.checked)}
          className="rounded border-border"
        />
        <span className="hidden sm:inline">Hide zero balances</span>
        <span className="sm:hidden">Hide zeros</span>
      </label>

      <div className="flex-1 min-w-0" />

      {/* Auto-refresh toggle */}
      <label className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
        <div
          className={`relative w-8 h-4 rounded-full transition-colors ${
            autoRefresh ? "bg-primary" : "bg-secondary"
          }`}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          <div
            className={`absolute top-0.5 h-3 w-3 rounded-full bg-foreground transition-transform ${
              autoRefresh ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
        Auto (4h)
      </label>

      {/* Refresh button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Refresh</span>
      </Button>

      {/* Download CSV */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadContractsCsv(data, chainFilter, hideZeroBalances)}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Registry CSV</span>
      </Button>
    </div>
  );
}