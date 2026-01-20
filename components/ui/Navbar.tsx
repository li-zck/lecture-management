"use client";

import { ModeToggle } from "@/components/ui/ModeToggle";
import SignOutButton from "@/components/ui/SignOutButton";
import { cn, ROUTES } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "../provider/SessionProvider";
import { Button } from "./shadcn/button";

export const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useSession();

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

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Learn</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
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

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu button could go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user && (
                  <Link href={user.role.toLowerCase() === 'admin' ? '/admin' : '/dashboard'} className="text-sm font-medium hover:underline">
                    {user.email || "Dashboard"}
                  </Link>
                )}
                <SignOutButton />
              </div>
            ) : (
              <Button asChild>
                <Link href={ROUTES.mainSite.signin}>
                  Sign in
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};
