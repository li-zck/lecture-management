"use client";

import { useCourseSemesters } from "@/components/ui/hooks/use-course-semesters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
  adminCourseSemesterApi,
  type CourseSemester,
} from "@/lib/api/admin-course-semester";
import { BarChart3, CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CourseSemesterOverviewChart } from "./_components/course-semester-overview-chart";
import { columns } from "./columns";

type TabId = "chart" | "table";

export default function CourseSemesterManagementPage() {
  const { courseSemesters, loading, refetch } = useCourseSemesters();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("chart");

  const handleBulkDelete = async (
    selectedItems: CourseSemester[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminCourseSemesterApi.deleteMultiple(ids);
      toast.success(
        `Successfully deleted ${selectedItems.length} course-semester(s)`,
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete course-semesters");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: "Overview", icon: BarChart3 },
    { id: "table", label: "Edit schedules", icon: CalendarDays },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course-Semesters"
        description="Manage course offerings and schedule for each semester."
        action={
          <Button asChild>
            <Link href="/admin/management/course-semester/create">
              <Plus className="mr-2 h-4 w-4" />
              Add New Schedule
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

      {activeTab === "chart" && <CourseSemesterOverviewChart />}

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
              data={courseSemesters}
              entityType="course-semester"
              bulkDeleteHandlerAction={handleBulkDelete}
              entityName="schedule"
            />
          )}
        </div>
      )}
    </div>
  );
}
