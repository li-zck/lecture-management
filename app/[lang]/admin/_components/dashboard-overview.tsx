"use client";

import {
  useCourseSemesters,
  useDepartments,
  useEnrollmentSessions,
  useStudents,
} from "@/components/ui/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { adminEnrollmentApi } from "@/lib/api/admin-enrollment";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
 * Department distribution: students per department (compact for dashboard).
 */
function DepartmentDistributionChart() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { students, loading: studentsLoading } = useStudents();
  const { departments, loading: departmentsLoading } = useDepartments();

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
          name: s.department?.name ?? dict.admin.common.unassigned,
          count: 1,
        });
      }
    }
    return Array.from(deptMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [students, departments, dict]);

  const loading = studentsLoading || departmentsLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.admin.overview.studentsByDept}
          </CardTitle>
          <CardDescription>{dict.admin.common.loading}</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
          {dict.admin.overview.loadingChart}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {dict.admin.overview.studentsByDept}
        </CardTitle>
        <CardDescription>
          {dict.admin.overview.topDeptsByStudentCount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
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
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 shadow-sm text-sm">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-muted-foreground">
                        {d.count}{" "}
                        {d.count === 1
                          ? dict.admin.overview.student
                          : dict.admin.overview.studentsPlural}
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
                name={dict.admin.overview.students}
                className="fill-gray-400 hover:fill-gray-500 transition-all duration-100"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Link
          href="/admin/management/department"
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          {dict.admin.overview.viewAllDepts}
        </Link>
      </CardContent>
    </Card>
  );
}

/**
 * Enrollment sessions status: open vs closed counts and list.
 */
function EnrollmentSessionsStatus() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { enrollmentSessions, loading } = useEnrollmentSessions();

  const { openCount, closedCount, recentSessions } = useMemo(() => {
    let open = 0;
    let closed = 0;
    const recent = [...enrollmentSessions]
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        name: s.name || s.semester?.name || "Session",
        startDate: s.startDate,
        endDate: s.endDate,
        isActive: s.isActive,
      }));
    for (const s of enrollmentSessions) {
      if (s.isActive) open += 1;
      else closed += 1;
    }
    return { openCount: open, closedCount: closed, recentSessions: recent };
  }, [enrollmentSessions]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.admin.overview.enrollmentSessions}
          </CardTitle>
          <CardDescription>{dict.admin.common.loading}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {dict.admin.common.loading}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {dict.admin.overview.enrollmentSessions}
        </CardTitle>
        <CardDescription>{dict.admin.overview.openVsClosed}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
            {openCount} {dict.admin.overview.open.toLowerCase()}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {closedCount} {dict.admin.overview.closed.toLowerCase()}
          </span>
        </div>
        {recentSessions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {dict.admin.overview.recentSessions}
            </p>
            <ul className="space-y-1.5 text-sm">
              {recentSessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <span className="truncate">{s.name}</span>
                  <span
                    className={`shrink-0 ml-2 rounded px-1.5 py-0.5 text-xs ${
                      s.isActive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.isActive
                      ? dict.admin.overview.open
                      : dict.admin.overview.closed}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link
          href="/admin/management/enrollment-session"
          className="text-xs text-primary hover:underline inline-block"
        >
          {dict.admin.overview.manageSessions}
        </Link>
      </CardContent>
    </Card>
  );
}

/**
 * Enrollments snapshot: total count (and optional schedules/capacity).
 */
function EnrollmentsSnapshot() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ["admin", "enrollments", "list"],
    queryFn: () =>
      adminEnrollmentApi.getAll({
        includeStudent: true,
        includeCourse: true,
      }),
  });

  const total = enrollments.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {dict.admin.overview.enrollments}
        </CardTitle>
        <CardDescription>
          {dict.admin.overview.totalEnrollments}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-2xl font-bold text-muted-foreground">...</p>
        ) : (
          <p className="text-2xl font-bold">{total}</p>
        )}
        <Link
          href="/admin/management/course-semester"
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          {dict.admin.overview.viewSchedules}
        </Link>
      </CardContent>
    </Card>
  );
}

/**
 * Schedules/capacity: number of course-semesters (offerings).
 */
function SchedulesSnapshot() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { courseSemesters, loading } = useCourseSemesters();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {dict.admin.overview.courseSchedules}
        </CardTitle>
        <CardDescription>
          {dict.admin.overview.offeringsThisTerm}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-2xl font-bold text-muted-foreground">...</p>
        ) : (
          <p className="text-2xl font-bold">{courseSemesters.length}</p>
        )}
        <Link
          href="/admin/management/course-semester"
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          {dict.admin.overview.manageSchedules}
        </Link>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <EnrollmentsSnapshot />
        <SchedulesSnapshot />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DepartmentDistributionChart />
        <EnrollmentSessionsStatus />
      </div>
    </>
  );
}
