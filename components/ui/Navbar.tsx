"use client";

import SignOutButton from "@/components/ui/SignOutButton";
import { cn, ROUTES } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../provider/SessionProvider";
import { Button } from "./shadcn/button";
import { Wordmark } from "./Wordmark";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useSession();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/about",
      label: "About",
    },
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

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full flex h-16 items-center px-6 lg:px-8">
        <div className="mr-4 hidden md:flex items-center">
          <Wordmark className="mr-8" />

          <nav
            ref={navRef}
            className="flex items-center space-x-6 text-sm font-medium relative"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative transition-colors hover:text-foreground/80 py-2",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60",
                )}
              >
                {item.label}
              </Link>
            ))}
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
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu button could go here */}
          </div>
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user && (
                  <Link
                    href={
                      user.role.toLowerCase() === "admin"
                        ? "/admin"
                        : "/dashboard"
                    }
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium hover:bg-accent/50 transition-all duration-200"
                    >
                      {user.email || "Dashboard"}
                    </Button>
                  </Link>
                )}
                <SignOutButton />
              </div>
            ) : (
              <Link href={ROUTES.mainSite.signin}>
                <Button className="shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Sign in
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.nav>
  );
}
