import { DetailsPage } from "@/components/admin/view";

export default async function StudentDetailsPage({
	params,
}: {
	params: Promise<{ studentId: string }>;
}) {
	const { studentId } = await params;

	return (
		<div>
			<DetailsPage entityId={studentId} entityType="student" />
		</div>
	);
}
