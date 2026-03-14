import { useState } from "react";
import { ProductData } from "@/lib/tvl-types";
import { formatFullCurrency, formatNumber } from "@/lib/format";
import { getExplorerUrl, getExplorerLabel } from "@/lib/explorer-urls";
import { getChainLogo } from "@/lib/chain-logos";
import { getTokenMeta } from "@/lib/token-meta";
import { ChevronDown, ChevronRight, ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ProductTableProps {
  product: ProductData;
  chainFilter: string[];
}

export function ProductTable({ product, chainFilter }: ProductTableProps) {
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
    return true;
  });

  const filteredTVL = filteredChains.reduce((s, c) => s + c.tvl, 0);

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          {(() => {
            const meta = getTokenMeta(product.product);
            return meta ? (
              <img src={meta.logo} alt={product.product} className="h-10 w-10 brightness-0 invert" />
            ) : (
              <div className="h-3 w-3 rounded-full bg-accent animate-pulse-glow" />
            );
          })()}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold leading-tight">{product.product}</h3>
            {(() => {
              const meta = getTokenMeta(product.product);
              return meta ? (
                <span className="text-sm text-muted-foreground leading-tight">{meta.name}</span>
              ) : null;
            })()}
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Supply</p>
            <p className="text-xl font-medium text-money">{formatNumber(filteredChains.reduce((s, c) => s + c.supply, 0))}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">NAV</p>
            <p className="text-xl font-medium text-money">${(filteredChains.find(c => c.nav > 0)?.nav ?? 0).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">TVL</p>
            <p className="text-2xl font-semibold text-accent">{formatFullCurrency(filteredTVL)}</p>
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
                  </tr>
                  {isExpanded && (
                    <tr key={`${chain.chain}-expanded`} className="bg-muted/30">
                      <td colSpan={4} className="px-10 py-4">
                         {chain.contracts && chain.contracts.length > 0 && (
                          <div>
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
                <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">
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
