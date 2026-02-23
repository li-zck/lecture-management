"use client";

import { documentApi } from "@/lib/api/document";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { CourseDocument } from "@/lib/api/document";

/**
 * Hook for fetching all documents
 */
export const useDocuments = () => {
  const query = useQuery({
    queryKey: queryKeys.documents.lists(),
    queryFn: () => documentApi.getAll(),
  });

  return {
    documents: query.data ?? [],
    totalDocuments: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single document by ID
 */
export const useDocument = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.documents.detail(id ?? ""),
    queryFn: () => documentApi.getById(id!),
    enabled: !!id,
  });

  return {
    document: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
