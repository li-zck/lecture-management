"use client";

import { Button } from "@/components/ui/shadcn";
import { signOut } from "@/lib/auth";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { getUserRole } from "@/lib/utils";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function NotFoundHint() {
  return (
    <div>
      <NotFoundHintChild />
    </div>
  );
}

const NotFoundHintChild = () => {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const localePath = useLocalePath();
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    setAccessToken(accessToken);
    setUserRole(accessToken ? getUserRole(accessToken) : null);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      signOut();

      toast.success(dict.admin.signOut.success);

      window.location.href = localePath("/");
    } catch (error) {
      console.log("Error signing out:", error);
      toast.error(dict.admin.signOut.error);

      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <Button asChild>
        <Link href={localePath("/")}>{dict.success.returnHome}</Link>
      </Button>
    );
  }

  return (
    <>
      <div className="font-bold mb-5">
        You&apos;re signed in as:
        <p>{userRole}</p>
      </div>

      <span>
        <Button onClick={handleSignOut} disabled={isLoading}>
          {isLoading
            ? `${dict.admin.signOut.button}...`
            : dict.admin.signOut.button}
        </Button>
      </span>
    </>
  );
};
