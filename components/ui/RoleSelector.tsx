"use client";

import type { roleQuerySchema } from "@/lib/zod/schemas/navigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { z } from "zod";

export type Role = "student" | "lecturer";

export type Props = {
  value: Role;
  onChange: (next: Role) => void;
};

export type RoleQuerySchema = z.infer<typeof roleQuerySchema>;

export function RoleSelector({ value, onChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setRole = useCallback(
    (nextRole: "student" | "lecturer") => {
      onChange(nextRole);

      const params = new URLSearchParams(searchParams.toString());

      params.set("role", nextRole);

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      router.replace(url, { scroll: false });
    },
    [router, pathname, searchParams, onChange],
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground text-center">
        Select your role
      </p>

      {/* Segmented Control */}
      <div className="relative bg-muted p-1 rounded-lg inline-flex w-full">
        {/* Background slider for active state */}
        <div
          className={`absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-all duration-200 ease-in-out ${
            value === "student" ? "left-1 right-[50%]" : "left-[50%] right-1"
          }`}
        />

        {/* Student Button */}
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            value === "student"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student</span>
        </button>

        {/* Lecturer Button */}
        <button
          type="button"
          onClick={() => setRole("lecturer")}
          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            value === "lecturer"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lecturer</span>
        </button>
      </div>
    </div>
  );
}
