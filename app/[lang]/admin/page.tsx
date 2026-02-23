"use client";

import {
  Activity,
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  GraduationCap,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import { DashboardOverview } from "@/app/[lang]/admin/_components/dashboard-overview";
import {
  useCourses,
  useDepartments,
  useLecturers,
  useSemesters,
  useStudents,
} from "@/components/ui/hooks";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";

export default function AdminPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const { totalStudents, loading: loadingStudents } = useStudents();
  const { totalLecturers, loading: loadingLecturers } = useLecturers();
  const { totalDepartments, loading: loadingDepartments } = useDepartments();
  const { totalCourses, loading: loadingCourses } = useCourses();
  const { totalSemesters, loading: loadingSemesters } = useSemesters();

  const stats = [
    {
      label: dict.admin.sidebar.students,
      value: loadingStudents ? "..." : totalStudents,
      icon: GraduationCap,
      href: localePath("admin/management/student"),
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: dict.admin.dashboard.activeStudentsEnrolled,
    },
    {
      label: dict.admin.sidebar.lecturers,
      value: loadingLecturers ? "..." : totalLecturers,
      icon: Users,
      href: localePath("admin/management/lecturer"),
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      description: dict.admin.dashboard.facultyMembers,
    },
    {
      label: dict.admin.sidebar.departments,
      value: loadingDepartments ? "..." : totalDepartments,
      icon: Building2,
      href: localePath("admin/management/department"),
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: dict.admin.dashboard.academicDepartments,
    },
    {
      label: dict.admin.sidebar.courses,
      value: loadingCourses ? "..." : totalCourses,
      icon: BookOpen,
      href: localePath("admin/management/course"),
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      description: dict.admin.dashboard.availableCourses,
    },
    {
      label: dict.admin.sidebar.semesters,
      value: loadingSemesters ? "..." : totalSemesters,
      icon: Calendar,
      href: localePath("admin/management/semester"),
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      description: dict.admin.dashboard.academicTerms,
    },
  ];

  const quickActions = [
    {
      label: dict.admin.dashboard.addStudent,
      href: localePath("admin/management/student/create"),
      icon: GraduationCap,
      description: dict.admin.dashboard.addStudent,
    },
    {
      label: dict.admin.dashboard.addLecturer,
      href: localePath("admin/management/lecturer/create"),
      icon: Users,
      description: dict.admin.dashboard.addLecturer,
    },
    {
      label: dict.admin.dashboard.manageCourses,
      href: localePath("admin/management/course/create"),
      icon: BookOpen,
      description: dict.admin.dashboard.manageCourses,
    },
    {
      label: dict.admin.dashboard.manageSemesters,
      href: localePath("admin/management/semester/create"),
      icon: Calendar,
      description: dict.admin.dashboard.manageSemesters,
    },
    {
      label: dict.admin.dashboard.manageSchedule,
      href: localePath("admin/management/course-semester/create"),
      icon: CalendarDays,
      description: dict.admin.dashboard.manageSchedule,
    },
    {
      label: dict.admin.dashboard.addDepartment,
      href: localePath("admin/management/department/create"),
      icon: Building2,
      description: dict.admin.dashboard.addDepartment,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {dict.admin.dashboard.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {dict.admin.dashboard.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href as string}>
            <Card className="hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Overview widgets: enrollments, schedules, department distribution, enrollment sessions */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {dict.admin.management.overview}
        </h2>
        <DashboardOverview />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {dict.admin.dashboard.quickActions}
            </CardTitle>
            <CardDescription>
              {dict.admin.dashboard.quickActionsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Overview
            </CardTitle>
            <CardDescription>Current system status and tips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">System Status</p>
                <p className="text-xs text-muted-foreground">
                  All services are running normally
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Use{" "}
                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">
                      ⌘K
                    </kbd>{" "}
                    to open the command palette for quick navigation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Click on any stat card to view and manage that entity
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={localePath("admin/management")}>
                  {dict.admin.dashboard.viewAllManagement}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
