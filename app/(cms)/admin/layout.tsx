"use client";

import Navbar from "@/components/admin/Navbar";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignInPage = pathname === "/admin/sign-in";

  return (
    <div className="mt-4">
      {!isSignInPage && <Navbar />}
      {children}
    </div>
  );
}
