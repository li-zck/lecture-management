"use client";

import { useManagementTab } from "@/app/admin/management/_hooks/use-management-tab";
import { useSemesters } from "@/components/ui/hooks/use-semesters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminSemesterApi, type Semester } from "@/lib/api/admin-semester";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { SemesterOverviewChart } from "./_components/semester-overview-chart";
import { columns } from "./columns";

type TabId = "chart" | "table";

export default function SemesterManagementPage() {
  const [activeTab, setActiveTab] = useManagementTab("edit-semester");
  const { semesters, loading, refetch } = useSemesters();
  const router = useRouter();
  const sortedSemesters = useMemo(
    () => sortByUpdatedAtDesc(semesters),
    [semesters],
  );

  const handleBulkDelete = async (
    selectedItems: Semester[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminSemesterApi.deleteMultiple(ids);
      toast.success(`Successfully deleted ${selectedItems.length} semester(s)`);
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete semesters");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: "Overview", icon: BarChart3 },
    { id: "table", label: "Edit semesters", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Semesters"
        description="Manage academic semesters and their periods."
        action={
          <Button asChild>
            <Link href="/admin/management/semester/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Semester
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

      {activeTab === "chart" && <SemesterOverviewChart />}

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
              data={sortedSemesters}
              entityType="semester"
              filterColumn="name"
              bulkDeleteHandlerAction={handleBulkDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
