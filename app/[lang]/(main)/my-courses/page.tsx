"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { LecturerCourses } from "@/components/ui/LecturerCourses";
import { Button } from "@/components/ui/shadcn/button";
import { StudentCourses } from "@/components/ui/StudentCourses";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import Link from "next/link";

export default function MyCoursesPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const { role, isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">{dict.myCourses.unauthorized}</h1>
        <p className="text-muted-foreground">{dict.myCourses.signInToView}</p>
        <Link href={localePath("sign-in")}>
          <Button>{dict.myCourses.signIn}</Button>
        </Link>
      </div>
    );
  }

  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">{dict.myCourses.adminAccess}</h1>
        <p className="text-muted-foreground">
          {dict.myCourses.useAdminDashboard}
        </p>
        <Link href={localePath("admin")}>
          <Button>{dict.myCourses.goToAdmin}</Button>
        </Link>
      </div>
    );
  }

  if (normalizedRole === "student") {
    return <StudentCourses />;
  }

  if (normalizedRole === "lecturer") {
    return <LecturerCourses />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{dict.myCourses.unknownRole}</h1>
      <p className="text-muted-foreground">
        {dict.myCourses.roleNoView.replace("{role}", role || "")}
      </p>
    </div>
  );
}
