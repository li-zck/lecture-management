"use client";

import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export default function LecturerManagementPage() {
    const { lecturers, loading } = useLecturers();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Lecturer Management"
                description="Manage lecturer accounts, view details."
                action={
                    <Button asChild>
                        <Link href="/admin/management/lecturer/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Lecturer
                        </Link>
                    </Button>
                }
            />

            {loading ? (
                <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground">Loading specific data...</div>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={lecturers}
                    entityType="lecturer"
                    filterColumn="fullName"
                />
            )}
        </div>
    );
}

