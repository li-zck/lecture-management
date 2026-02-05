"use client";

import { useManagementTab } from "@/app/admin/management/_hooks/use-management-tab";
import { useEnrollmentSessions } from "@/components/ui/hooks/use-enrollment-sessions";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
  adminEnrollmentSessionApi,
  type EnrollmentSession,
} from "@/lib/api/admin-enrollment-session";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { EnrollmentSessionOverviewChart } from "./_components/enrollment-session-overview-chart";
import { columns } from "./columns";

type TabId = "chart" | "table";

export default function EnrollmentSessionManagementPage() {
  const [activeTab, setActiveTab] = useManagementTab("edit-enrollment-session");
  const { enrollmentSessions, loading, refetch } = useEnrollmentSessions();
  const router = useRouter();
  const sortedEnrollmentSessions = useMemo(
    () => sortByUpdatedAtDesc(enrollmentSessions),
    [enrollmentSessions],
  );

  const handleBulkDelete = async (
    selectedItems: EnrollmentSession[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminEnrollmentSessionApi.deleteMultiple(ids);
      toast.success(
        `Successfully deleted ${selectedItems.length} enrollment session(s)`,
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete enrollment sessions");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: "Overview", icon: BarChart3 },
    { id: "table", label: "Edit sessions", icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollment Sessions"
        description="Manage enrollment periods when students can register for courses. Control when enrollment is open or closed."
        action={
          <Button asChild>
            <Link href="/admin/management/enrollment-session/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Session
            </Link>
          </Button>
        }
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

      {activeTab === "chart" && <EnrollmentSessionOverviewChart />}

      {activeTab === "table" && (
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">
                Loading enrollment sessions...
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={sortedEnrollmentSessions}
              entityType="enrollment-session"
              filterColumn="name"
              bulkDeleteHandlerAction={handleBulkDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
