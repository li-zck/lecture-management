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
          <CardTitle>Enrollment sessions overview</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sessions by semester</CardTitle>
          <CardDescription>
            Number of enrollment sessions per semester (open in tooltip)
          </CardDescription>
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
                            {d.count} session{d.count === 1 ? "" : "s"} (
                            {d.open} open)
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
                    name="Sessions"
                    className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No sessions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>
            Enrollment sessions by start date (most recent first)
          </CardDescription>
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
                      {s.name || s.semester?.name || "Session"}
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
                    {s.isActive ? "Open" : "Closed"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No enrollment sessions yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
