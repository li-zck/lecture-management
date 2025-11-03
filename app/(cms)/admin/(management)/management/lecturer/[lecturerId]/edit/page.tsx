import { UpdatePage } from "@/components/admin/update/UpdatePage";

type PageProps = {
	params: Promise<{ lecturerId: string }>;
};

export default async function LecturerEditPage({ params }: PageProps) {
	const { lecturerId } = await params;

	return <UpdatePage entityType="lecturer" entityId={lecturerId} />;
}
