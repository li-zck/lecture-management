"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { useSession } from "@/components/provider/SessionProvider";
import { SkipLink } from "@/components/ui/SkipLink";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

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
  // Desktop (lg+): fixed sidebar | Mobile/tablet: hamburger + sheet
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      {/* Desktop sidebar: hidden on mobile/tablet, fixed on lg+ */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar: Sheet drawer */}
      <AdminSidebar
        variant="sheet"
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      {/* Main content: full width on mobile, ml-64 on desktop */}
      <div className="min-h-screen flex flex-col lg:ml-64">
        <AdminHeader
          onSearchClick={() => setCommandOpen(true)}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main id="main-content" className="flex-1 p-4 sm:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
