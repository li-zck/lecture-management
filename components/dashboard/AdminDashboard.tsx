"use client";

import {
  useDepartments,
  useLecturers,
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
import {
  BookOpen,
  Building2,
  Calendar,
  FileText,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const localePath = useLocalePath();
  const { totalStudents, loading: loadingStudents } = useStudents();
  const { totalLecturers, loading: loadingLecturers } = useLecturers();
  const { totalDepartments, loading: loadingDepartments } = useDepartments();

  const stats = [
    {
      label: dict.admin.dashboard.totalStudents,
      value: loadingStudents ? "..." : totalStudents,
      icon: Users,
      href: localePath("admin/management/student"),
      color: "text-blue-600",
      description: dict.admin.dashboard.activeStudentsEnrolled,
    },
    {
      label: dict.admin.dashboard.totalLecturers,
      value: loadingLecturers ? "..." : totalLecturers,
      icon: GraduationCap,
      href: localePath("admin/management/lecturer"),
      color: "text-green-600",
      description: dict.admin.dashboard.facultyMembers,
    },
    {
      label: dict.admin.dashboard.departments,
      value: loadingDepartments ? "..." : totalDepartments,
      icon: Building2,
      href: localePath("admin/management/department"),
      color: "text-purple-600",
      description: dict.admin.dashboard.academicDepartments,
    },
  ];

  const quickActions = [
    {
      label: dict.admin.dashboard.addStudent,
      href: localePath("admin/management/student/create"),
      icon: Plus,
    },
    {
      label: dict.admin.dashboard.addLecturer,
      href: localePath("admin/management/lecturer/create"),
      icon: Plus,
    },
    {
      label: dict.admin.dashboard.addDepartment,
      href: localePath("admin/management/department/create"),
      icon: Plus,
    },
    {
      label: dict.admin.dashboard.manageCourses,
      href: localePath("admin/management/course"),
      icon: BookOpen,
    },
    {
      label: dict.admin.dashboard.manageSemesters,
      href: localePath("admin/management/semester"),
      icon: Calendar,
    },
    {
      label: dict.admin.dashboard.manageSchedule,
      href: localePath("admin/management/course-semester"),
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {dict.admin.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {dict.admin.dashboard.subtitle}
          </p>
        </div>
        <div className="shrink-0">
          <Link href={localePath("admin/management")}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              {dict.admin.dashboard.viewAllManagement}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Layout */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{dict.admin.dashboard.quickActions}</CardTitle>
            <CardDescription>
              {dict.admin.dashboard.quickActionsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    {dict.admin.dashboard.go}
                  </Button>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* System Overview / Welcome */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{dict.admin.dashboard.welcomeTitle}</CardTitle>
            <CardDescription>
              {dict.admin.dashboard.welcomeDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {dict.admin.dashboard.sidebarHint}
            </p>
            <ul className="grid gap-2 text-sm">
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{dict.admin.dashboard.manageStudents}</span>
              </li>
              <li className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-500" />
                <span>{dict.admin.dashboard.manageLecturers}</span>
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-500" />
                <span>{dict.admin.dashboard.configureDepartments}</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span>{dict.admin.dashboard.organizeCourses}</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span>{dict.admin.dashboard.scheduleSemesters}</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-yellow-500" />
                <span>{dict.admin.dashboard.managePosts}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
