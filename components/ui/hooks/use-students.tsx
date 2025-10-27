"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getAllStudentAccounts } from "@/lib/admin/api/read/method";
import type { ReadAllStudentAccountsResponse } from "@/lib/types/dto/api/admin/response/read/read.dto";

export const useStudents = () => {
	const [students, setStudents] = useState<ReadAllStudentAccountsResponse>([]);
	const [totalStudents, setTotalStudents] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchStudents = useCallback(async () => {
		try {
			const res = await getAllStudentAccounts();
			const students = Array.isArray(res.data) ? res.data : [];

			setStudents(students);
			setTotalStudents(students.length);
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
