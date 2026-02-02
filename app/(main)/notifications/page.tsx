"use client";

import { useSession } from "@/components/provider/SessionProvider";
import {
	useNotifications,
	useDeleteNotification,
	useDeleteAllNotifications,
	type UserNotification,
} from "@/components/ui/hooks/use-notifications";
import { Button } from "@/components/ui/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import {
	AlertCircle,
	AlertTriangle,
	Bell,
	Info,
	Trash2,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Get icon based on notification type
 */
function getNotificationIcon(type: UserNotification["type"]) {
	switch (type) {
		case "WARNING":
			return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
		case "ALERT":
			return <AlertCircle className="h-5 w-5 text-red-500" />;
		case "INFO":
		default:
			return <Info className="h-5 w-5 text-blue-500" />;
	}
}

/**
 * Get background color based on notification type
 */
function getNotificationBgColor(
	type: UserNotification["type"],
	isRead: boolean,
) {
	if (isRead) return "bg-background";

	switch (type) {
		case "WARNING":
			return "bg-yellow-500/5 dark:bg-yellow-500/10";
		case "ALERT":
			return "bg-red-500/5 dark:bg-red-500/10";
		case "INFO":
		default:
			return "bg-blue-500/5 dark:bg-blue-500/10";
	}
}

interface NotificationCardProps {
	notification: UserNotification;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}

function NotificationCard({
	notification,
	onDelete,
	isDeleting,
}: NotificationCardProps) {
	const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
		addSuffix: true,
	});
	const fullDate = format(new Date(notification.createdAt), "PPpp");

	const content = (
		<Card
			className={cn(
				"relative group transition-colors",
				getNotificationBgColor(notification.type, notification.isRead),
				!notification.isRead && "border-l-4 border-l-primary",
			)}
		>
			<CardHeader className="pb-2">
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0 mt-0.5">
						{getNotificationIcon(notification.type)}
					</div>
					<div className="flex-1 min-w-0">
						<CardTitle
							className={cn(
								"text-base",
								!notification.isRead && "font-semibold",
							)}
						>
							{notification.title}
						</CardTitle>
						<CardDescription className="text-xs" title={fullDate}>
							{timeAgo}
						</CardDescription>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onDelete(notification.id);
						}}
						disabled={isDeleting}
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Delete notification</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">{notification.message}</p>
			</CardContent>
		</Card>
	);

	if (notification.url) {
		return (
			<Link href={notification.url} className="block">
				{content}
			</Link>
		);
	}

	return content;
}

function NotificationsSkeleton() {
	return (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<Card key={i}>
					<CardHeader className="pb-2">
						<div className="flex items-start gap-3">
							<Skeleton className="h-5 w-5 rounded-full" />
							<div className="flex-1">
								<Skeleton className="h-5 w-48 mb-1" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<Skeleton className="h-4 w-full mb-1" />
						<Skeleton className="h-4 w-3/4" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export default function NotificationsPage() {
	const router = useRouter();
	const { isAuthenticated, user } = useSession();
	const { notifications, unreadCount, isLoading } = useNotifications();
	const deleteNotification = useDeleteNotification();
	const deleteAllNotifications = useDeleteAllNotifications();

	const isStudent = user?.role?.toLowerCase() === "student";
	const isLecturer = user?.role?.toLowerCase() === "lecturer";

	// Redirect if not authenticated or not a student/lecturer
	if (!isAuthenticated || (!isStudent && !isLecturer)) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-3xl">
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
						<p className="text-muted-foreground text-center">
							Please sign in as a student or lecturer to view notifications.
						</p>
						<Button className="mt-4" onClick={() => router.push("/sign-in")}>
							Sign In
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleDelete = async (id: string) => {
		try {
			await deleteNotification.mutateAsync(id);
			toast.success("Notification deleted");
		} catch {
			toast.error("Failed to delete notification");
		}
	};

	const handleDeleteAll = async () => {
		try {
			await deleteAllNotifications.mutateAsync();
			toast.success("All notifications deleted");
		} catch {
			toast.error("Failed to delete notifications");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-3xl">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold">Notifications</h1>
					<p className="text-muted-foreground text-sm">
						{unreadCount > 0
							? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
							: "All caught up!"}
					</p>
				</div>
				{notifications.length > 0 && (
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={handleDeleteAll}
						disabled={deleteAllNotifications.isPending}
					>
						<Trash2 className="h-4 w-4" />
						Clear all
					</Button>
				)}
			</div>

			{isLoading ? (
				<NotificationsSkeleton />
			) : notifications.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
						<p className="text-lg font-medium mb-1">No notifications</p>
						<p className="text-muted-foreground text-sm text-center">
							You&apos;re all caught up! Check back later for updates.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{notifications.map((notification) => (
						<NotificationCard
							key={notification.id}
							notification={notification}
							onDelete={handleDelete}
							isDeleting={deleteNotification.isPending}
						/>
					))}
				</div>
			)}
		</div>
	);
}
