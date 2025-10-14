"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { RenderEntityDetails } from "@/components/ui/RenderEntityDetails";
import { Button } from "@/components/ui/shadcn/button";
import {
	getDepartmentById,
	getLecturerById,
	getStudentById,
} from "@/lib/admin/api/read/method";
import {
	DepartmentResponse,
	LecturerAccountResponse,
	StudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/read/read.dto";

type DetailsPageProps = {
	entityType: "student" | "lecturer" | "department";
	entityId: string;
};

export const DetailsPage = ({ entityType, entityId }: DetailsPageProps) => {
	const router = useRouter();
	const [entityData, setEntityData] = useState<
		StudentAccountResponse | LecturerAccountResponse | DepartmentResponse | null
	>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchEntityData = async () => {
			try {
				setLoading(true);

				let response:
					| {
							data:
								| StudentAccountResponse
								| LecturerAccountResponse
								| DepartmentResponse;
					  }
					| undefined;

				switch (entityType) {
					case "student":
						response = await getStudentById(entityId);
						break;
					case "lecturer":
						response = await getLecturerById(entityId);
						break;
					case "department":
						response = await getDepartmentById(entityId);
						break;
				}

				if (response) {
					setEntityData(response.data);
				}
			} catch (error) {
				setError("Failed to load entity data");
			} finally {
				setLoading(false);
			}
		};

		if (entityId) {
			fetchEntityData();
		}
	}, [entityType, entityId]);

	const handleBack = () => {
		router.push(`/admin/management/${entityType}`);
	};

	const handleEdit = () => {
		// router.push(`/admin/management/${entityType}/${entityId}/edit`);
		console.log("Editing...");
	};

	const handleDelete = async () => {
		console.log("Deleting...");
		// if (confirm("Are you sure you want to delete this entity?")) {
		// 	try {
		// 		// await deleteEntity(entityType, entityId);
		// 		router.push(`/admin/management/${entityType}`);
		// 	} catch (_error) {
		// 		setError("Failed to delete entity");
		// 	}
		// }
	};

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold capitalize">
						{entityType} Details
					</h1>
					<span className="text-sm text-gray-500">ID: {entityId}</span>
				</div>

				{/* Content based on entity type */}
				{loading ? (
					<div className="flex justify-center p-8">
						<div className="text-gray-500">Loading...</div>
					</div>
				) : error ? (
					<div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
				) : entityData ? (
					<RenderEntityDetails entityType={entityType} data={entityData} />
				) : (
					<div className="text-gray-500 p-4">No data found</div>
				)}

				{/* Actions */}
				<div className="flex gap-4 mt-8">
					<Button variant="outline" onClick={handleEdit}>
						Edit
					</Button>
					<Button variant="destructive" onClick={handleDelete}>
						Delete
					</Button>
					<Button variant="ghost" onClick={handleBack}>
						Back
					</Button>
				</div>
			</div>
		</div>
	);
};
