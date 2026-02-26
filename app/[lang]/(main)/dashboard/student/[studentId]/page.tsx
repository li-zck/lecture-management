"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { lecturerApi, type LecturerStudentProfile } from "@/lib/api/lecturer";
import { getClientDictionary, isLocale } from "@/lib/i18n";
import { GRADE_TYPE_OPTIONS } from "@/lib/utils/grade-labels";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTime(minutes: number | null): string {
  if (minutes === null) return "TBA";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export default function LecturerStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const studentId = params?.studentId as string;
  const dict = getClientDictionary(locale);

  const { role, isAuthenticated, isLoading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<LecturerStudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || role !== "lecturer" || !studentId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await lecturerApi.getStudentProfile(studentId);
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(
          "Student not found or you do not have access to view this student.",
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [studentId, isAuthenticated, role]);

  if (sessionLoading || !role) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || role !== "lecturer") {
    router.replace(`/${locale}/dashboard`);
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-xl font-bold mb-2">
            {dict.dashboard.unauthorized ?? "Unauthorized"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error ?? "Unknown error"}
          </p>
          <Button asChild>
            <Link href={`/${locale}/dashboard`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {dict.common.back} {dict.nav.dashboard}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { student, enrollments } = profile;

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/dashboard`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {dict.lecturerDashboard.viewProfile ?? "Student Profile"}
          </h1>
          <p className="text-muted-foreground">
            {student.fullName ?? student.email} ({student.studentId ?? "—"})
          </p>
        </div>
      </div>

      {/* Student info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {dict.studentDashboard.profileInfo ?? "Profile Information"}
          </CardTitle>
          <CardDescription>
            {dict.studentDashboard.studentId ?? "Student ID"},{" "}
            {dict.studentDashboard.fullName ?? "Full Name"},{" "}
            {dict.studentDashboard.email ?? "Email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-24">
              {dict.studentDashboard.studentId ?? "Student ID"}:
            </span>
            <span>{student.studentId ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-24">
              {dict.studentDashboard.fullName ?? "Full Name"}:
            </span>
            <span>{student.fullName ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground w-24">Email:</span>
            <a
              href={`mailto:${student.email}`}
              className="text-primary hover:underline"
            >
              {student.email}
            </a>
          </div>
          {student.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">Phone:</span>
              <span>{student.phone}</span>
            </div>
          )}
          {student.department && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-24">
                {dict.studentDashboard.department ?? "Department"}:
              </span>
              <span>{student.department.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrollments (courses you teach) */}
      <Card>
        <CardHeader>
          <CardTitle>
            {dict.studentDashboard.myCourses ?? "My Courses"} (
            {enrollments.length})
          </CardTitle>
          <CardDescription>
            Courses you teach where this student is enrolled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No shared courses.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dict.courses.tableCourse}</TableHead>
                    <TableHead>{dict.courses.tableSemester}</TableHead>
                    <TableHead>{dict.common.credits ?? "Credits"}</TableHead>
                    {GRADE_TYPE_OPTIONS.map((opt) => (
                      <TableHead key={opt.key} className="text-right">
                        {opt.label}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">
                      {dict.studentDashboard.grade ?? "Final"}
                    </TableHead>
                    <TableHead>{dict.common.schedule}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((e, i) => (
                    <TableRow key={`${e.courseName}-${e.semester}-${i}`}>
                      <TableCell className="font-medium">
                        {e.courseName}
                      </TableCell>
                      <TableCell>{e.semester}</TableCell>
                      <TableCell>{e.credits}</TableCell>
                      {GRADE_TYPE_OPTIONS.map((opt) => (
                        <TableCell key={opt.key} className="text-right">
                          {e.grades?.[opt.key] ?? "—"}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-medium">
                        {e.grades?.finalGrade ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {e.schedule.dayOfWeek != null
                          ? `${DAYS_OF_WEEK[e.schedule.dayOfWeek]} ${formatTime(e.schedule.startTime)}–${formatTime(e.schedule.endTime)}`
                          : "TBA"}
                        {e.schedule.location && ` • ${e.schedule.location}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
