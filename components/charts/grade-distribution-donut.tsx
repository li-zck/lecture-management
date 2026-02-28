"use client";

import {
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

export interface GradeDistributionSegment {
  name: string;
  value: number;
  color?: string;
}

/** Use theme chart colors (oklch) so light/dark both look correct. 6 colors for A/B/C/D/F/No grade. */
const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

interface GradeDistributionDonutProps {
  data: GradeDistributionSegment[];
  /** Total count shown in center (e.g. total students) */
  totalLabel?: string;
  totalValue?: number;
  /** Height of the chart container */
  height?: number;
  /** Inner radius for donut hole (default 60%) */
  innerRadiusRatio?: number;
}

/**
 * Reusable donut chart with optional center text.
 * Uses Recharts; suitable for grade distribution, enrollment by status, etc.
 */
export function GradeDistributionDonut({
  data,
  totalLabel,
  totalValue,
  height = 240,
  innerRadiusRatio = 0.6,
}: GradeDistributionDonutProps) {
  const total = totalValue ?? data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground text-sm"
        style={{ height }}
      >
        No data to display
      </div>
    );
  }

  const chartData = data.map((d, i) => ({
    ...d,
    color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  }));

  return (
    <div className="flex flex-col gap-4" style={{ width: "100%" }}>
      <div style={{ width: "100%", height }} className="min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={`${innerRadiusRatio * 50}%`}
              outerRadius="80%"
              paddingAngle={2}
              stroke="var(--background)"
              strokeWidth={2}
              shape={(props) => (
                <Sector
                  {...props}
                  fill={
                    (props.payload as { color?: string })?.color ?? props.fill
                  }
                  stroke="var(--background)"
                  strokeWidth={2}
                />
              )}
            >
              {(totalLabel != null || totalValue != null) && (
                <Label
                  content={({ viewBox }) => {
                    const vb = viewBox as
                      | { cx?: number; cy?: number }
                      | undefined;
                    if (
                      !vb ||
                      typeof vb.cx !== "number" ||
                      typeof vb.cy !== "number"
                    )
                      return null;
                    return (
                      <text
                        x={vb.cx}
                        y={vb.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={vb.cx}
                          dy="-0.2em"
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total}
                        </tspan>
                        {totalLabel && (
                          <tspan
                            x={vb.cx}
                            dy="1.4em"
                            className="fill-muted-foreground text-xs"
                          >
                            {totalLabel}
                          </tspan>
                        )}
                      </text>
                    );
                  }}
                />
              )}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
                    <p className="font-medium">{d.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.value} ({pct}%)
                    </p>
                  </div>
                );
              }}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend so breakdown is clear even when one segment dominates */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
        {chartData.map((d) => (
          <div
            key={d.name}
            className="flex items-center gap-2"
            title={`${d.name}: ${d.value}`}
          >
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: d.color }}
              aria-hidden
            />
            <span className="text-muted-foreground">
              {d.name}:{" "}
              <span className="font-medium text-foreground">{d.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
