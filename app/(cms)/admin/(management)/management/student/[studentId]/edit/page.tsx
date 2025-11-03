import { UpdatePage } from "@/components/admin/update/UpdatePage";

type PageProps = {
	params: Promise<{ studentId: string }>;
};

export default async function StudentEditPage({ params }: PageProps) {
	const { studentId } = await params;

	return <UpdatePage entityType="student" entityId={studentId} />;
}
