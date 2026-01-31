"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { LecturerCourses } from "@/components/ui/LecturerCourses";
import { Button } from "@/components/ui/shadcn/button";
import { StudentCourses } from "@/components/ui/StudentCourses";
import Link from "next/link";

export default function MyCoursesPage() {
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
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-muted-foreground">Please sign in to view your courses.</p>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Admin Access</h1>
        <p className="text-muted-foreground">
          Please use the admin dashboard to manage courses.
        </p>
        <Link href="/admin">
          <Button>Go to Admin Dashboard</Button>
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
      <h1 className="text-2xl font-bold mb-4">Unknown Role</h1>
      <p className="text-muted-foreground">
        Your role ({role}) does not have a courses view.
      </p>
    </div>
  );
}
