import { NormalizedData } from "@/lib/tvl-types";
import { formatCurrency } from "@/lib/format";
import { DollarSign, Layers, Link, BarChart3 } from "lucide-react";

interface GlobalSummaryProps {
  data: NormalizedData;
}

const kpiCards = [
  { label: "Total TVL", icon: DollarSign, getValue: (d: NormalizedData) => formatCurrency(d.totalTVL), accent: true },
  { label: "RWAs", icon: Layers, getValue: (d: NormalizedData) => String(d.allProducts.length), accent: false },
  { label: "Chains", icon: Link, getValue: (d: NormalizedData) => String(d.allChains.length), accent: false },
  { label: "Avg TVL / RWA", icon: BarChart3, getValue: (d: NormalizedData) => formatCurrency(d.totalTVL / (d.allProducts.length || 1)), accent: false },
];

export function GlobalSummary({ data }: GlobalSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="glass-card rounded-lg p-5 transition-all duration-200 hover:border-primary/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </span>
            </div>
            <p className={`text-2xl lg:text-3xl font-semibold ${kpi.accent ? "text-accent" : "text-money"}`}>
              {kpi.getValue(data)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
