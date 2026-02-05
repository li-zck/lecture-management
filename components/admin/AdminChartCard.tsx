"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";

type AdminChartCardProps = {
  title: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Reusable card wrapper for admin chart/section with consistent loading and empty states.
 */
export function AdminChartCard({
  title,
  description,
  loading = false,
  empty = false,
  emptyMessage = "No data to display",
  children,
  className,
}: AdminChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Loading chart data...
          </div>
        ) : empty ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
