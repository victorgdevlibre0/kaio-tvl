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
      backgroundColor: "hsl(240 20% 13%)",
      border: "1px solid hsl(228 18% 20%)",
      borderRadius: "8px",
      color: "hsl(0 0% 96%)",
      fontSize: "12px",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-lg p-3 sm:p-5">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          TVL by RWA
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={productChartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 18% 20%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(228 12% 50%)", fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(228 12% 50%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => [formatCurrency(value), "TVL"]} />
            <Bar dataKey="tvl" fill="hsl(214 47% 52%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          TVL by Chain
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chainChartData} barCategoryGap="20%" margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 18% 20%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(228 12% 50%)", fontSize: 10 }} axisLine={false} interval={0} angle={-35} textAnchor="end" height={50} />
            <YAxis tick={{ fill: "hsl(228 12% 50%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => [formatCurrency(value), "TVL"]} />
            <Bar dataKey="tvl" fill="hsl(214 58% 79%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
