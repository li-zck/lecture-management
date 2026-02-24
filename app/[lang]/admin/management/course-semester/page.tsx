"use client";

import { useManagementTab } from "@/app/[lang]/admin/management/_hooks/use-management-tab";
import { useCourseSemesters } from "@/components/ui/hooks/use-course-semesters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { DataTable } from "@/components/ui/table/DataTable";
import {
  adminCourseSemesterApi,
  type CourseSemester,
} from "@/lib/api/admin-course-semester";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { CourseSemesterOverviewChart } from "./_components/course-semester-overview-chart";
import { getColumns } from "./columns";

type TabId = "chart" | "table";

export default function CourseSemesterManagementPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const [activeTab, setActiveTab] = useManagementTab("edit-course-semester");
  const { courseSemesters, loading, refetch } = useCourseSemesters();
  const router = useRouter();
  const columns = useMemo(() => getColumns(dict), [dict]);
  const sortedCourseSemesters = useMemo(
    () => sortByUpdatedAtDesc(courseSemesters),
    [courseSemesters],
  );

  const handleBulkDelete = async (
    selectedItems: CourseSemester[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminCourseSemesterApi.deleteMultiple(ids);
      toast.success(
        dict.admin.common.bulkDeleteSuccess
          .replace("{count}", String(selectedItems.length))
          .replace("{entity}", "course-semester(s)"),
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          dict.admin.common.bulkDeleteFailed.replace(
            "{entity}",
            "course-semesters",
          ),
      );
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: dict.admin.management.overview, icon: BarChart3 },
    {
      id: "table",
      label: dict.admin.management.editSchedules,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.courseSemesters.title}
        description={dict.admin.courseSemesters.manageDescription}
        action={
          <Button asChild>
            <Link href="/admin/management/course-semester/create">
              <Plus className="mr-2 h-4 w-4" />
              {dict.admin.management.addNewSchedule}
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
                {dict.admin.common.loadingData}
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={sortedCourseSemesters}
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
