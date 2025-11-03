"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getAllAdmins } from "@/lib/admin/api/read/method";
import type { ReadAllAdminAccountsResponse } from "@/lib/types/dto/api/admin/response/read/read.dto";

export const useAdmins = () => {
  const [admins, setAdmins] = useState<ReadAllAdminAccountsResponse>([]);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await getAllAdmins();
      const admins = Array.isArray(res.data) ? res.data : [];

      setAdmins(admins);
      setTotalAdmins(admins.length);
    } catch (error) {
      toast.error("Failed to get admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return useMemo(
    () => ({
      admins,
      totalAdmins,
      loading,
      refetch: fetchAdmins,
    }),
    [admins, totalAdmins, loading, fetchAdmins],
  );
};
