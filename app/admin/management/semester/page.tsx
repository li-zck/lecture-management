"use client";

import { useSemesters } from "@/components/ui/hooks/use-semesters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export default function SemesterManagementPage() {
    const { semesters, loading } = useSemesters();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Semester Management"
                description="Manage academic semesters and their periods."
                backUrl="/admin"
                action={
                    <Button asChild>
                        <Link href="/admin/management/semester/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Semester
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
                    data={semesters}
                    entityType="semester"
                    filterColumn="name"
                />
            )}
        </div>
    );
}

