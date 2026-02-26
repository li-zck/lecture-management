"use client";

import { getClientDictionary, useLocalePath } from "@/lib/i18n";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "../provider/SessionProvider";
import { Button } from "./shadcn/button";

const SignOutButton = () => {
  const router = useRouter();
  const { logout } = useSession();
  const localePath = useLocalePath();
  const dict = getClientDictionary("en" as any); // will be overridden by layout locale in practice

  const handleLogout = async () => {
    try {
      if (!Cookies.get("accessToken")) {
        console.log("Access token not found");
      }

      logout();

      toast.success(dict.admin.signOut.success);

      router.push(localePath("/"));
    } catch {
      console.error("Something went wrong");

      toast.error(dict.admin.signOut.error);
    }
  };

  return <Button onClick={handleLogout}>{dict.nav.signOut}</Button>;
};

export default SignOutButton;
