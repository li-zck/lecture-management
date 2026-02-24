"use client";

import { useCourseSemesters } from "@/components/ui/hooks/use-course-semesters";
import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Lecturers over time (sign-ups per month) + workload (course-semesters per lecturer).
 */
export function LecturerOverviewChart() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.chart;
  const { lecturers, loading: lecturersLoading } = useLecturers();
  const { courseSemesters, loading: courseSemestersLoading } =
    useCourseSemesters();

  const overTimeData = useMemo(() => {
    const byMonth = new Map<string, number>();
    for (const l of lecturers) {
      if (!l.createdAt) continue;
      const d = new Date(l.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    }
    return Array.from(byMonth.entries())
      .map(([month, count]) => ({ month, lecturers: count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }, [lecturers]);

  const workloadData = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const cs of courseSemesters) {
      const lid = cs.lecturerId ?? "unassigned";
      const name =
        cs.lecturer?.fullName ?? cs.lecturer?.lecturerId ?? t.unassigned;
      const existing = map.get(lid);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(lid, { id: lid, name, count: 1 });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [courseSemesters, t]);

  const loading = lecturersLoading || courseSemestersLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.lecturerOverview}</CardTitle>
          <CardDescription>{t.loading}</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center text-muted-foreground">
          {t.loadingShort}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {overTimeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.lecturersOverTime}</CardTitle>
            <CardDescription>{t.newLecturersPerMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overTimeData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  accessibilityLayer
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
                          <p className="font-medium">{d.month}</p>
                          <p className="text-sm text-muted-foreground">
                            {d.lecturers}{" "}
                            {d.lecturers === 1 ? t.newLecturer : t.newLecturers}
                          </p>
                        </div>
                      );
                    }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="lecturers"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name={t.newLecturers}
                    className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.workloadPerLecturer}</CardTitle>
          <CardDescription>{t.workloadPerLecturerDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            {workloadData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workloadData}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  accessibilityLayer
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
                          <p className="font-medium">{d.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {d.count} {d.count === 1 ? t.schedule : t.schedules}
                          </p>
                        </div>
                      );
                    }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-2, 220 70% 50%))"
                    radius={[0, 4, 4, 0]}
                    name={t.schedules}
                    className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                {t.noScheduledCourses}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
