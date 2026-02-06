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

export default function AdminDashboard() {
  const { totalStudents, loading: loadingStudents } = useStudents();
  const { totalLecturers, loading: loadingLecturers } = useLecturers();
  const { totalDepartments, loading: loadingDepartments } = useDepartments();
  const { totalCourses, loading: loadingCourses } = useCourses();
  const { totalSemesters, loading: loadingSemesters } = useSemesters();

  const stats = [
    {
      label: "Students",
      value: loadingStudents ? "..." : totalStudents,
      icon: GraduationCap,
      href: "/admin/management/student",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "Active students enrolled",
    },
    {
      label: "Lecturers",
      value: loadingLecturers ? "..." : totalLecturers,
      icon: Users,
      href: "/admin/management/lecturer",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      description: "Faculty members",
    },
    {
      label: "Departments",
      value: loadingDepartments ? "..." : totalDepartments,
      icon: Building2,
      href: "/admin/management/department",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: "Academic departments",
    },
    {
      label: "Courses",
      value: loadingCourses ? "..." : totalCourses,
      icon: BookOpen,
      href: "/admin/management/course",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      description: "Available courses",
    },
    {
      label: "Semesters",
      value: loadingSemesters ? "..." : totalSemesters,
      icon: Calendar,
      href: "/admin/management/semester",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      description: "Academic terms",
    },
  ];

  const quickActions = [
    {
      label: "Add Student",
      href: "/admin/management/student/create",
      icon: GraduationCap,
      description: "Register a new student",
    },
    {
      label: "Add Lecturer",
      href: "/admin/management/lecturer/create",
      icon: Users,
      description: "Add faculty member",
    },
    {
      label: "Create Course",
      href: "/admin/management/course/create",
      icon: BookOpen,
      description: "Add new course",
    },
    {
      label: "Create Semester",
      href: "/admin/management/semester/create",
      icon: Calendar,
      description: "Add academic term",
    },
    {
      label: "Schedule Course",
      href: "/admin/management/course-semester/create",
      icon: CalendarDays,
      description: "Assign course to semester",
    },
    {
      label: "Add Department",
      href: "/admin/management/department/create",
      icon: Building2,
      description: "Create department",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin panel. Here's an overview of your system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
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
        <h2 className="text-lg font-semibold mb-2">Overview</h2>
        <DashboardOverview />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Commonly used management tasks</CardDescription>
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
                <Link href="/admin/management/student">
                  View All Management Options
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
