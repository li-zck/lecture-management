"use client";

import { useManagementTab } from "@/app/[lang]/admin/management/_hooks/use-management-tab";
import { useEnrollments } from "@/components/ui/hooks/use-enrollments";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
  adminEnrollmentApi,
  type Enrollment,
} from "@/lib/api/admin-enrollment";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { EnrollmentOverviewChart } from "./_components/enrollment-overview-chart";
import { getColumns } from "./columns";

type TabId = "chart" | "table";

export default function EnrollmentManagementPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const [activeTab, setActiveTab] = useManagementTab("edit-enrollment");
  const { enrollments, loading, refetch } = useEnrollments();
  const router = useRouter();
  const columns = useMemo(() => getColumns(dict), [dict]);
  const sortedEnrollments = useMemo(
    () => sortByUpdatedAtDesc(enrollments),
    [enrollments],
  );

  const handleBulkDelete = async (
    selectedItems: Enrollment[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminEnrollmentApi.deleteMultiple(ids);
      toast.success(
        dict.admin.enrollments.bulkRemoved.replace(
          "{count}",
          String(selectedItems.length),
        ),
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message ?? dict.admin.enrollments.bulkRemoveFailed);
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: dict.admin.management.overview, icon: BarChart3 },
    {
      id: "table",
      label: dict.admin.management.allEnrollments,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.enrollments.title}
        description={dict.admin.enrollments.manageDescription}
      />

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

      {activeTab === "chart" && <EnrollmentOverviewChart />}

      {activeTab === "table" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">
                {dict.admin.enrollments.loadingEnrollments}
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={sortedEnrollments}
              entityType="enrollment"
              filterColumn="student"
              bulkDeleteHandlerAction={handleBulkDelete}
              entityName="enrollment"
            />
          )}
        </div>
      )}
    </div>
  );
}
