import { DetailsPage } from "@/components/admin/view";

export default async function StudentDetailsPage({
	params,
}: {
	params: Promise<{ lecturerId: string }>;
}) {
	const { lecturerId } = await params;

	return (
		<div>
			<DetailsPage entityId={lecturerId} entityType="lecturer" />
			Lecturer ID: {lecturerId}
		</div>
	);
}
