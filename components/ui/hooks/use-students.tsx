"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminStudentApi, StudentAdmin } from "@/lib/api";

export const useStudents = () => {
	const [students, setStudents] = useState<StudentAdmin[]>([]);
	const [totalStudents, setTotalStudents] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchStudents = useCallback(async () => {
		try {
			const data = await adminStudentApi.getAll();
			setStudents(data);
			setTotalStudents(data.length);
		} catch (error) {
			toast.error("Failed to get student data");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStudents();
	}, [fetchStudents]);

	return useMemo(
		() => ({ students, totalStudents, loading, refetch: fetchStudents }),
		[students, totalStudents, loading, fetchStudents],
	);
};
