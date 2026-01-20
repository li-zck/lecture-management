"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export default function DepartmentManagementPage() {
  const { departments, loading } = useDepartments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Management"
        description="Manage departments and assign heads."
        backUrl="/admin"
        action={
          <Button asChild>
            <Link href="/admin/management/department/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Department
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
          data={departments}
          entityType="department"
          filterColumn="name"
        />
      )}
    </div>
  );
}
