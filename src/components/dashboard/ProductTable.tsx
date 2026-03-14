import { useState } from "react";
import { ProductData } from "@/lib/tvl-types";
import { formatFullCurrency, formatNumber } from "@/lib/format";
import { getExplorerUrl } from "@/lib/explorer-urls";
import { getChainLogo } from "@/lib/chain-logos";
import { getTokenMeta } from "@/lib/token-meta";
import { ExternalLink, Copy, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface ProductTableProps {
  product: ProductData;
  chainFilter: string[];
  hideZeroBalances?: boolean;
  defaultOpen?: boolean;
}

export function ProductTable({ product, chainFilter, hideZeroBalances = false, defaultOpen = false }: ProductTableProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const copyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const filteredChains = product.chains.filter((c) => {
    if (chainFilter.length > 0 && !chainFilter.includes(c.chain)) return false;
    if (hideZeroBalances && c.tvl === 0 && c.supply === 0) return false;
    return true;
  });

  const filteredTVL = filteredChains.reduce((s, c) => s + c.tvl, 0);

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 md:p-6 hover:bg-secondary/20 transition-colors duration-150 cursor-pointer"
      >
        {/* Mobile layout */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {(() => {
                const meta = getTokenMeta(product.product);
                return meta ? (
                  <img src={meta.logo} alt={product.product} className="h-8 w-8 brightness-0 invert shrink-0" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-accent animate-pulse-glow shrink-0" />
                );
              })()}
              <div className="flex flex-col min-w-0">
                <h3 className="text-base font-semibold leading-tight">{product.product}</h3>
                {(() => {
                  const meta = getTokenMeta(product.product);
                  return meta ? (
                    <span className="text-[11px] text-muted-foreground leading-tight truncate mt-1">{meta.name}</span>
                  ) : null;
                })()}
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 pt-1">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Chains</p>
              <p className="text-sm text-money">{filteredChains.length}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Supply</p>
              <p className="text-sm text-money">{formatNumber(filteredChains.reduce((s, c) => s + c.supply, 0))}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">NAV</p>
              <p className="text-sm text-money">${(filteredChains.find(c => c.nav > 0)?.nav ?? 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">TVL</p>
              <p className="text-sm font-semibold text-accent">{formatFullCurrency(filteredTVL)}</p>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(() => {
              const meta = getTokenMeta(product.product);
              return meta ? (
                <img src={meta.logo} alt={product.product} className="h-10 w-10 brightness-0 invert" />
              ) : (
                <div className="h-3 w-3 rounded-full bg-accent animate-pulse-glow" />
              );
            })()}
            <div className="flex flex-col text-left">
              <h3 className="text-xl font-semibold leading-tight">{product.product}</h3>
              {(() => {
                const meta = getTokenMeta(product.product);
                return meta ? (
                  <span className="text-sm text-muted-foreground leading-tight mt-1">{meta.name}</span>
                ) : null;
              })()}
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Chains</p>
              <p className="text-xl text-money">{filteredChains.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Supply</p>
              <p className="text-xl text-money">{formatNumber(filteredChains.reduce((s, c) => s + c.supply, 0))}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">NAV</p>
              <p className="text-xl text-money">${(filteredChains.find(c => c.nav > 0)?.nav ?? 0).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">TVL</p>
              <p className="text-xl font-semibold text-accent">{formatFullCurrency(filteredTVL)}</p>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-border/50">
          {/* Desktop table */}
          <div className="hidden sm:block">
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
                        <div className="flex items-center gap-4">
                          {logo ? (
                            <img
                              src={logo}
                              alt={chain.chain}
                              className="h-9 w-9 rounded-full shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm text-muted-foreground font-bold shrink-0">
                              {chain.chain.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col gap-2 min-w-0">
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
                                          onClick={(e) => e.stopPropagation()}
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

          {/* Mobile card list */}
          <div className="sm:hidden divide-y divide-border/20">
            {filteredChains.map((chain) => {
              const logo = getChainLogo(chain.chain);
              return (
                <div key={chain.chain} className="px-4 py-3 space-y-2">
                  <div className="flex items-center gap-3">
                    {logo ? (
                      <img
                        src={logo}
                        alt={chain.chain}
                        className="h-7 w-7 rounded-full shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground font-bold shrink-0">
                        {chain.chain.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium flex-1">{chain.chain}</span>
                    <span className="text-sm font-semibold text-money">{formatFullCurrency(chain.tvl)}</span>
                  </div>
                  <div className="flex items-center justify-between pl-10">
                    <span className="text-xs text-muted-foreground">Supply: <span className="text-money">{formatNumber(chain.supply)}</span></span>
                    {chain.contracts && chain.contracts.length > 0 && (
                      <div className="flex items-center gap-1">
                        {chain.contracts.map((contract, idx) => {
                          const explorerUrl = getExplorerUrl(chain.chain, contract.address);
                          const isCopied = copiedAddress === contract.address;
                          const label = contract.tokenType === "Receipt Token" ? "Rcpt" : "Sec";
                          return (
                            <div key={idx} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary/80 text-[11px]">
                              {explorerUrl ? (
                                <a
                                  href={explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-0.5"
                                  title={contract.address}
                                >
                                  <span>{label}</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
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
                                  <Check className="h-2.5 w-2.5 text-accent" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredChains.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                No chains match the current filters
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}