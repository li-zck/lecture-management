"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Button } from "@/components/ui/shadcn/button";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { ROUTES } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignOutButton = () => {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const { logout } = useSession();

  const handleLogout = async () => {
    try {
      if (!Cookies.get("accessToken")) {
        console.log("Access token not found");
      }
      logout();
      toast.success(dict.admin.signOut.success);
      router.push(ROUTES.adminSite.auth.signin);
    } catch {
      console.error("Something went wrong");

      toast.error(dict.admin.signOut.error);
    }
  };

  return <Button onClick={handleLogout}>{dict.admin.signOut.button}</Button>;
};
