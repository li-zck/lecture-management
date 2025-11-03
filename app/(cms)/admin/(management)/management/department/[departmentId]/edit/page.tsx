import { UpdatePage } from "@/components/admin/update/UpdatePage";

type PageProps = {
	params: Promise<{ departmentId: string }>;
};

export default async function DepartmentEditPage({ params }: PageProps) {
	const { departmentId } = await params;

	return <UpdatePage entityType="department" entityId={departmentId} />;
}
