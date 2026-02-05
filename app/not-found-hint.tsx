"use client";

import { Button } from "@/components/ui/shadcn";
import { signOut } from "@/lib/auth";
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

      toast.success("Signed out successfully");

      window.location.href = "/";
    } catch (error) {
      console.log("Error signing out:", error);
      toast.error("Failed to sign out");

      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <Button asChild>
        <Link href="/">Return home</Link>
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
          {isLoading ? "Signing out..." : "Sign out"}
        </Button>
      </span>
    </>
  );
};
