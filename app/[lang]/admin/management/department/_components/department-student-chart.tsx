"use client";

import { useCourses } from "@/components/ui/hooks/use-courses";
import { useDepartments } from "@/components/ui/hooks/use-department";
import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import { useStudents } from "@/components/ui/hooks/use-students";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getClientDictionary, useLocale } from "@/lib/i18n";
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
 * Bar chart: total students per department.
 * Optional engagement view: students created per time period (by month).
 */
export function DepartmentStudentChart() {
  const locale = useLocale();
  const { students, loading: studentsLoading } = useStudents();
  const { departments, loading: departmentsLoading } = useDepartments();
  const dict = getClientDictionary(locale);
  const t = dict.admin.chart;
  const chartData = useMemo(() => {
    const deptMap = new Map(
      departments.map((d) => [d.id, { id: d.id, name: d.name, count: 0 }]),
    );

    for (const s of students) {
      const deptId = s.departmentId ?? "unassigned";
      const existing = deptMap.get(deptId);
      if (existing) {
        existing.count += 1;
      } else {
        deptMap.set(deptId, {
          id: deptId,
          name: s.department?.name ?? t.unassigned,
          count: 1,
        });
      }
    }

    return Array.from(deptMap.values()).sort((a, b) => b.count - a.count);
  }, [students, departments, t]);

  const engagementData = useMemo(() => {
    const byMonth = new Map<string, number>();

    for (const s of students) {
      if (!s.createdAt) continue;
      const d = new Date(s.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    }

    return Array.from(byMonth.entries())
      .map(([month, count]) => ({ month, students: count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }, [students]);

  const { courses, loading: coursesLoading } = useCourses();
  const { lecturers, loading: lecturersLoading } = useLecturers();

  const coursesByDeptData = useMemo(() => {
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

  const headsByDeptData = useMemo(() => {
    const deptMap = new Map(
      departments.map((d) => [d.id, { id: d.id, name: d.name, count: 0 }]),
    );
    for (const l of lecturers) {
      const deptId = l.departmentHeadId ?? null;
      if (!deptId) continue;
      const existing = deptMap.get(deptId);
      if (existing) existing.count += 1;
    }
    return Array.from(deptMap.values()).sort((a, b) => b.count - a.count);
  }, [lecturers, departments]);

  const loading =
    studentsLoading || departmentsLoading || coursesLoading || lecturersLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.deptStudentOverview}</CardTitle>
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
          <CardTitle>{t.totalStudentsByDept}</CardTitle>
          <CardDescription>{t.studentsPerDeptDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                          {d.count} {d.count === 1 ? t.student : t.students}
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
                  name={t.students}
                  className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {engagementData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.signUpsOverTime}</CardTitle>
            <CardDescription>{t.newStudentsPerMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={engagementData}
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
                            {d.students}{" "}
                            {d.students === 1 ? t.newStudent : t.newStudents}
                          </p>
                        </div>
                      );
                    }}
                    cursor={false}
                  />
                  <Bar
                    dataKey="students"
                    fill="hsl(var(--chart-2, 220 70% 50%))"
                    radius={[4, 4, 0, 0]}
                    name={t.newStudents}
                    className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {coursesByDeptData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.coursesPerDept}</CardTitle>
            <CardDescription>{t.coursesPerDeptDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={coursesByDeptData}
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
                            {d.count} {d.count === 1 ? t.course : t.courses}
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
                    name={t.courses}
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
          <CardTitle>{t.departmentHeads}</CardTitle>
          <CardDescription>{t.departmentHeadsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={headsByDeptData}
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
                          {d.count} {d.count === 1 ? t.head : t.heads}
                        </p>
                      </div>
                    );
                  }}
                  cursor={false}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-4, 340 70% 50%))"
                  radius={[4, 4, 0, 0]}
                  name={t.heads}
                  className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
