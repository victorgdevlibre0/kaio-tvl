import { useState } from "react";
import { ProductData } from "@/lib/tvl-types";
import { formatFullCurrency, formatNumber } from "@/lib/format";
import { getExplorerUrl } from "@/lib/explorer-urls";
import { getChainLogo } from "@/lib/chain-logos";
import { getTokenMeta } from "@/lib/token-meta";
import { ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ProductTableProps {
  product: ProductData;
  chainFilter: string[];
}

export function ProductTable({ product, chainFilter }: ProductTableProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Chains</p>
            <p className="text-xl font-semibold text-money">{filteredChains.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Supply</p>
            <p className="text-xl font-semibold text-money">{formatNumber(filteredChains.reduce((s, c) => s + c.supply, 0))}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">NAV</p>
            <p className="text-xl font-semibold text-money">${(filteredChains.find(c => c.nav > 0)?.nav ?? 0).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">TVL</p>
            <p className="text-xl font-semibold text-accent">{formatFullCurrency(filteredTVL)}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
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
              const logo = getChainLogo(chain.chain);
              return (
                <tr
                  key={chain.chain}
                  className="border-b border-border/20 hover:bg-secondary/30 transition-colors duration-150"
                >
                  <td className="px-5 py-3 font-medium">
                    <div className="flex items-start gap-2.5">
                      {logo ? (
                        <img
                          src={logo}
                          alt={chain.chain}
                          className="h-5 w-5 rounded-full mt-0.5 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground font-bold mt-0.5 shrink-0">
                          {chain.chain.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <span className="text-base leading-tight">{chain.chain}</span>
                        {chain.contracts && chain.contracts.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            {chain.contracts.map((contract, idx) => {
                              const explorerUrl = getExplorerUrl(chain.chain, contract.address);
                              const isCopied = copiedAddress === contract.address;
                              const label = contract.tokenType === "Receipt Token" ? "Receipt" : "Security";
                              return (
                                <div key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/80 text-xs">
                                  {explorerUrl ? (
                                    <a
                                      href={explorerUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
                                      title={contract.address}
                                    >
                                      <span>{label}</span>
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    <span className="text-muted-foreground">{label}</span>
                                  )}
                                  <button
                                    onClick={(e) => copyAddress(contract.address, e)}
                                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
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
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-money">{formatNumber(chain.supply)}</td>
                  <td className="px-5 py-3 text-right text-money font-semibold">
                    {formatFullCurrency(chain.tvl)}
                  </td>
                </tr>
              );
            })}
            {filteredChains.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground text-sm">
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
