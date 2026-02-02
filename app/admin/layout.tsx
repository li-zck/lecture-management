"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/components/provider/SessionProvider";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";

interface AdminLayoutProps {
	children: ReactNode;
}

// Routes that should not show the sidebar (auth pages)
const authRoutes = ["/admin/sign-in", "/admin/sign-up"];

export default function AdminLayout({ children }: AdminLayoutProps) {
	const [commandOpen, setCommandOpen] = useState(false);
	const pathname = usePathname();
	const { isAuthenticated, isLoading } = useSession();

	// Check if current route is an auth route
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// Show plain layout for auth routes or unauthenticated users
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
