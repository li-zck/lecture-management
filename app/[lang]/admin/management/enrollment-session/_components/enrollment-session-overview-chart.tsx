"use client";

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
 * Sessions by semester (bar) + timeline list (sessions by date).
 */
export function EnrollmentSessionOverviewChart() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.chart;
  const { enrollmentSessions, loading: sessionsLoading } =
    useEnrollmentSessions();
  const { semesters, loading: semestersLoading } = useSemesters();

  const bySemesterData = useMemo(() => {
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

  const timelineSessions = useMemo(() => {
    return [...enrollmentSessions].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
  }, [enrollmentSessions]);

  const loading = sessionsLoading || semestersLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.sessionsOverview}</CardTitle>
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
          <CardTitle>{t.sessionsBySemester}</CardTitle>
          <CardDescription>{t.sessionsBySemesterDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            {bySemesterData.length > 0 ? (
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
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name={t.sessions}
                    className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                {t.noSessions}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.timeline}</CardTitle>
          <CardDescription>{t.timelineDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {timelineSessions.length > 0 ? (
            <ul className="space-y-3">
              {timelineSessions.slice(0, 10).map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {s.name || s.semester?.name || t.sessionFallback}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.startDate).toLocaleDateString()} –{" "}
                      {new Date(s.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      s.isActive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.isActive ? t.openLabel : t.closedLabel}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t.noSessionsYet}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
