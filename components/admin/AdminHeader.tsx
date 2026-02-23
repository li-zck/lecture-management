"use client";

import { AdminNotificationBell } from "@/components/admin/AdminNotificationBell";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Button } from "@/components/ui/shadcn/button";
import {
  getClientDictionary,
  isLocale,
  Locale,
  LOCALES,
  useLocale,
} from "@/lib/i18n";
import Cookies from "js-cookie";
import { Globe, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";

const LOCALE_COOKIE = "NEXT_LOCALE";

interface AdminHeaderProps {
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

function pathWithoutLocale(pathname: string): string {
  const segments = pathname.slice(1).split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0]))
    return `/${segments.slice(1).join("/")}` || "/";
  return pathname;
}

export function AdminHeader({ onSearchClick, onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const dict = getClientDictionary(locale);

  const handleLocaleChange = (newLocale: Locale) => {
    Cookies.set(LOCALE_COOKIE, newLocale, { path: "/" });
    const path = pathWithoutLocale(pathname);
    router.push(path === "/" ? `/${newLocale}` : `/${newLocale}${path}`);
  };

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
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 sm:gap-4 border-b bg-background px-4 sm:px-6">
      {/* Mobile menu button */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Breadcrumbs - truncate on small screens */}
      <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={item.href} className="flex shrink-0 items-center gap-1">
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

      {/* Locale switcher: globe icon */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Change language"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LOCALES.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className="cursor-pointer"
            >
              {loc === "en" ? dict.locale.english : dict.locale.vietnamese}
              {locale === loc && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (active)
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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
