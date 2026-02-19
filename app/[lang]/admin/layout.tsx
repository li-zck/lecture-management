"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { useSession } from "@/components/provider/SessionProvider";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

// Routes that should not show the sidebar (auth pages)
const authRoutes = ["/admin/sign-in", "/admin/sign-up"];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();

  // Check if current route is an auth route (pathname may include locale, e.g. /en/admin/sign-in)
  const isAuthRoute = authRoutes.some((route) => pathname.includes(route));

  // Redirect unauthenticated users to admin sign-in when on protected admin routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthRoute) {
      const segments = pathname.split("/").filter(Boolean);
      const locale =
        segments[0] && ["en", "vi"].includes(segments[0]) ? segments[0] : "en";
      router.replace(`/${locale}/admin/sign-in`);
    }
  }, [isLoading, isAuthenticated, isAuthRoute, pathname, router]);

  // Show plain layout for auth routes or unauthenticated users (before redirect)
  if (isAuthRoute || (!isLoading && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Show full admin layout for authenticated users
  // Sidebar is fixed at 256px (w-64) width
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar (w-64 = 256px) */}
      <AdminSidebar />

      {/* Main content with left margin to account for fixed sidebar */}
      <div className="ml-64 min-h-screen flex flex-col">
        <AdminHeader onSearchClick={() => setCommandOpen(true)} />
        <main className="flex-1 p-6">{children}</main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
