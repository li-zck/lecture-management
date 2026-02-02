"use client";

import { cn, ROUTES } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../provider/SessionProvider";
import { useUserProfile } from "./hooks/use-user-profile";
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
import {
	BookOpen,
	ChevronDown,
	GraduationCap,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, user, logout } = useSession();
	const { profile, isLoading: profileLoading } = useUserProfile();
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
		{
			href: "/courses",
			label: "Courses",
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

	const handleSignOut = () => {
		logout();
		router.push("/");
	};

	const isAdmin = user?.role?.toLowerCase() === "admin";
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

					<nav
						ref={navRef}
						className="flex items-center space-x-6 text-sm font-medium relative"
					>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"relative transition-colors hover:text-foreground/80 py-0.5",
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
							isAdmin ? (
								// Admin: Show dashboard link and sign out
								<div className="flex items-center gap-4">
									<Link href="/admin">
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
										Sign out
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
													<span className="animate-pulse">Loading...</span>
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
												onClick={() => router.push("/dashboard")}
												className="cursor-pointer"
											>
												<User className="mr-2 h-4 w-4" />
												Dashboard
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => router.push("/my-courses")}
												className="cursor-pointer"
											>
												<BookOpen className="mr-2 h-4 w-4" />
												My Courses
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => router.push("/courses")}
												className="cursor-pointer"
											>
												<GraduationCap className="mr-2 h-4 w-4" />
												Browse Courses
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => router.push("/settings")}
												className="cursor-pointer"
											>
												<Settings className="mr-2 h-4 w-4" />
												Settings
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={handleSignOut}
												className="cursor-pointer text-destructive focus:text-destructive"
											>
												<LogOut className="mr-2 h-4 w-4" />
												Sign out
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)
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
