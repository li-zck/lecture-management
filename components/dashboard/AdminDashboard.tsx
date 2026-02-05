"use client";

import {
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";

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

export function AdminDashboard() {
  const { totalStudents, loading: loadingStudents } = useStudents();
  const { totalLecturers, loading: loadingLecturers } = useLecturers();
  const { totalDepartments, loading: loadingDepartments } = useDepartments();

  const stats = [
    {
      label: "Total Students",
      value: loadingStudents ? "..." : totalStudents,
      icon: Users,
      href: "/admin/management/student",
      color: "text-blue-600",
      description: "Active students enrolled",
    },
    {
      label: "Total Lecturers",
      value: loadingLecturers ? "..." : totalLecturers,
      icon: GraduationCap,
      href: "/admin/management/lecturer",
      color: "text-green-600",
      description: "Faculty members",
    },
    {
      label: "Departments",
      value: loadingDepartments ? "..." : totalDepartments,
      icon: Building2,
      href: "/admin/management/department",
      color: "text-purple-600",
      description: "Academic departments",
    },
  ];

  const quickActions = [
    {
      label: "Add Student",
      href: "/admin/management/student/create",
      icon: Plus,
    },
    {
      label: "Add Lecturer",
      href: "/admin/management/lecturer/create",
      icon: Plus,
    },
    {
      label: "Add Department",
      href: "/admin/management/department/create",
      icon: Plus,
    },
    {
      label: "Manage Courses",
      href: "/admin/management/course",
      icon: BookOpen,
    },
    {
      label: "Manage Semesters",
      href: "/admin/management/semester",
      icon: Calendar,
    },
    {
      label: "Manage Schedule",
      href: "/admin/management/course-semester",
      icon: Calendar,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of the Lecture Management System
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/management">
            <Button variant="outline">View All Management</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used management tasks</CardDescription>
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
                    Go
                  </Button>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* System Overview / Welcome */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Welcome to Admin Panel</CardTitle>
            <CardDescription>
              You have full access to manage the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Use the sidebar to navigate to specific management sections. Here
              you can manage:
            </p>
            <ul className="grid gap-2 text-sm">
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Manage Student accounts and enrollments</span>
              </li>
              <li className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-500" />
                <span>Manage Lecturer profiles and assignments</span>
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-500" />
                <span>Configure Departments and structure</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span>Organize Courses and curriculum</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span>Schedule Semesters and classes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
