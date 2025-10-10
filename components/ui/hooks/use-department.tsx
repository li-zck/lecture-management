"use client";

import { getAllDepartments } from "@/lib/admin/api/read/method";
import { ReadAllDepartmentResponse } from "@/lib/types/dto/api/admin/response/read/read-account.dto";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const useDepartments = () => {
	const [departments, setDepartments] = useState<ReadAllDepartmentResponse>([]);
	const [totalDepartments, setTotalDepartments] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchDepartments = useCallback(async () => {
		try {
			const res = await getAllDepartments();
			const departments = Array.isArray(res.data) ? res.data : [];

			setDepartments(departments);
			setTotalDepartments(departments.length);
		} catch (error) {
			toast.error("Failed to get department data");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDepartments();
	}, [fetchDepartments]);

	return useMemo(
		() => ({
			departments,
			totalDepartments,
			loading,
			refetch: fetchDepartments,
		}),
		[departments, totalDepartments, loading, fetchDepartments],
	);
};
