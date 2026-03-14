import { useState } from "react";
import { ProductData, TokenType } from "@/lib/tvl-types";
import { formatFullCurrency, formatNumber } from "@/lib/format";
import { getExplorerUrl, getExplorerLabel } from "@/lib/explorer-urls";
import { getChainLogo } from "@/lib/chain-logos";
import { getTokenMeta } from "@/lib/token-meta";
import { ChevronDown, ChevronRight, ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ProductTableProps {
  product: ProductData;
  chainFilter: string[];
  tokenTypeFilter: string[];
}

export function ProductTable({ product, chainFilter, tokenTypeFilter }: ProductTableProps) {
  const [expandedChains, setExpandedChains] = useState<Set<string>>(new Set());
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const toggleChain = (chain: string) => {
    setExpandedChains((prev) => {
      const next = new Set(prev);
      if (next.has(chain)) next.delete(chain);
      else next.add(chain);
      return next;
    });
  };

  const copyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopiedAddress(null), 2000);
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
          {(() => {
            const meta = getTokenMeta(product.product);
            return meta ? (
              <img src={meta.logo} alt={product.product} className="h-8 w-8 brightness-0 invert" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
            );
          })()}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold leading-tight">{product.product}</h3>
            {(() => {
              const meta = getTokenMeta(product.product);
              return meta ? (
                <span className="text-xs text-muted-foreground leading-tight">{meta.name}</span>
              ) : null;
            })()}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Supply</p>
            <p className="text-sm font-medium text-money">{formatNumber(filteredChains.reduce((s, c) => s + c.supply, 0))}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">NAV</p>
            <p className="text-sm font-medium text-money">{formatFullCurrency(filteredChains.reduce((s, c) => s + c.nav, 0))}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">TVL</p>
            <p className="text-sm font-semibold text-accent">{formatFullCurrency(filteredTVL)}</p>
          </div>
        </div>
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
              const logo = getChainLogo(chain.chain);
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
                    <td className="px-5 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        {logo ? (
                          <img
                            src={logo}
                            alt={chain.chain}
                            className="h-5 w-5 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                            {chain.chain.charAt(0)}
                          </div>
                        )}
                        {chain.chain}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-money">{formatNumber(chain.supply)}</td>
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
                      <td colSpan={5} className="px-10 py-4">
                        <div className="grid grid-cols-3 gap-6 mb-4">
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
                        {chain.contracts && chain.contracts.length > 0 && (
                          <div className="border-t border-border/30 pt-3">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                              Contract Addresses
                            </p>
                            <div className="space-y-1.5">
                              {chain.contracts.map((contract, idx) => {
                                const explorerUrl = getExplorerUrl(chain.chain, contract.address);
                                const truncated = contract.address.length > 16
                                  ? `${contract.address.slice(0, 8)}…${contract.address.slice(-6)}`
                                  : contract.address;
                                const isCopied = copiedAddress === contract.address;
                                return (
                                  <div key={idx} className="flex items-center gap-2 text-xs">
                                    <span className="inline-block px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground min-w-[100px]">
                                      {contract.tokenType.replace(" Token", "")}
                                    </span>
                                    {explorerUrl ? (
                                      <a
                                        href={explorerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="font-mono text-accent hover:underline inline-flex items-center gap-1"
                                      >
                                        {truncated}
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    ) : (
                                      <span className="font-mono text-foreground">{truncated}</span>
                                    )}
                                    <button
                                      onClick={(e) => copyAddress(contract.address, e)}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                      title="Copy address"
                                    >
                                      {isCopied ? (
                                        <Check className="h-3 w-3 text-accent" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filteredChains.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground text-sm">
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
