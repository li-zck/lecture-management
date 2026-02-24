"use client";

import { useEnrollments } from "@/components/ui/hooks/use-enrollments";
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
 * Enrollments overview: total, per semester, per course (top N) + grade summary (aggregate histogram).
 */
export function EnrollmentOverviewChart() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.chart;
  const { enrollments, loading } = useEnrollments();

  const bySemesterData = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    for (const e of enrollments) {
      const sid = e.courseOnSemester?.semester?.id ?? "unknown";
      const name = e.courseOnSemester?.semester?.name ?? "Unknown";
      const existing = map.get(sid);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(sid, { name, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [enrollments]);

  const byCourseData = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    for (const e of enrollments) {
      const cos = e.courseOnSemester;
      const id = cos?.id ?? "unknown";
      const label = cos
        ? `${cos.course?.name ?? t.course} (${cos.semester?.name ?? ""})`
        : t.unassigned;
      const existing = map.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(id, { name: label, count: 1 });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [enrollments, t]);

  const gradeDistribution = useMemo(() => {
    const buckets: Record<string, number> = {
      [t.noGrade]: 0,
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4+": 0,
    };
    for (const e of enrollments) {
      const g = e.finalGrade;
      if (g == null) {
        buckets[t.noGrade] += 1;
      } else if (g < 1) {
        buckets["0-1"] += 1;
      } else if (g < 2) {
        buckets["1-2"] += 1;
      } else if (g < 3) {
        buckets["2-3"] += 1;
      } else if (g < 4) {
        buckets["3-4"] += 1;
      } else {
        buckets["4+"] += 1;
      }
    }
    return Object.entries(buckets).map(([grade, count]) => ({
      grade,
      count,
    }));
  }, [enrollments, t.noGrade]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.enrollmentOverview}</CardTitle>
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t.totalEnrollments}</CardTitle>
            <CardDescription>{t.studentsEnrolled}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{enrollments.length}</p>
          </CardContent>
        </Card>
      </div>

      {bySemesterData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.enrollmentsPerSemester}</CardTitle>
            <CardDescription>{t.enrollmentsBySemesterDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bySemesterData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  accessibilityLayer
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
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
                          <p className="font-medium">{d.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {d.count}{" "}
                            {d.count === 1 ? t.enrollment : t.enrollments}
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
                    name={t.enrollments}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {byCourseData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.topCoursesByEnrollment}</CardTitle>
            <CardDescription>{t.topCoursesDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byCourseData}
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
                    width={160}
                    tick={{ fontSize: 10 }}
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
                            {d.count} {t.enrolled}
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
                    name={t.enrolled}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.gradeSummary}</CardTitle>
          <CardDescription>{t.gradeDistDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gradeDistribution}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="grade"
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
                        <p className="font-medium">{d.grade}</p>
                        <p className="text-sm text-muted-foreground">
                          {d.count}{" "}
                          {d.count === 1 ? t.enrollment : t.enrollments}
                        </p>
                      </div>
                    );
                  }}
                  cursor={false}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-3, 280 70% 50%))"
                  radius={[4, 4, 0, 0]}
                  name="Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
