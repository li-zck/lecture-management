"use client";

import {
  useAdminNotifications,
  useDeleteAdminNotification,
  useMarkAdminBroadcastAsRead,
  type Notification,
} from "@/components/ui/hooks/use-admin-notifications";
import { Button } from "@/components/ui/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Separator } from "@/components/ui/shadcn/separator";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, AlertTriangle, Bell, Info, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "WARNING":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "ALERT":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "INFO":
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function getNotificationBgColor(type: Notification["type"], isRead: boolean) {
  if (isRead) return "bg-background";
  switch (type) {
    case "WARNING":
      return "bg-yellow-500/5";
    case "ALERT":
      return "bg-red-500/5";
    case "INFO":
    default:
      return "bg-blue-500/5";
  }
}

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  lang: string;
}

function NotificationItem({
  notification,
  onDelete,
  isDeleting,
  lang,
}: NotificationItemProps) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const url = notification.url
    ? notification.url.startsWith("/admin")
      ? `/${lang}${notification.url}`
      : notification.url
    : null;

  const content = (
    <div
      className={cn(
        "p-3 hover:bg-accent/50 transition-colors relative group",
        getNotificationBgColor(notification.type, notification.isRead),
        !notification.isRead && "border-l-2 border-l-primary",
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium truncate",
              !notification.isRead && "font-semibold",
            )}
          >
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">{timeAgo}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(notification.id);
          }}
          disabled={isDeleting}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Delete notification</span>
        </Button>
      </div>
    </div>
  );

  if (url) {
    return (
      <Link href={url} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function AdminNotificationBell() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, isLoading } = useAdminNotifications();
  const deleteNotification = useDeleteAdminNotification();
  const markAllAsRead = useMarkAdminBroadcastAsRead();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && unreadCount > 0) {
      markAllAsRead.mutate();
    }
    setOpen(nextOpen);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification.mutateAsync(id);
      toast.success(dict.admin.notifications.deleted);
    } catch {
      toast.error(dict.admin.notifications.deleteFailed);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold text-sm">
            {dict.admin.notifications.title}
          </h4>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground">
                {dict.admin.notifications.loading}
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-2">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {dict.admin.notifications.noNotifications}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDelete={handleDelete}
                  isDeleting={deleteNotification.isPending}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Link
                href={`/${lang}/admin/management/requests`}
                onClick={() => setOpen(false)}
              >
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  {dict.admin.notifications.viewRequests}
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
