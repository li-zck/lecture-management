import { DetailsPage } from "@/components/admin/view";

export default async function StudentDetailsPage({
	params,
}: {
	params: Promise<{ departmentId: string }>;
}) {
	const { departmentId } = await params;

	return (
		<div>
			<DetailsPage entityId={departmentId} entityType="department" />
		</div>
	);
}
