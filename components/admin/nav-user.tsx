"use client";

import { useSession } from "@/components/provider/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { logout } from "@/lib/auth";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { ChevronsUpDown, LogOut, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavUser() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const { user, isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/sign-in");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-md p-2 animate-pulse">
        <div className="h-8 w-8 rounded-lg bg-muted" />
        <div className="flex-1 space-y-1">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-3 w-28 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-sidebar-accent transition-colors"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold">
              {dict.admin.navUser.admin}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email || dict.admin.navUser.administrator}
            </p>
          </div>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        side="top"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold">
                {dict.admin.navUser.admin}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email || dict.admin.navUser.administrator}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 size-4" />
          {dict.admin.navUser.profile}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 size-4" />
          {dict.admin.navUser.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
