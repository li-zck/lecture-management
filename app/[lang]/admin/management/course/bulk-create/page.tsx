"use client";

import {
  BulkCreatePage,
  courseBulkConfig,
} from "@/components/admin/bulk-create";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { adminCourseApi } from "@/lib/api/admin-course";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkCreateCoursePage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>[]) => {
    const payload = data.map((row) => ({
      name: String(row.name),
      credits: Number(row.credits),
      ...(row.departmentId
        ? { departmentId: String(row.departmentId).trim() }
        : {}),
      ...(row.recommendedSemester
        ? { recommendedSemester: String(row.recommendedSemester).trim() }
        : {}),
      ...(row.description
        ? { description: String(row.description).trim() }
        : {}),
    }));
    const result = await adminCourseApi.createMultiple(payload);
    return { created: result.created };
  };

  const handleSuccess = () => {
    router.push(localePath("admin/management/course"));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={localePath("admin/management/course")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={dict.admin.bulkCreate.bulkCreateCourses}
          description={dict.admin.bulkCreate.bulkCreateCoursesDesc}
        />
      </div>

      <BulkCreatePage
        config={courseBulkConfig}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
