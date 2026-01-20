"use client";

import {
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  Plus,
  Users
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
import SignOutButton from "@/components/ui/SignOutButton";

export default function AdminDashboard() {
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
        <div className="space-y-8 bg-background min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        System Management Overview
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/admin/management">
                        <Button variant="outline">View All Management</Button>
                    </Link>
                    <SignOutButton />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.href}>
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
                        <CardDescription>
                            Commonly used management tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
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
                            Use the sidebar to navigate to specific management sections.
                        </p>
                        <p>
                            Note: This area is restricted to Administrators only.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
