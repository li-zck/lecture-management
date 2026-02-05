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
import {
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    keywords: ["home", "overview", "stats"],
  },
  {
    title: "Students",
    url: "/admin/management/student",
    icon: GraduationCap,
    keywords: ["student", "enrolled", "users"],
  },
  {
    title: "Lecturers",
    url: "/admin/management/lecturer",
    icon: Users,
    keywords: ["lecturer", "teacher", "instructor", "professor"],
  },
  {
    title: "Departments",
    url: "/admin/management/department",
    icon: Building2,
    keywords: ["department", "faculty", "division"],
  },
  {
    title: "Courses",
    url: "/admin/management/course",
    icon: BookOpen,
    keywords: ["course", "subject", "class"],
  },
  {
    title: "Semesters",
    url: "/admin/management/semester",
    icon: Calendar,
    keywords: ["semester", "term", "period"],
  },
  {
    title: "Course-Semesters",
    url: "/admin/management/course-semester",
    icon: CalendarDays,
    keywords: ["course semester", "schedule", "offering"],
  },
  {
    title: "Requests",
    url: "/admin/management/requests",
    icon: Send,
    keywords: ["request", "teaching request", "approve", "lecturer request"],
  },
];

const quickActions = [
  {
    title: "Create Student",
    url: "/admin/management/student/create",
    icon: Plus,
    keywords: ["add student", "new student"],
  },
  {
    title: "Create Lecturer",
    url: "/admin/management/lecturer/create",
    icon: Plus,
    keywords: ["add lecturer", "new lecturer"],
  },
  {
    title: "Create Department",
    url: "/admin/management/department/create",
    icon: Plus,
    keywords: ["add department", "new department"],
  },
  {
    title: "Create Course",
    url: "/admin/management/course/create",
    icon: Plus,
    keywords: ["add course", "new course"],
  },
  {
    title: "Create Semester",
    url: "/admin/management/semester/create",
    icon: Plus,
    keywords: ["add semester", "new semester"],
  },
  {
    title: "Create Course-Semester",
    url: "/admin/management/course-semester/create",
    icon: Plus,
    keywords: ["add course semester", "new course semester"],
  },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
      title="Admin Command Palette"
      description="Search pages and actions"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
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

        <CommandGroup heading="Quick Actions">
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

        <CommandGroup heading="Settings">
          <CommandItem
            value="settings preferences"
            onSelect={() => runCommand(() => console.log("Settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
