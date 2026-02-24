"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";

type AdminChartCardProps = {
  title: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminChartCard({
  title,
  description,
  loading = false,
  empty = false,
  emptyMessage,
  children,
  className,
}: AdminChartCardProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            {dict.admin.chart.loading}
          </div>
        ) : empty ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            {emptyMessage ?? dict.admin.chart.noData}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
