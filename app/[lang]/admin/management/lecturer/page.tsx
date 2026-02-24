"use client";

import { useManagementTab } from "@/app/[lang]/admin/management/_hooks/use-management-tab";
import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminLecturerApi, type LecturerAdmin } from "@/lib/api/admin-lecturer";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, Plus, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { LecturerOverviewChart } from "./_components/lecturer-overview-chart";
import { getColumns } from "./columns";

type TabId = "chart" | "table";

export default function LecturerManagementPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const [activeTab, setActiveTab] = useManagementTab("edit-lecturer");
  const { lecturers, loading, refetch } = useLecturers();
  const router = useRouter();
  const columns = useMemo(() => getColumns(dict), [dict]);
  const sortedLecturers = useMemo(
    () => sortByUpdatedAtDesc(lecturers),
    [lecturers],
  );

  const handleBulkDelete = async (
    selectedItems: LecturerAdmin[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminLecturerApi.deleteMultiple(ids);
      toast.success(
        dict.admin.common.bulkDeleteSuccess
          .replace("{count}", String(selectedItems.length))
          .replace("{entity}", "lecturer(s)"),
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          dict.admin.common.bulkDeleteFailed.replace("{entity}", "lecturers"),
      );
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: dict.admin.management.overview, icon: BarChart3 },
    { id: "table", label: dict.admin.management.editLecturers, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.sidebar.lecturers}
        description={dict.admin.lecturers.manageDescription}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={localePath("admin/management/lecturer/bulk-create")}>
                <Upload className="mr-2 h-4 w-4" />
                {dict.admin.management.bulkCreate}
              </Link>
            </Button>
            <Button asChild>
              <Link href={localePath("admin/management/lecturer/create")}>
                <Plus className="mr-2 h-4 w-4" />
                {dict.admin.management.createNewLecturer}
              </Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
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

      {activeTab === "chart" && <LecturerOverviewChart />}

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
              data={sortedLecturers}
              entityType="lecturer"
              filterColumn="fullName"
              bulkDeleteHandlerAction={handleBulkDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
