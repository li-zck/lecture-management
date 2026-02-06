"use client";

import type { GradeDistributionSegment } from "@/components/charts";
import { GradeDistributionDonut } from "@/components/charts";
import { useSession } from "@/components/provider/SessionProvider";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import type { PublicExamSchedule } from "@/lib/api/exam-schedule";
import { lecturerExamScheduleApi } from "@/lib/api/exam-schedule";
import {
  lecturerApi,
  type AssignedCourse,
  type CourseStudent,
} from "@/lib/api/lecturer";
import { GRADE_TYPE_OPTIONS } from "@/lib/utils/grade-labels";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  FileQuestion,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

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

function bucketGrade(finalGrade: number | null): string {
  if (finalGrade === null) return "No grade";
  if (finalGrade >= 90) return "A (90+)";
  if (finalGrade >= 80) return "B (80-89)";
  if (finalGrade >= 70) return "C (70-79)";
  if (finalGrade >= 60) return "D (60-69)";
  return "F (<60)";
}

interface LecturerCourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LecturerCourseDetailPage({
  params,
}: LecturerCourseDetailPageProps) {
  const { id: courseOnSemesterId } = use(params);
  const router = useRouter();
  const { role, isAuthenticated, isLoading: sessionLoading } = useSession();
  const [course, setCourse] = useState<AssignedCourse | null>(null);
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [examSchedules, setExamSchedules] = useState<PublicExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || role !== "lecturer") return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [coursesRes, studentsRes, examsRes] = await Promise.all([
          lecturerApi.getCourses(),
          lecturerApi.getCourseStudents(courseOnSemesterId),
          lecturerExamScheduleApi.getMyCourseSchedules(),
        ]);

        const found = coursesRes.find(
          (c) => c.courseOnSemesterId === courseOnSemesterId,
        );
        if (!found) {
          setError("Course not found or you are not assigned to teach it.");
          setCourse(null);
          setStudents([]);
          setExamSchedules([]);
          return;
        }

        setCourse(found);
        setStudents(studentsRes ?? []);
        setExamSchedules(
          (examsRes ?? []).filter(
            (e) => e.courseOnSemesterId === courseOnSemesterId,
          ),
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load course data.");
        setCourse(null);
        setStudents([]);
        setExamSchedules([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseOnSemesterId, isAuthenticated, role]);

  const gradeDistributionData = useMemo((): GradeDistributionSegment[] => {
    const buckets: Record<string, number> = {
      "No grade": 0,
      "A (90+)": 0,
      "B (80-89)": 0,
      "C (70-79)": 0,
      "D (60-69)": 0,
      "F (<60)": 0,
    };
    for (const s of students) {
      const key = bucketGrade(s.grades?.finalGrade ?? null);
      buckets[key] = (buckets[key] ?? 0) + 1;
    }
    return Object.entries(buckets)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [students]);

  if (sessionLoading || !role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || role !== "lecturer") {
    router.replace("/my-courses");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <p className="text-muted-foreground mb-6">
            {error ?? "Unknown error"}
          </p>
          <Button asChild>
            <Link href="/my-courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Back + Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/my-courses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {course.course.name}
            </h1>
            <p className="text-muted-foreground">{course.semester.name}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant="outline">{course.course.credits} Credits</Badge>
              {course.course.department && (
                <Badge variant="secondary">{course.course.department}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">
                  Enrolled students
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {course.capacity != null
                    ? `${course.enrolledCount} / ${course.capacity}`
                    : course.enrolledCount}
                </p>
                <p className="text-xs text-muted-foreground">Capacity</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-bold">
                  {course.schedule.dayOfWeek != null
                    ? DAYS_OF_WEEK[course.schedule.dayOfWeek]
                    : "TBA"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.schedule.startTime != null
                    ? `${formatTime(course.schedule.startTime)} - ${formatTime(course.schedule.endTime)}`
                    : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-bold line-clamp-1">
                  {course.schedule.location || "TBA"}
                </p>
                <p className="text-xs text-muted-foreground">Location</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grade distribution donut */}
        {students.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Grade distribution
              </CardTitle>
              <CardDescription>
                Final grade breakdown (by letter band)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GradeDistributionDonut
                data={gradeDistributionData}
                totalLabel="Students"
                totalValue={students.length}
                height={280}
              />
            </CardContent>
          </Card>
        )}

        {/* Students table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students ({students.length})
            </CardTitle>
            <CardDescription>
              Name, student ID, and grades for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No students enrolled yet.
              </p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      {GRADE_TYPE_OPTIONS.map((opt) => (
                        <TableHead key={opt.key} className="text-right">
                          {opt.label}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={`${s.enrollmentId}-${s.student.id}`}>
                        <TableCell className="font-medium">
                          {s.student.fullName ?? s.student.email ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {s.student.studentId ?? "—"}
                        </TableCell>
                        {GRADE_TYPE_OPTIONS.map((opt) => (
                          <TableCell key={opt.key} className="text-right">
                            {s.grades?.[opt.key] ?? "—"}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-medium">
                          {s.grades?.finalGrade ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam schedule */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5" />
              Exam schedule
            </CardTitle>
            <CardDescription>
              Test/exam dates and times for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {examSchedules.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                No exam schedule set for this course.
              </p>
            ) : (
              <ul className="space-y-4">
                {examSchedules.map((exam) => (
                  <li
                    key={exam.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {exam.examDate
                          ? new Date(exam.examDate).toLocaleDateString(
                              undefined,
                              {
                                dateStyle: "medium",
                              },
                            )
                          : "TBA"}
                      </span>
                    </div>
                    {(exam.startTime || exam.endTime) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {exam.startTime ?? "—"} – {exam.endTime ?? "—"}
                      </div>
                    )}
                    {exam.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {exam.location}
                      </div>
                    )}
                    {exam.description && (
                      <p className="text-sm text-muted-foreground w-full mt-1">
                        {exam.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
