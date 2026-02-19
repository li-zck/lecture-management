"use client";

import { AdminNotificationBell } from "@/components/admin/AdminNotificationBell";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Button } from "@/components/ui/shadcn/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface AdminHeaderProps {
  onSearchClick?: () => void;
}

export function AdminHeader({ onSearchClick }: AdminHeaderProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    const items: { label: string; href: string }[] = [];

    let currentPath = "";
    for (const path of paths) {
      currentPath += `/${path}`;

      // Skip the first "admin" segment as a link, just label it
      if (path === "admin") {
        items.push({ label: "Admin", href: "/admin" });
        continue;
      }

      // Format the label nicely
      let label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Handle special cases
      if (path === "course-semester") {
        label = "Course-Semesters";
      }

      // Check if it's an ID (UUID-like)
      if (path.match(/^[a-f0-9-]{36}$/i) || path.match(/^[a-z0-9]{20,}$/i)) {
        label = "Details";
      }

      items.push({ label, href: currentPath });
    }

    return items;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={item.href} className="flex items-center gap-1">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      <AdminNotificationBell />
      <ModeToggle />

      {/* Search Button */}
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex items-center gap-2 text-muted-foreground"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Mobile Search Icon */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onSearchClick}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </header>
  );
}
