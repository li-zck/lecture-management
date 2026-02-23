"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { type LecturerProfile, lecturerApi } from "@/lib/api/lecturer";
import { type StudentProfile, studentApi } from "@/lib/api/student";
import { useCallback, useEffect, useState } from "react";

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  role: "student" | "lecturer";
  // Student-specific fields
  studentId?: string | null;
  department?: { id: string; name: string } | null;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  gender?: boolean | null;
  birthDate?: string | null;
  citizenId?: string | null;
  // Lecturer-specific fields
  lecturerId?: string;
  departmentHead?: { id: string; name: string } | null;
};

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const {
    isAuthenticated,
    user,
    role,
    isLoading: sessionLoading,
  } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !role || !user?.id) {
      setProfile(null);
      return;
    }

    const normalizedRole = role.toLowerCase();

    // Admin doesn't have a profile endpoint
    if (normalizedRole === "admin") {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (normalizedRole === "student") {
        // Use the user ID from the decoded access token
        const studentProfile: StudentProfile = await studentApi.getById(
          user.id,
        );
        setProfile({
          id: studentProfile.id,
          username: studentProfile.username,
          email: studentProfile.email,
          fullName: studentProfile.fullName,
          role: "student",
          studentId: studentProfile.studentId,
          department: studentProfile.department,
          phone: studentProfile.phone,
          address: studentProfile.address,
          avatar: studentProfile.avatar,
          gender: studentProfile.gender,
          birthDate: studentProfile.birthDate,
          citizenId: studentProfile.citizenId,
        });
      } else if (normalizedRole === "lecturer") {
        // Use the user ID from the decoded access token
        const lecturerProfile: LecturerProfile = await lecturerApi.getById(
          user.id,
        );
        setProfile({
          id: lecturerProfile.id,
          username: lecturerProfile.username,
          email: lecturerProfile.email,
          fullName: lecturerProfile.fullName,
          role: "lecturer",
          lecturerId: lecturerProfile.lecturerId,
          departmentHead: lecturerProfile.departmentHead,
        });
      }
    } catch (err) {
      console.error("[useUserProfile] Failed to fetch profile:", err);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, role]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchProfile();
    }
  }, [sessionLoading, fetchProfile]);

  return {
    profile,
    isLoading: isLoading || sessionLoading,
    error,
    refetch: fetchProfile,
  };
}
