"use client";

import { useManagementTab } from "@/app/admin/management/_hooks/use-management-tab";
import { useEnrollments } from "@/components/ui/hooks/use-enrollments";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
  adminEnrollmentApi,
  type Enrollment,
} from "@/lib/api/admin-enrollment";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { EnrollmentOverviewChart } from "./_components/enrollment-overview-chart";
import { columns } from "./columns";

type TabId = "chart" | "table";

export default function EnrollmentManagementPage() {
  const [activeTab, setActiveTab] = useManagementTab("edit-enrollment");
  const { enrollments, loading, refetch } = useEnrollments();
  const router = useRouter();
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
        `Successfully removed ${selectedItems.length} enrollment(s)`,
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message ?? "Failed to remove enrollments");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: "Overview", icon: BarChart3 },
    { id: "table", label: "All enrollments", icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollments"
        description="View and manage course enrollments, grades, and statistics."
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
                Loading enrollments...
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
