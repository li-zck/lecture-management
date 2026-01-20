"use client";

import { useCourses } from "@/components/ui/hooks/use-courses";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export default function CourseManagementPage() {
    const { courses, loading } = useCourses();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Course Management"
                description="Manage courses, credits, and department assignments."
                backUrl="/admin"
                action={
                    <Button asChild>
                        <Link href="/admin/management/course/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Course
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
                    data={courses}
                    entityType="course"
                    filterColumn="name"
                />
            )}
        </div>
    );
}

