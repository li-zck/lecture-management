"use client";

import SignOutButton from "@/components/ui/SignOutButton";
import { useSession } from "@/components/provider/SessionProvider";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";
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
      <nav className="bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <span className="text-sm">Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background/95">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Admin Panel
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-foreground/60">Welcome,</span>
              <span className="font-medium">Admin</span>
            </div>
          )}

          <ModeToggle />

          {isAuthenticated ? (
            <SignOutButton />
          ) : (
            <Link href="/admin/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

