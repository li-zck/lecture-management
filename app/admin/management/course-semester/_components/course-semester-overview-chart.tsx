"use client";

import { useCourseSemesters } from "@/components/ui/hooks/use-course-semesters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { adminEnrollmentApi } from "@/lib/api/admin-enrollment";
import { useQuery } from "@tanstack/react-query";
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

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Schedules by day of week + lecturer workload (course-semesters per lecturer).
 */
export function CourseSemesterOverviewChart() {
  const { courseSemesters, loading } = useCourseSemesters();
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["admin", "enrollments", "list"],
    queryFn: () =>
      adminEnrollmentApi.getAll({
        includeStudent: true,
        includeCourse: true,
      }),
  });

  const byDayData = useMemo(() => {
    const counts = new Array(7)
      .fill(0)
      .map((_, i) => ({ day: i, name: DAYS[i], count: 0 }));
    for (const cs of courseSemesters) {
      const day = cs.dayOfWeek ?? 0;
      if (day >= 0 && day <= 6) counts[day].count += 1;
    }
    return counts.filter((d) => d.count > 0).length > 0
      ? counts
      : counts.slice(0, 5);
  }, [courseSemesters]);

  const byLecturerData = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const cs of courseSemesters) {
      const lid = cs.lecturerId ?? "unassigned";
      const name =
        cs.lecturer?.fullName ?? cs.lecturer?.lecturerId ?? "Unassigned";
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
  }, [courseSemesters]);

  const enrollmentLoadData = useMemo(() => {
    const countByCsId = new Map<string, number>();
    for (const e of enrollments) {
      const id = e.courseOnSemesterId;
      countByCsId.set(id, (countByCsId.get(id) ?? 0) + 1);
    }
    const csIdToLabel = new Map(
      courseSemesters.map((cs) => [
        cs.id,
        `${cs.course?.name ?? "Course"} (${cs.semester?.name ?? ""})`,
      ]),
    );
    return Array.from(countByCsId.entries())
      .map(([id, count]) => ({
        id,
        name: csIdToLabel.get(id) ?? id,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [enrollments, courseSemesters]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule overview</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  const showEnrollmentLoad =
    !enrollmentsLoading && enrollmentLoadData.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedules by day</CardTitle>
          <CardDescription>
            Number of course-semesters per day of week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byDayData}
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
                          {d.count} schedule{d.count === 1 ? "" : "s"}
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
                  name="Schedules"
                  className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {showEnrollmentLoad && (
        <Card>
          <CardHeader>
            <CardTitle>Enrollment load</CardTitle>
            <CardDescription>
              Top 10 course-semesters by number of enrolled students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={enrollmentLoadData}
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
                            {d.count} enrolled
                          </p>
                        </div>
                      );
                    }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-3, 280 70% 50%))"
                    radius={[0, 4, 4, 0]}
                    name="Enrolled"
                    className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {byLecturerData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lecturer workload</CardTitle>
            <CardDescription>
              Number of course-semesters per lecturer (top 10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byLecturerData}
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
                            {d.count} schedule{d.count === 1 ? "" : "s"}
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
                    name="Schedules"
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
