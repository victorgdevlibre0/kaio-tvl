import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";


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
}: DashboardFiltersProps) {
  const [chainOpen, setChainOpen] = useState(false);
  const chainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (chainRef.current && !chainRef.current.contains(e.target as Node)) {
        setChainOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleChain = (chain: string) => {
    setChainFilter(
      chainFilter.includes(chain)
        ? chainFilter.filter((c) => c !== chain)
        : [...chainFilter, chain]
    );
  };

  const hasFilters = chainFilter.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Chain Filter */}
      <div className="relative" ref={chainRef}>
        <button
          onClick={() => setChainOpen(!chainOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground border border-border/50 hover:border-primary/30 transition-colors"
        >
          Chains
          {chainFilter.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {chainFilter.length}
            </span>
          )}
        </button>
        {chainOpen && (
          <div className="absolute z-50 mt-1 w-56 rounded-lg bg-card border border-border shadow-lg p-2 max-h-64 overflow-y-auto">
            {allChains.map((chain) => (
              <label
                key={chain}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary/50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={chainFilter.includes(chain)}
                  onChange={() => toggleChain(chain)}
                  className="rounded border-border"
                />
                {chain}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Hide zero balances */}
      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
        <input
          type="checkbox"
          checked={hideZeroBalances}
          onChange={(e) => setHideZeroBalances(e.target.checked)}
          className="rounded border-border"
        />
        Hide zero balances
      </label>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => {
            setChainFilter([]);
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      )}

      <div className="flex-1" />

      {/* Auto-refresh toggle */}
      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
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
        className="gap-2"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
