"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminCourseSemesterApi, CourseSemester } from "@/lib/api/admin-course-semester";

export const useCourseSemesters = () => {
    const [courseSemesters, setCourseSemesters] = useState<CourseSemester[]>([]);
    const [totalCourseSemesters, setTotalCourseSemesters] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCourseSemesters = useCallback(async () => {
        try {
            const data = await adminCourseSemesterApi.getAll();
            setCourseSemesters(data);
            setTotalCourseSemesters(data.length);
        } catch (error) {
            toast.error("Failed to get course offering data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourseSemesters();
    }, [fetchCourseSemesters]);

    return useMemo(
        () => ({ courseSemesters, totalCourseSemesters, loading, refetch: fetchCourseSemesters }),
        [courseSemesters, totalCourseSemesters, loading, fetchCourseSemesters],
    );
};
