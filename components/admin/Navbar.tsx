"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Button } from "@/components/ui/shadcn/button";
import SignOutButton from "@/components/ui/SignOutButton";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useSession();

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
    },
    {
      href: "/admin/management",
      label: "Management",
    },
  ];

  if (isLoading) {
    return (
      <nav className="bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center space-x-6">
          <Link
            href="/admin"
            className="flex items-center space-x-2 group transition-all duration-200 hover:scale-105"
          >
            <Shield className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="admin-navbar-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center space-x-2 text-sm px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-muted-foreground">Welcome,</span>
              <span className="font-medium text-primary">Admin</span>
            </div>
          )}

          {isAuthenticated ? (
            <SignOutButton />
          ) : (
            <Link href="/admin/sign-in">
              <Button className="shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
