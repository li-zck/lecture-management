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
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, Building2, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { DepartmentStudentChart } from "./_components/department-student-chart";
import { getColumns } from "./columns";

type TabId = "chart" | "table";

export default function DepartmentManagementPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const [activeTab, setActiveTab] = useManagementTab("edit-department");
  const { departments, loading, refetch } = useDepartments();
  const router = useRouter();
  const columns = useMemo(() => getColumns(dict), [dict]);
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
        dict.admin.common.bulkDeleteSuccess
          .replace("{count}", String(selectedItems.length))
          .replace("{entity}", "department(s)"),
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          dict.admin.common.bulkDeleteFailed.replace("{entity}", "departments"),
      );
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: dict.admin.management.overview, icon: BarChart3 },
    {
      id: "table",
      label: dict.admin.management.editDepartments,
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.sidebar.departments}
        description={dict.admin.departments.manageDescription}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link
                href={localePath("admin/management/department/bulk-create")}
              >
                <Upload className="mr-2 h-4 w-4" />
                {dict.admin.management.bulkCreate}
              </Link>
            </Button>
            <Button asChild>
              <Link href={localePath("admin/management/department/create")}>
                <Plus className="mr-2 h-4 w-4" />
                {dict.admin.management.createNewDepartment}
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
                {dict.admin.common.loadingData}
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
