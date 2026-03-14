import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { RwaCategory } from "@/lib/product-categories";

interface DashboardFiltersProps {
  allChains: string[];
  chainFilter: string[];
  setChainFilter: (v: string[]) => void;
  rwaCategory: RwaCategory;
  setRwaCategory: (v: RwaCategory) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (v: boolean) => void;
}

const TOKEN_TYPE_OPTIONS = [
  "Security Token",
  "Bridged Security Token",
  "Receipt Token",
];

const RWA_CATEGORY_OPTIONS: { value: RwaCategory; label: string }[] = [
  { value: "production", label: "Production RWAs" },
  { value: "test", label: "Test RWAs" },
  { value: "all", label: "All" },
];

export function DashboardFilters({
  allChains,
  chainFilter,
  setChainFilter,
  tokenTypeFilter,
  setTokenTypeFilter,
  rwaCategory,
  setRwaCategory,
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

  const toggleTokenType = (tt: string) => {
    setTokenTypeFilter(
      tokenTypeFilter.includes(tt)
        ? tokenTypeFilter.filter((t) => t !== tt)
        : [...tokenTypeFilter, tt]
    );
  };

  const hasFilters = chainFilter.length > 0 || tokenTypeFilter.length > 0 || rwaCategory !== "production";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* RWA Category Filter */}
      <div className="flex items-center gap-1 rounded-lg bg-secondary/50 p-0.5">
        {RWA_CATEGORY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRwaCategory(opt.value)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              rwaCategory === opt.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

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

      {/* Token Type Filter */}
      <div className="flex items-center gap-1.5">
        {TOKEN_TYPE_OPTIONS.map((tt) => (
          <button
            key={tt}
            onClick={() => toggleTokenType(tt)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              tokenTypeFilter.includes(tt)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-secondary-foreground border-border/50 hover:border-primary/30"
            }`}
          >
            {tt}
          </button>
        ))}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => {
            setChainFilter([]);
            setTokenTypeFilter([]);
            setRwaCategory("production");
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
