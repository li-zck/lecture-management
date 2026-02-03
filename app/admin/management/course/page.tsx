"use client";

import { useCourses } from "@/components/ui/hooks/use-courses";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import { adminCourseApi, type Course } from "@/lib/api/admin-course";
import { BarChart3, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CourseOverviewChart } from "./_components/course-overview-chart";
import { columns } from "./columns";

type TabId = "chart" | "table";

export default function CourseManagementPage() {
  const { courses, loading, refetch } = useCourses();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("chart");

  const handleBulkDelete = async (
    selectedItems: Course[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminCourseApi.deleteMultiple(ids);
      toast.success(`Successfully deleted ${selectedItems.length} course(s)`);
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete courses");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: "Overview", icon: BarChart3 },
    { id: "table", label: "Edit courses", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage courses, credits, and department assignments."
        action={
          <Button asChild>
            <Link href="/admin/management/course/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
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

      {activeTab === "chart" && <CourseOverviewChart />}

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
              data={courses}
              entityType="course"
              filterColumn="name"
              bulkDeleteHandlerAction={handleBulkDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
