"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { LecturerDashboard } from "@/components/dashboard/LecturerDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { useSession } from "@/components/provider/SessionProvider";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const { role, isAuthenticated, isLoading } = useSession();
  const d = dict.dashboard;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">{d.unauthorized}</h1>
        <p>{d.signInToView}</p>
      </div>
    );
  }

  switch (role.toLowerCase()) {
    case "student":
      return <StudentDashboard />;
    case "lecturer":
      return <LecturerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold">{d.unknownRole}</h1>
          <p>{d.roleNoDashboard.replace("{role}", role)}</p>
        </div>
      );
  }
}
