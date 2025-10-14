"use client";

import { getAllLecturerAccounts } from "@/lib/admin/api/read/method";
import { ReadAllLecturerAccountResponse } from "@/lib/types/dto/api/admin/response/read/read.dto";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const useLecturers = () => {
	const [lecturers, setLecturers] = useState<ReadAllLecturerAccountResponse>(
		[],
	);
	const [totalLecturers, setTotalLecturers] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchLecturers = useCallback(async () => {
		try {
			const res = await getAllLecturerAccounts();
			const lecturers = Array.isArray(res.data) ? res.data : [];

			setLecturers(lecturers);
			setTotalLecturers(lecturers.length);
		} catch (error) {
			toast.error("Failed to get lecturer data");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLecturers();
	}, [fetchLecturers]);

	return useMemo(
		() => ({ lecturers, totalLecturers, loading, refetch: fetchLecturers }),
		[lecturers, totalLecturers, loading, fetchLecturers],
	);
};
