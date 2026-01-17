"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { LecturerDashboard } from "@/components/dashboard/LecturerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
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
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
                <p>Please sign in to view this page.</p>
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
                    <h1 className="text-2xl font-bold">Unknown Role</h1>
                    <p>Your role ({role}) does not have a dashboard.</p>
                </div>
            );
    }
}
