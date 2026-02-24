"use client";

import { useCourseSemesters } from "@/components/ui/hooks/use-course-semesters";
import { useEnrollmentSessions } from "@/components/ui/hooks/use-enrollment-sessions";
import { useSemesters } from "@/components/ui/hooks/use-semesters";
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
 * Offerings (course-semesters) per semester + enrollment sessions per semester.
 */
export function SemesterOverviewChart() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.chart;
  const { semesters, loading: semestersLoading } = useSemesters();
  const { courseSemesters, loading: courseSemestersLoading } =
    useCourseSemesters();
  const { enrollmentSessions, loading: sessionsLoading } =
    useEnrollmentSessions();

  const offeringsData = useMemo(() => {
    const bySemester = new Map<string, { name: string; count: number }>();
    for (const s of semesters) {
      bySemester.set(s.id, { name: s.name, count: 0 });
    }
    for (const cs of courseSemesters) {
      const sid = cs.semesterId;
      const name = cs.semester?.name ?? sid;
      const existing = bySemester.get(sid);
      if (existing) {
        existing.count += 1;
      } else {
        bySemester.set(sid, { name, count: 1 });
      }
    }
    return Array.from(bySemester.values()).sort((a, b) => b.count - a.count);
  }, [semesters, courseSemesters]);

  const sessionsData = useMemo(() => {
    const bySemester = new Map<
      string,
      { name: string; count: number; open: number }
    >();
    for (const s of semesters) {
      bySemester.set(s.id, { name: s.name, count: 0, open: 0 });
    }
    for (const es of enrollmentSessions) {
      const sid = es.semesterId;
      const name = es.semester?.name ?? sid;
      const existing = bySemester.get(sid);
      if (existing) {
        existing.count += 1;
        if (es.isActive) existing.open += 1;
      } else {
        bySemester.set(sid, {
          name,
          count: 1,
          open: es.isActive ? 1 : 0,
        });
      }
    }
    return Array.from(bySemester.values())
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [semesters, enrollmentSessions]);

  const loading = semestersLoading || courseSemestersLoading || sessionsLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.semesterOverview}</CardTitle>
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
          <CardTitle>{t.offeringsPerSemester}</CardTitle>
          <CardDescription>{t.offeringsPerSemesterDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={offeringsData}
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
                          {d.count} {d.count === 1 ? t.offering : t.offerings}
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
                  name={t.offerings}
                  className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {sessionsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.sessionsPerSemester}</CardTitle>
            <CardDescription>{t.sessionsPerSemesterDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sessionsData}
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
                            {d.count} {d.count === 1 ? t.session : t.sessions} (
                            {d.open} {t.open})
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
                    name={t.sessions}
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
