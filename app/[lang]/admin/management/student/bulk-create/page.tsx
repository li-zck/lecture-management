"use client";

import {
  BulkCreatePage,
  studentBulkConfig,
} from "@/components/admin/bulk-create";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/shadcn/button";
import { adminStudentApi } from "@/lib/api/admin-student";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale, useLocalePath } from "@/lib/i18n/use-locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkCreateStudentPage() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>[]) => {
    const result = await adminStudentApi.createMultiple(
      data as unknown as Parameters<typeof adminStudentApi.createMultiple>[0],
    );
    return { created: result.created };
  };

  const handleSuccess = () => {
    router.push(localePath("admin/management/student"));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={localePath("admin/management/student")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={dict.admin.bulkCreate.bulkCreateStudents}
          description={dict.admin.bulkCreate.bulkCreateStudentsDesc}
        />
      </div>

      <BulkCreatePage
        config={studentBulkConfig}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
