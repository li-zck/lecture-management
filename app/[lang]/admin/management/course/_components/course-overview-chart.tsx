"use client";

import { useCourses } from "@/components/ui/hooks/use-courses";
import { useDepartments } from "@/components/ui/hooks/use-department";
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
 * Courses by department + credits distribution.
 */
export function CourseOverviewChart() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.chart;
  const { courses, loading: coursesLoading } = useCourses();
  const { departments, loading: departmentsLoading } = useDepartments();

  const byDepartmentData = useMemo(() => {
    const deptMap = new Map(
      departments.map((d) => [d.id, { id: d.id, name: d.name, count: 0 }]),
    );
    for (const c of courses) {
      const deptId = c.departmentId ?? "unassigned";
      const existing = deptMap.get(deptId);
      if (existing) {
        existing.count += 1;
      } else {
        deptMap.set(deptId, {
          id: deptId,
          name: c.department?.name ?? t.unassigned,
          count: 1,
        });
      }
    }
    return Array.from(deptMap.values())
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [courses, departments, t]);

  const creditsData = useMemo(() => {
    const byCredits = new Map<number, number>();
    for (const c of courses) {
      const cred = c.credits ?? 0;
      byCredits.set(cred, (byCredits.get(cred) ?? 0) + 1);
    }
    return Array.from(byCredits.entries())
      .map(([credits, count]) => ({ credits, count }))
      .sort((a, b) => a.credits - b.credits);
  }, [courses]);

  const loading = coursesLoading || departmentsLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.courseOverview}</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>{t.coursesByDept}</CardTitle>
          <CardDescription>{t.coursesByDeptDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byDepartmentData}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
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
                        <p className="font-medium">{d.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {d.count} {d.count === 1 ? t.course : t.courses}
                        </p>
                      </div>
                    );
                  }}
                  cursor={false}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name={t.courses}
                  className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {creditsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.creditsDistribution}</CardTitle>
            <CardDescription>{t.creditsDistDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={creditsData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  accessibilityLayer
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="credits"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12 }}
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
                          <p className="font-medium">
                            {d.credits} {t.credits}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {d.count} {d.count === 1 ? t.course : t.courses}
                          </p>
                        </div>
                      );
                    }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-2, 220 70% 50%))"
                    radius={[4, 4, 0, 0]}
                    name={t.courses}
                    className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
