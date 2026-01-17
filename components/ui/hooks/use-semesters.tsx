"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminSemesterApi, Semester } from "@/lib/api/admin-semester";

export const useSemesters = () => {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [totalSemesters, setTotalSemesters] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchSemesters = useCallback(async () => {
        try {
            const data = await adminSemesterApi.getAll();
            setSemesters(data);
            setTotalSemesters(data.length);
        } catch (error) {
            toast.error("Failed to get semester data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSemesters();
    }, [fetchSemesters]);

    return useMemo(
        () => ({ semesters, totalSemesters, loading, refetch: fetchSemesters }),
        [semesters, totalSemesters, loading, fetchSemesters],
    );
};
