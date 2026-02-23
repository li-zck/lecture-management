"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { adminNotificationKeys } from "@/components/ui/hooks/use-admin-notifications";
import { notificationKeys as userNotificationKeys } from "@/components/ui/hooks/use-notifications";
import { connectSocket, disconnectSocket } from "@/lib/socket/socket-client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useSession();
  const queryClient = useQueryClient();

  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: userNotificationKeys.all });
    queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });
  }, [queryClient]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const room =
      user.role?.toLowerCase() === "admin" ? "admin" : (user.id as string);

    socket.emit("join", { room });

    const onNotification = () => {
      invalidateNotifications();
    };

    socket.on("notification", onNotification);

    return () => {
      socket.off("notification", onNotification);
      disconnectSocket();
    };
  }, [isAuthenticated, isLoading, user, invalidateNotifications]);

  return <>{children}</>;
};
