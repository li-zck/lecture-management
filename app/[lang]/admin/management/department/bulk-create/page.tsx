"use client";

import {
  BulkCreatePage,
  departmentBulkConfig,
} from "@/components/admin/bulk-create";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { adminDepartmentApi } from "@/lib/api/admin-department";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkCreateDepartmentPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>[]) => {
    const result = await adminDepartmentApi.createMultiple(
      data as unknown as Parameters<
        typeof adminDepartmentApi.createMultiple
      >[0],
    );
    return { created: result.created };
  };

  const handleSuccess = () => {
    router.push(localePath("admin/management/department"));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={localePath("admin/management/department")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={dict.admin.bulkCreate.bulkCreateDepartments}
          description={dict.admin.bulkCreate.bulkCreateDepartmentsDesc}
        />
      </div>

      <BulkCreatePage
        config={departmentBulkConfig}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
