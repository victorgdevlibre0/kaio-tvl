import { NormalizedData } from "@/lib/tvl-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/format";

interface TvlChartsProps {
  data: NormalizedData;
  chainFilter: string[];
}

function matchesChainFilter(chain: string, chainFilter: string[]): boolean {
  return chainFilter.length === 0 || chainFilter.includes(chain);
}

export function TvlCharts({ data, chainFilter }: TvlChartsProps) {
  // TVL by Product
  const productChartData = data.products.map((p) => {
    const filteredTVL = p.chains
      .filter((c) => matchesChainFilter(c.chain, chainFilter))
      .reduce((s, c) => s + c.tvl, 0);
    return { name: p.product, tvl: filteredTVL };
  }).filter(d => d.tvl > 0);

  // TVL by Chain
  const chainMap = new Map<string, number>();
  for (const p of data.products) {
    for (const c of p.chains) {
      if (!matchesChainFilter(c.chain, chainFilter)) continue;
      chainMap.set(c.chain, (chainMap.get(c.chain) || 0) + c.tvl);
    }
  }
  const chainChartData = Array.from(chainMap.entries())
    .map(([chain, tvl]) => ({ name: chain, tvl }))
    .sort((a, b) => b.tvl - a.tvl);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "hsl(250 18% 14% / 0.85)",
      backdropFilter: "blur(8px)",
      border: "1px solid hsl(59 100% 90% / 0.25)",
      borderRadius: "12px",
      color: "hsl(59 100% 90%)",
      fontSize: "12px",
      boxShadow: "0 4px 20px hsl(59 100% 90% / 0.08)",
      transition: "all 0.2s ease-in-out",
    },
    cursor: { fill: "hsl(59 100% 90% / 0.06)" },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-lg p-3 sm:p-5">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            TVL by RWA
          </h3>
          <span className="text-sm font-semibold text-money">
            {formatCurrency(productChartData.reduce((s, d) => s + d.tvl, 0))}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={productChartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(250 14% 20%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(240 10% 52%)", fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(240 10% 52%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => [formatCurrency(value), "TVL"]} />
            <Bar dataKey="tvl" fill="hsl(214 47% 52%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-lg p-3 sm:p-5">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            TVL by Chain
          </h3>
          <span className="text-sm font-semibold text-money">
            {formatCurrency(chainChartData.reduce((s, d) => s + d.tvl, 0))}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chainChartData} barCategoryGap="20%" margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(250 14% 20%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(240 10% 52%)", fontSize: 10 }} axisLine={false} interval={0} angle={-35} textAnchor="end" height={50} />
            <YAxis tick={{ fill: "hsl(240 10% 52%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => [formatCurrency(value), "TVL"]} />
            <Bar dataKey="tvl" fill="hsl(214 58% 79%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
