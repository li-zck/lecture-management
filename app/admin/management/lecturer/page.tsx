"use client";

import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminLecturerApi, type LecturerAdmin } from "@/lib/api/admin-lecturer";
import { BarChart3, Plus, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LecturerOverviewChart } from "./_components/lecturer-overview-chart";
import { columns } from "./columns";

type TabId = "chart" | "table";

export default function LecturerManagementPage() {
  const { lecturers, loading, refetch } = useLecturers();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("chart");

  const handleBulkDelete = async (
    selectedItems: LecturerAdmin[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminLecturerApi.deleteMultiple(ids);
      toast.success(`Successfully deleted ${selectedItems.length} lecturer(s)`);
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete lecturers");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: "Overview", icon: BarChart3 },
    { id: "table", label: "Edit lecturers", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lecturers"
        description="Manage lecturer accounts and course assignments."
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/management/lecturer/bulk-create">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Create
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/management/lecturer/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Lecturer
              </Link>
            </Button>
          </div>
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

      {activeTab === "chart" && <LecturerOverviewChart />}

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
              data={lecturers}
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
