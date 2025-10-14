export type EntityWithIds = {
	id: string;
	studentId?: string;
	lecturerId?: string;
	departmentId?: string;
};

export const getEntityId = (entity: EntityWithIds): string => {
	return entity.id;
};

export const getDisplayId = (
	entity: EntityWithIds,
	type: "student" | "lecturer" | "department",
): string => {
	switch (type) {
		case "student":
			return entity.studentId || entity.id;
		case "lecturer":
			return entity.lecturerId || entity.id;
		case "department":
			return entity.departmentId || entity.id;
		default:
			return entity.id;
	}
};
