import { useState } from "react";
import { ProductData, TokenType } from "@/lib/tvl-types";
import { formatFullCurrency, formatNumber } from "@/lib/format";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ProductTableProps {
  product: ProductData;
  chainFilter: string[];
  tokenTypeFilter: string[];
}

export function ProductTable({ product, chainFilter, tokenTypeFilter }: ProductTableProps) {
  const [expandedChains, setExpandedChains] = useState<Set<string>>(new Set());

  const toggleChain = (chain: string) => {
    setExpandedChains((prev) => {
      const next = new Set(prev);
      if (next.has(chain)) next.delete(chain);
      else next.add(chain);
      return next;
    });
  };

  const filteredChains = product.chains.filter((c) => {
    if (chainFilter.length > 0 && !chainFilter.includes(c.chain)) return false;
    if (tokenTypeFilter.length > 0) {
      const combined = c.tokenTypes.join(" + ");
      const matches = tokenTypeFilter.some(
        (f) => c.tokenTypes.includes(f as TokenType) || f === combined
      );
      if (!matches) return false;
    }
    return true;
  });

  const filteredTVL = filteredChains.reduce((s, c) => s + c.tvl, 0);

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
          <h3 className="text-lg font-semibold">{product.product}</h3>
        </div>
        <span className="text-money text-accent font-semibold">
          {formatFullCurrency(filteredTVL)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground px-5 py-3 w-8" />
              <th className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground px-5 py-3">
                Chain
              </th>
              <th className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground px-5 py-3">
                Supply
              </th>
              <th className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground px-5 py-3">
                NAV
              </th>
              <th className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground px-5 py-3">
                TVL On Chain
              </th>
              <th className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground px-5 py-3">
                Token Type
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredChains.map((chain) => {
              const isExpanded = expandedChains.has(chain.chain);
              return (
                <>
                  <tr
                    key={chain.chain}
                    className="border-b border-border/20 hover:bg-secondary/30 cursor-pointer transition-colors duration-150"
                    onClick={() => toggleChain(chain.chain)}
                  >
                    <td className="px-5 py-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium">{chain.chain}</td>
                    <td className="px-5 py-3 text-right text-money">{formatNumber(chain.supply)}</td>
                    <td className="px-5 py-3 text-right text-money">{formatFullCurrency(chain.nav)}</td>
                    <td className="px-5 py-3 text-right text-money font-semibold">
                      {formatFullCurrency(chain.tvl)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {chain.tokenTypes.map((tt) => (
                          <span
                            key={tt}
                            className="inline-block text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tt}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${chain.chain}-expanded`} className="bg-muted/30">
                      <td colSpan={6} className="px-10 py-4">
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                              Security TVL
                            </p>
                            <p className="text-money font-semibold" style={{ color: "hsl(210 100% 56%)" }}>
                              {formatFullCurrency(chain.breakdown.securityTVL)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                              Bridged TVL
                            </p>
                            <p className="text-money font-semibold" style={{ color: "hsl(168 72% 45%)" }}>
                              {formatFullCurrency(chain.breakdown.bridgedTVL)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                              Receipt TVL
                            </p>
                            <p className="text-money font-semibold" style={{ color: "hsl(280 60% 55%)" }}>
                              {formatFullCurrency(chain.breakdown.receiptTVL)}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filteredChains.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-sm">
                  No chains match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
