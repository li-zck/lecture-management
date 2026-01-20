"use client";

import { useCourseSemesters } from "@/components/ui/hooks/use-course-semesters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export default function CourseSemesterManagementPage() {
  const { courseSemesters, loading } = useCourseSemesters();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Schedule Management"
        description="Manage course offerings and schedule for each semester."
        backUrl="/admin"
        action={
          <Button asChild>
            <Link href="/admin/management/course-semester/create">
              <Plus className="mr-2 h-4 w-4" />
              Add New Schedule
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
          data={courseSemesters}
          entityType="course-semester"
        />
      )}
    </div>
  );
}
