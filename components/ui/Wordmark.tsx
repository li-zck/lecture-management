"use client";

import { cn, ROUTES } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export function Wordmark({
  className,
  href = ROUTES.mainSite.home,
}: {
  className?: string;
  /** Logo link (e.g. Navbar passes locale-aware home or dashboard) */
  href?: string;
}) {
  return (
    <Link
      className={cn("w-fit h-fit", className)}
      href={href}
      aria-label="Home"
    >
      <GraduationCap width={30} height={30} suppressHydrationWarning />
    </Link>
  );
}
