"use client";

import { useManagementTab } from "@/app/[lang]/admin/management/_hooks/use-management-tab";
import { useStudents } from "@/components/ui/hooks/use-students";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { DataTable } from "@/components/ui/table/DataTable";
import {
  adminStudentApi,
  type StudentAdmin,
  type StudentSearchParams,
} from "@/lib/api/admin-student";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { sortByUpdatedAtDesc } from "@/lib/utils";
import { BarChart3, GraduationCap, Plus, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { StudentOverviewChart } from "./_components/student-overview-chart";
import { getColumns } from "./columns";

type TabId = "chart" | "table";
type SearchBy = "email" | "studentId" | "username" | "citizenId" | "phone";

export default function StudentManagementPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const [activeTab, setActiveTab] = useManagementTab("edit-student");
  const [searchInput, setSearchInput] = useState("");
  const [searchBy, setSearchBy] = useState<SearchBy>("email");
  const [appliedSearch, setAppliedSearch] =
    useState<StudentSearchParams | null>(null);

  const searchParams: StudentSearchParams | null =
    appliedSearch && Object.values(appliedSearch).some(Boolean)
      ? appliedSearch
      : null;

  const { students, loading, refetch } = useStudents(searchParams);
  const router = useRouter();
  const columns = useMemo(() => getColumns(dict), [dict]);
  const sortedStudents = useMemo(
    () => sortByUpdatedAtDesc(students),
    [students],
  );

  const handleBulkDelete = async (
    selectedItems: StudentAdmin[],
    onSuccess?: () => void,
  ) => {
    try {
      const ids = selectedItems.map((item) => item.id);
      await adminStudentApi.deleteMultiple(ids);
      toast.success(
        dict.admin.common.bulkDeleteSuccess
          .replace("{count}", String(selectedItems.length))
          .replace("{entity}", "student(s)"),
      );
      refetch();
      router.refresh();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(
        err?.message ||
          dict.admin.common.bulkDeleteFailed.replace("{entity}", "students"),
      );
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
    { id: "chart", label: dict.admin.management.overview, icon: BarChart3 },
    {
      id: "table",
      label: dict.admin.management.editStudents,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.admin.sidebar.students}
        description={dict.admin.students.manageDescription}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={localePath("admin/management/student/bulk-create")}>
                <Upload className="mr-2 h-4 w-4" />
                {dict.admin.management.bulkCreate}
              </Link>
            </Button>
            <Button asChild>
              <Link href={localePath("admin/management/student/create")}>
                <Plus className="mr-2 h-4 w-4" />
                {dict.admin.management.createNew}
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

      {activeTab === "chart" && <StudentOverviewChart />}

      {activeTab === "table" && (
        <div className="w-full space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={searchBy}
              onValueChange={(v) => setSearchBy(v as SearchBy)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">{dict.admin.common.email}</SelectItem>
                <SelectItem value="studentId">
                  {dict.admin.students.studentId}
                </SelectItem>
                <SelectItem value="username">
                  {dict.admin.common.username}
                </SelectItem>
                <SelectItem value="citizenId">
                  {dict.admin.common.citizenId}
                </SelectItem>
                <SelectItem value="phone">{dict.admin.common.phone}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={dict.admin.table.filterPlaceholder ?? "Search..."}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setAppliedSearch(
                    searchInput.trim()
                      ? { [searchBy]: searchInput.trim() }
                      : null,
                  );
                }
              }}
              className="max-w-xs"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setAppliedSearch(
                  searchInput.trim()
                    ? { [searchBy]: searchInput.trim() }
                    : null,
                )
              }
            >
              <Search className="mr-2 h-4 w-4" />
              {dict.admin.header.search ?? "Search"}
            </Button>
            {appliedSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  setAppliedSearch(null);
                }}
              >
                {dict.admin.bulkCreate.clear ?? "Clear"}
              </Button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">
                {dict.admin.common.loadingData}
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={sortedStudents}
              entityType="student"
              filterColumn="fullName"
              bulkDeleteHandlerAction={handleBulkDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
