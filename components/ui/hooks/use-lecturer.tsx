"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminLecturerApi, LecturerAdmin } from "@/lib/api";

export const useLecturers = () => {
	const [lecturers, setLecturers] = useState<LecturerAdmin[]>([]);
	const [totalLecturers, setTotalLecturers] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchLecturers = useCallback(async () => {
		try {
			const data = await adminLecturerApi.getAll();
			setLecturers(data);
			setTotalLecturers(data.length);
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
