"use client";

import {
  examScheduleApi,
  lecturerExamScheduleApi,
  studentExamScheduleApi,
} from "@/lib/api/exam-schedule";
import { queryKeys } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export type { PublicExamSchedule } from "@/lib/api/exam-schedule";

/**
 * Hook for fetching all public exam schedules
 */
export const usePublicExamSchedules = () => {
  const query = useQuery({
    queryKey: queryKeys.publicExamSchedules.lists(),
    queryFn: () => examScheduleApi.getAll(),
  });

  return {
    examSchedules: query.data ?? [],
    totalExamSchedules: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching a single public exam schedule by ID
 */
export const usePublicExamSchedule = (id: string | null) => {
  const query = useQuery({
    queryKey: queryKeys.publicExamSchedules.detail(id ?? ""),
    queryFn: () => examScheduleApi.getById(id ?? ""),
    enabled: !!id,
  });

  return {
    examSchedule: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching student's exam schedules
 */
export const useStudentExamSchedules = (semesterId?: string) => {
  const query = useQuery({
    queryKey: queryKeys.studentExamSchedules.mySchedules(semesterId),
    queryFn: () => studentExamScheduleApi.getMySchedules(semesterId ?? ""),
  });

  return {
    examSchedules: query.data ?? [],
    totalExamSchedules: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for fetching lecturer's course exam schedules
 */
export const useLecturerExamSchedules = () => {
  const query = useQuery({
    queryKey: queryKeys.lecturerExamSchedules.myCourses(),
    queryFn: () => lecturerExamScheduleApi.getMyCourseSchedules(),
  });

  return {
    examSchedules: query.data ?? [],
    totalExamSchedules: query.data?.length ?? 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
