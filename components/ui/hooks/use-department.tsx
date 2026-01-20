"use client";

import { adminDepartmentApi, type Department } from "@/lib/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await adminDepartmentApi.getAll();
      setDepartments(data);
      setTotalDepartments(data.length);
    } catch {
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
