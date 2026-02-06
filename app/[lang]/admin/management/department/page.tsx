"use client";

import { useManagementTab } from "@/app/[lang]/admin/management/_hooks/use-management-tab";
import { useDepartments } from "@/components/ui/hooks/use-department";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
  adminDepartmentApi,
  type Department,
} from "@/lib/api/admin-department";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, Building2, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { DepartmentStudentChart } from "./_components/department-student-chart";
import { columns } from "./columns";

type TabId = "chart" | "table";

export default function DepartmentManagementPage() {
  const [activeTab, setActiveTab] = useManagementTab("edit-department");
  const { departments, loading, refetch } = useDepartments();
  const router = useRouter();
  const sortedDepartments = useMemo(
    () => sortByUpdatedAtDesc(departments),
    [departments],
  );

  const handleBulkDelete = async (
    selectedItems: Department[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminDepartmentApi.deleteMultiple(ids);
      toast.success(
        `Successfully deleted ${selectedItems.length} department(s)`,
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete departments");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: "Overview", icon: BarChart3 },
    { id: "table", label: "Edit departments", icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage departments and assign heads."
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/management/department/bulk-create">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Create
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/management/department/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Department
              </Link>
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "chart" && <DepartmentStudentChart />}

      {activeTab === "table" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">
                Loading specific data...
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={sortedDepartments}
              entityType="department"
              filterColumn="name"
              bulkDeleteHandlerAction={handleBulkDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
