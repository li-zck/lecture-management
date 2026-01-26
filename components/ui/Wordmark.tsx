"use client";

import { cn, ROUTES } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link className={cn("w-fit h-fit", className)} href={ROUTES.mainSite.home}>
      <GraduationCap width={30} height={30} suppressHydrationWarning />
    </Link>
  );
}
