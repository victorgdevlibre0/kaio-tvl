import { NormalizedData, TokenType } from "@/lib/tvl-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/format";

interface TvlChartsProps {
  data: NormalizedData;
  chainFilter: string[];
  tokenTypeFilter: string[];
}

function matchesFilters(
  chain: string,
  tokenTypes: TokenType[],
  chainFilter: string[],
  tokenTypeFilter: string[]
): boolean {
  if (chainFilter.length > 0 && !chainFilter.includes(chain)) return false;
  if (tokenTypeFilter.length > 0) {
    const combined = tokenTypes.join(" + ");
    const matches = tokenTypeFilter.some(
      (f) => tokenTypes.includes(f as TokenType) || f === combined
    );
    if (!matches) return false;
  }
  return true;
}

export function TvlCharts({ data, chainFilter, tokenTypeFilter }: TvlChartsProps) {
  // TVL by Product
  const productChartData = data.products.map((p) => {
    const filteredTVL = p.chains
      .filter((c) => matchesFilters(c.chain, c.tokenTypes, chainFilter, tokenTypeFilter))
      .reduce((s, c) => s + c.tvl, 0);
    return { name: p.product, tvl: filteredTVL };
  }).filter(d => d.tvl > 0);

  // TVL by Chain stacked
  const chainMap = new Map<string, { security: number; bridged: number; receipt: number }>();
  for (const p of data.products) {
    for (const c of p.chains) {
      if (!matchesFilters(c.chain, c.tokenTypes, chainFilter, tokenTypeFilter)) continue;
      const existing = chainMap.get(c.chain) || { security: 0, bridged: 0, receipt: 0 };
      existing.security += c.breakdown.securityTVL;
      existing.bridged += c.breakdown.bridgedTVL;
      existing.receipt += c.breakdown.receiptTVL;
      chainMap.set(c.chain, existing);
    }
  }
  const chainChartData = Array.from(chainMap.entries())
    .map(([chain, vals]) => ({ name: chain, ...vals }))
    .sort((a, b) => (b.security + b.bridged + b.receipt) - (a.security + a.bridged + a.receipt));

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
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          TVL by Product
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={productChartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => [formatCurrency(value), "TVL"]} />
            <Bar dataKey="tvl" fill="hsl(210 100% 56%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
          TVL by Chain
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chainChartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip {...tooltipStyle} formatter={(value: number, name: string) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "hsl(215 20% 55%)" }} />
            <Bar dataKey="security" stackId="a" fill="hsl(210 100% 56%)" name="Security" radius={[0, 0, 0, 0]} />
            <Bar dataKey="bridged" stackId="a" fill="hsl(168 72% 45%)" name="Bridged" />
            <Bar dataKey="receipt" stackId="a" fill="hsl(280 60% 55%)" name="Receipt" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
