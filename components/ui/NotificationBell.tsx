"use client";

import { getClientDictionary, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Info,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useNotifications,
  type UserNotification,
} from "./hooks/use-notifications";
import { Button } from "./shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/popover";
import { Separator } from "./shadcn/separator";

/**
 * Get icon based on notification type
 */
function getNotificationIcon(type: UserNotification["type"]) {
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
      return "bg-yellow-500/5";
    case "ALERT":
      return "bg-red-500/5";
    case "INFO":
    default:
      return "bg-blue-500/5";
  }
}

interface NotificationItemProps {
  notification: UserNotification;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function NotificationItem({
  notification,
  onDelete,
  isDeleting,
}: NotificationItemProps) {
  const [expanded, setExpanded] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

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
          <p
            className={cn(
              "text-xs text-muted-foreground mt-0.5",
              expanded ? "whitespace-pre-line" : "line-clamp-2",
            )}
          >
            {notification.message}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground/70">{timeAgo}</p>
            {notification.message.length > 120 && (
              <button
                type="button"
                className="text-[11px] text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpanded((prev) => !prev);
                }}
              >
                {expanded ? "Collapse" : "Expand"}
              </button>
            )}
          </div>
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
  return content;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const n = dict.notifications;
  const { notifications, unreadCount, isLoading } = useNotifications();
  const deleteNotification = useDeleteNotification();
  const deleteAllNotifications = useDeleteAllNotifications();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && unreadCount > 0) {
      markAllAsRead.mutate();
    }
    setOpen(nextOpen);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification.mutateAsync(id);
      toast.success(n.deleted);
    } catch {
      toast.error(n.failedDelete);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications.mutateAsync();
      toast.success(n.deletedAll);
    } catch {
      toast.error(n.failedDeleteAll);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? unreadCount === 1
                ? n.subtitleUnread.replace("{count}", "1")
                : n.subtitleUnreadPlural.replace("{count}", String(unreadCount))
              : n.title
          }
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
          <h4 className="font-semibold text-sm">{n.title}</h4>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs text-muted-foreground hover:text-destructive"
              onClick={handleDeleteAll}
              disabled={deleteAllNotifications.isPending}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {n.deleteAll}
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground">
                {dict.admin.chart.loadingShort}
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-2">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {n.noNotifications}
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
                />
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Link href="/notifications" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  {n.title}
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
