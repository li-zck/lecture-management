"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminCourseApi, Course } from "@/lib/api/admin-course";

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalCourses, setTotalCourses] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCourses = useCallback(async () => {
        try {
            const data = await adminCourseApi.getAll({ includeDepartment: true });
            setCourses(data);
            setTotalCourses(data.length);
        } catch (error) {
            toast.error("Failed to get course data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return useMemo(
        () => ({ courses, totalCourses, loading, refetch: fetchCourses }),
        [courses, totalCourses, loading, fetchCourses],
    );
};
