"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/shadcn";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import {
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navigationItems = useMemo(
    () => [
      {
        title: dict.admin.sidebar.dashboard,
        url: "/admin",
        icon: LayoutDashboard,
        keywords: ["home", "overview", "stats"],
      },
      {
        title: dict.admin.sidebar.students,
        url: "/admin/management/student",
        icon: GraduationCap,
        keywords: ["student", "enrolled", "users"],
      },
      {
        title: dict.admin.sidebar.lecturers,
        url: "/admin/management/lecturer",
        icon: Users,
        keywords: ["lecturer", "teacher", "instructor", "professor"],
      },
      {
        title: dict.admin.sidebar.departments,
        url: "/admin/management/department",
        icon: Building2,
        keywords: ["department", "faculty", "division"],
      },
      {
        title: dict.admin.sidebar.courses,
        url: "/admin/management/course",
        icon: BookOpen,
        keywords: ["course", "subject", "class"],
      },
      {
        title: dict.admin.sidebar.semesters,
        url: "/admin/management/semester",
        icon: Calendar,
        keywords: ["semester", "term", "period"],
      },
      {
        title: dict.admin.sidebar.courseSemesters,
        url: "/admin/management/course-semester",
        icon: CalendarDays,
        keywords: ["course semester", "schedule", "offering"],
      },
      {
        title: dict.admin.sidebar.requests,
        url: "/admin/management/requests",
        icon: Send,
        keywords: [
          "request",
          "teaching request",
          "approve",
          "lecturer request",
        ],
      },
      {
        title: dict.admin.sidebar.posts,
        url: "/admin/management/post",
        icon: FileText,
        keywords: ["post", "announcement", "news", "article"],
      },
    ],
    [dict],
  );

  const quickActions = useMemo(
    () => [
      {
        title: dict.admin.commandPalette.createStudent,
        url: "/admin/management/student/create",
        icon: Plus,
        keywords: ["add student", "new student"],
      },
      {
        title: dict.admin.commandPalette.createLecturer,
        url: "/admin/management/lecturer/create",
        icon: Plus,
        keywords: ["add lecturer", "new lecturer"],
      },
      {
        title: dict.admin.commandPalette.createDepartment,
        url: "/admin/management/department/create",
        icon: Plus,
        keywords: ["add department", "new department"],
      },
      {
        title: dict.admin.commandPalette.createCourse,
        url: "/admin/management/course/create",
        icon: Plus,
        keywords: ["add course", "new course"],
      },
      {
        title: dict.admin.commandPalette.createSemester,
        url: "/admin/management/semester/create",
        icon: Plus,
        keywords: ["add semester", "new semester"],
      },
      {
        title: dict.admin.commandPalette.createCourseSemester,
        url: "/admin/management/course-semester/create",
        icon: Plus,
        keywords: ["add course semester", "new course semester"],
      },
      {
        title: dict.admin.commandPalette.createPost,
        url: "/admin/management/post/create",
        icon: Plus,
        keywords: ["add post", "new post", "announcement", "news"],
      },
    ],
    [dict],
  );

  const isControlled = open !== undefined;
  const isDialogOpen = isControlled ? open : isOpen;
  const setDialogOpen = isControlled ? onOpenChange : setIsOpen;

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setDialogOpen?.(!isDialogOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isDialogOpen, setDialogOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setDialogOpen?.(false);
      command();
    },
    [setDialogOpen],
  );

  return (
    <CommandDialog
      open={isDialogOpen}
      onOpenChange={setDialogOpen}
      title={dict.admin.commandPalette.title}
      description={dict.admin.commandPalette.searchDescription}
    >
      <CommandInput placeholder={dict.admin.commandPalette.placeholder} />
      <CommandList>
        <CommandEmpty>{dict.admin.commandPalette.noResults}</CommandEmpty>

        <CommandGroup heading={dict.admin.commandPalette.navigation}>
          {navigationItems.map((item) => (
            <CommandItem
              key={item.url}
              value={`${item.title} ${item.keywords.join(" ")}`}
              onSelect={() => runCommand(() => router.push(item.url))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={dict.admin.commandPalette.quickActions}>
          {quickActions.map((item) => (
            <CommandItem
              key={item.url}
              value={`${item.title} ${item.keywords.join(" ")}`}
              onSelect={() => runCommand(() => router.push(item.url))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={dict.admin.commandPalette.settings}>
          <CommandItem
            value="settings preferences"
            onSelect={() => runCommand(() => console.log("Settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>{dict.admin.commandPalette.settings}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
