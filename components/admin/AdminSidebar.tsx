"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Send,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavUser } from "./nav-user";

const managementItems = [
  {
    title: "Students",
    url: "/admin/management/student",
    icon: GraduationCap,
  },
  {
    title: "Lecturers",
    url: "/admin/management/lecturer",
    icon: Users,
  },
  {
    title: "Departments",
    url: "/admin/management/department",
    icon: Building2,
  },
  {
    title: "Courses",
    url: "/admin/management/course",
    icon: BookOpen,
  },
  {
    title: "Semesters",
    url: "/admin/management/semester",
    icon: Calendar,
  },
  {
    title: "Course-Semesters",
    url: "/admin/management/course-semester",
    icon: CalendarDays,
  },
  {
    title: "Enrollment Sessions",
    url: "/admin/management/enrollment-session",
    icon: ClipboardList,
  },
  {
    title: "Enrollments",
    url: "/admin/management/enrollment",
    icon: ListChecks,
  },
  {
    title: "Requests",
    url: "/admin/management/requests",
    icon: Send,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isManagementActive = pathname.startsWith("/admin/management");
  const [managementOpen, setManagementOpen] = useState(isManagementActive);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Admin Panel</span>
            <span className="text-xs text-muted-foreground">
              Management System
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="mb-4">
          <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            Navigation
          </p>
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
              pathname === "/admin"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Management Section */}
        <div className="mb-4">
          <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            Management
          </p>
          <button
            type="button"
            onClick={() => setManagementOpen(!managementOpen)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
              isManagementActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Settings className="size-4" />
            <span>All Entities</span>
            <ChevronRight
              className={cn(
                "ml-auto size-4 transition-transform",
                managementOpen && "rotate-90",
              )}
            />
          </button>
          {managementOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l pl-4">
              {managementItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    pathname.startsWith(item.url)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access */}
        <div>
          <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            Quick Access
          </p>
          <div className="space-y-1">
            {managementItems.slice(0, 4).map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                  pathname.startsWith(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <NavUser />
      </div>
    </aside>
  );
}
