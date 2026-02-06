"use client";

import {
  getClientDictionary,
  isLocale,
  LOCALES,
  type Locale,
} from "@/lib/i18n";
import { cn, ROUTES } from "@/lib/utils";
import Cookies from "js-cookie";
import {
  BookOpen,
  ChevronDown,
  Globe,
  GraduationCap,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../provider/SessionProvider";
import { useUserProfile } from "./hooks/use-user-profile";
import { NotificationBell } from "./NotificationBell";
import { Button } from "./shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shadcn/dropdown-menu";
import { Wordmark } from "./Wordmark";

const LOCALE_COOKIE = "NEXT_LOCALE";

function pathWithoutLocale(pathname: string): string {
  const segments = pathname.slice(1).split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0]))
    return `/${segments.slice(1).join("/")}` || "/";
  return pathname;
}

function localePath(lang: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${p === "/" ? "" : p}`;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const { isAuthenticated, user, logout } = useSession();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Unauthorized: Home, About only. Authorized (student/lecturer): Courses (browse), My Courses. Admin: no main nav.
  const navItems = !isAuthenticated
    ? [
        { href: "/", labelKey: "home" as const },
        { href: "/about", labelKey: "about" as const },
      ]
    : isAdmin
      ? []
      : [
          { href: "/courses", labelKey: "courses" as const },
          { href: "/my-courses", labelKey: "myCourses" as const },
        ];

  useEffect(() => {
    if (!navRef.current) return;

    const activeLink = navRef.current.querySelector(
      `a[href="${pathname}"]`,
    ) as HTMLElement;

    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    }
  }, [pathname]);

  const handleSignOut = () => {
    logout();
    router.push(localePath(locale, "/"));
  };

  const handleLocaleChange = (newLocale: Locale) => {
    Cookies.set(LOCALE_COOKIE, newLocale, { path: "/" });
    const path = pathWithoutLocale(pathname);
    router.push(path === "/" ? `/${newLocale}` : `/${newLocale}${path}`);
  };

  const displayName =
    profile?.username || profile?.fullName || user?.email || "User";

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full flex h-14 items-center px-6 lg:px-8">
        <div className="mr-4 hidden md:flex items-center">
          <Wordmark className="mr-8" />

          {navItems.length > 0 && (
            <nav
              ref={navRef}
              className="flex items-center space-x-6 text-sm font-medium relative"
            >
              {navItems.map((item) => {
                const href = localePath(locale, item.href);
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "relative transition-colors hover:text-foreground/80 py-0.5",
                      pathname === href
                        ? "text-foreground"
                        : "text-foreground/60",
                    )}
                  >
                    {dict.nav[item.labelKey]}
                  </Link>
                );
              })}
              {indicatorStyle.width > 0 && (
                <motion.div
                  className="absolute bottom-0 h-0.5 bg-primary"
                  initial={false}
                  animate={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </nav>
          )}
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu button could go here */}
          </div>
          <nav className="flex items-center space-x-2">
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
                    {loc === "en"
                      ? dict.locale.english
                      : dict.locale.vietnamese}
                    {locale === loc && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (active)
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated ? (
              isAdmin ? (
                // Admin: Show dashboard link and sign out
                <div className="flex items-center gap-4">
                  <Link href={localePath(locale, "/admin")}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium hover:bg-accent/50 transition-all duration-200"
                    >
                      {user?.email || "Dashboard"}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {dict.nav.signOut}
                  </Button>
                </div>
              ) : (
                // Student/Lecturer: Show notifications and dropdown menu
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-sm font-medium hover:bg-accent/50 transition-all duration-200"
                      >
                        <User className="h-4 w-4" />
                        {profileLoading ? (
                          <span className="animate-pulse">
                            {dict.nav.loading}
                          </span>
                        ) : (
                          displayName
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {profile?.fullName || displayName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {profile?.email || user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(localePath(locale, "/dashboard"))
                        }
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {dict.nav.dashboard}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(localePath(locale, "/my-courses"))
                        }
                        className="cursor-pointer"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        {dict.nav.myCourses}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(localePath(locale, "/courses"))
                        }
                        className="cursor-pointer"
                      >
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {dict.nav.browseCourses}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(localePath(locale, "/settings"))
                        }
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {dict.nav.settings}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {dict.nav.signOut}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            ) : (
              <Link href={localePath(locale, ROUTES.mainSite.signin)}>
                <Button className="shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  {dict.nav.signIn}
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.nav>
  );
}
