"use client";

import { getAllAdmins } from "@/lib/admin/api/read/method";
import { queryKeys } from "@/lib/query";
import type { ReadAllAdminAccountsResponse } from "@/lib/types/dto/api/admin/response/read/read.dto";
import { useQuery } from "@tanstack/react-query";

export const useAdmins = () => {
  const query = useQuery({
    queryKey: queryKeys.admins.lists(),
    queryFn: async () => {
      const res = await getAllAdmins();
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  return {
    admins: (query.data ?? []) as ReadAllAdminAccountsResponse,
    totalAdmins: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
