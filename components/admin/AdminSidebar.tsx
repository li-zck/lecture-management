"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/shadcn/sheet";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
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

export function AdminSidebar({
  variant = "fixed",
  open,
  onOpenChange,
}: {
  variant?: "fixed" | "sheet";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const pathname = usePathname();
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const isManagementActive = pathname.includes("/admin/management");
  const [managementOpen, setManagementOpen] = useState(isManagementActive);

  const managementItems = [
    {
      title: dict.admin.sidebar.students,
      url: localePath("admin/management/student"),
      icon: GraduationCap,
    },
    {
      title: dict.admin.sidebar.lecturers,
      url: localePath("admin/management/lecturer"),
      icon: Users,
    },
    {
      title: dict.admin.sidebar.departments,
      url: localePath("admin/management/department"),
      icon: Building2,
    },
    {
      title: dict.admin.sidebar.courses,
      url: localePath("admin/management/course"),
      icon: BookOpen,
    },
    {
      title: dict.admin.sidebar.semesters,
      url: localePath("admin/management/semester"),
      icon: Calendar,
    },
    {
      title: dict.admin.sidebar.courseSemesters,
      url: localePath("admin/management/course-semester"),
      icon: CalendarDays,
    },
    {
      title: dict.admin.sidebar.enrollmentSessions,
      url: localePath("admin/management/enrollment-session"),
      icon: ClipboardList,
    },
    {
      title: dict.admin.sidebar.enrollments,
      url: localePath("admin/management/enrollment"),
      icon: ListChecks,
    },
    {
      title: dict.admin.sidebar.requests,
      url: localePath("admin/management/requests"),
      icon: Send,
    },
    {
      title: dict.admin.sidebar.posts,
      url: localePath("admin/management/post"),
      icon: FileText,
    },
  ];

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Link href={localePath("admin")} className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {dict.admin.sidebar.adminPanel}
            </span>
            <span className="text-xs text-muted-foreground">
              {dict.admin.sidebar.managementSystem}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="mb-4">
          <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            {dict.admin.sidebar.navigation}
          </p>
          <Link
            href={localePath("admin")}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
              pathname.endsWith("/admin") ||
                pathname === `${localePath("admin")}`
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <LayoutDashboard className="size-4" />
            <span>{dict.admin.sidebar.dashboard}</span>
          </Link>
        </div>

        {/* Management Section */}
        <div className="mb-4">
          <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            {dict.admin.sidebar.management}
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
            <span>{dict.admin.sidebar.allEntities}</span>
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
                    pathname.includes(item.url)
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
            {dict.admin.sidebar.quickAccess}
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
    </>
  );

  if (variant === "sheet" && open !== undefined && onOpenChange) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-[16rem] max-w-[85vw] p-0"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {sidebarContent}
    </aside>
  );
}
