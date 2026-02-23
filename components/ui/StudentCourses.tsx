"use client";

import { type EnrolledCourse, studentApi } from "@/lib/api/student";
import {
  getGradeTypeLabelWithWeight,
  GRADE_TYPE_OPTIONS,
} from "@/lib/utils/grade-labels";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  MapPin,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Badge } from "./shadcn/badge";
import { Button } from "./shadcn/button";
import { Card, CardContent } from "./shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./shadcn/dialog";
import { Progress } from "./shadcn/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./shadcn/table";

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

function calculateProgress(grades: EnrolledCourse["grades"]): number {
  let completedAssessments = 0;
  if (grades.gradeType1 !== null) completedAssessments++;
  if (grades.gradeType2 !== null) completedAssessments++;
  if (grades.gradeType3 !== null) completedAssessments++;

  return (completedAssessments / 3) * 100;
}

function getGradeStatus(finalGrade: number | null): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (finalGrade === null)
    return { label: "In Progress", variant: "secondary" };
  if (finalGrade >= 8) return { label: "Excellent", variant: "default" };
  if (finalGrade >= 6.5) return { label: "Good", variant: "outline" };
  if (finalGrade >= 5) return { label: "Pass", variant: "outline" };
  return { label: "Fail", variant: "destructive" };
}

/**
 * Convert numeric grade (0-10 scale) to letter grade
 * Grade scale:
 * A: >= 8.5
 * B+: >= 7.8
 * B: >= 7.0
 * C+: >= 6.3
 * C: >= 5.5
 * D+: >= 4.8
 * D: >= 4.0
 * F: < 4.0
 */
function getLetterGrade(grade: number | null): string {
  if (grade === null) return "-";
  if (grade >= 8.5) return "A";
  if (grade >= 7.8) return "B+";
  if (grade >= 7.0) return "B";
  if (grade >= 6.3) return "C+";
  if (grade >= 5.5) return "C";
  if (grade >= 4.8) return "D+";
  if (grade >= 4.0) return "D";
  return "F";
}

function getLetterGradeColor(grade: number | null): string {
  if (grade === null) return "text-muted-foreground";
  if (grade >= 8.5) return "text-emerald-600 font-semibold";
  if (grade >= 7.0) return "text-blue-600 font-semibold";
  if (grade >= 5.5) return "text-amber-600 font-semibold";
  if (grade >= 4.0) return "text-orange-600 font-semibold";
  return "text-destructive font-semibold";
}

/**
 * Convert 10-point scale grade to 4-point GPA scale.
 * Aligns with letter grade thresholds used in getLetterGrade.
 */
function grade10To4(grade: number | null): number | null {
  if (grade === null) return null;
  if (grade >= 8.5) return 4.0;
  if (grade >= 7.8) return 3.5;
  if (grade >= 7.0) return 3.0;
  if (grade >= 6.3) return 2.5;
  if (grade >= 5.5) return 2.0;
  if (grade >= 4.8) return 1.5;
  if (grade >= 4.0) return 1.0;
  return 0;
}

/**
 * Compute overall GPA (4.0 scale) from graded courses only.
 * GPA = sum(gradePoint * credits) / sum(credits)
 */
function computeGPA(
  courses: EnrolledCourse[],
): { gpa: number; totalCredits: number } | null {
  let sum = 0;
  let totalCredits = 0;
  for (const c of courses) {
    const point = grade10To4(c.grades.finalGrade);
    if (point === null) continue;
    const credits = c.course?.credits ?? 0;
    sum += point * credits;
    totalCredits += credits;
  }
  if (totalCredits === 0) return null;
  return { gpa: sum / totalCredits, totalCredits };
}

export function StudentCourses() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(
    null,
  );

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const data = await studentApi.getEnrollments();
        setCourses(data);
      } catch (err) {
        console.error("[StudentCourses] Failed to fetch enrollments:", err);
        setError("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnrollments();
  }, []);

  const { coursesBySemester, gpaResult } = useMemo(() => {
    const bySemester = courses.reduce(
      (acc, c) => {
        const key = c.semester?.id ?? c.semester?.name ?? "unknown";
        const name = c.semester?.name ?? "Unknown Semester";
        if (!acc[key]) acc[key] = { name, courses: [] };
        acc[key].courses.push(c);
        return acc;
      },
      {} as Record<string, { name: string; courses: EnrolledCourse[] }>,
    );
    const sorted = Object.entries(bySemester).sort(([, a], [, b]) =>
      b.name.localeCompare(a.name),
    );
    return {
      coursesBySemester: sorted,
      gpaResult: computeGPA(courses),
    };
  }, [courses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">My Courses</h1>
          <p className="text-muted-foreground text-lg">
            View your enrolled courses and track your progress
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <GraduationCap className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No Enrolled Courses</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Browse available
                courses and enroll to start your learning journey.
              </p>
              <Link href="/courses">
                <Button size="lg">Browse Available Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {courses.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {courses.reduce(
                      (sum, c) => sum + (c.course?.credits ?? 0),
                      0,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {gpaResult ? gpaResult.gpa.toFixed(2) : "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">GPA (4.0)</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-600">
                    {
                      courses.filter(
                        (c) =>
                          c.grades.finalGrade !== null &&
                          c.grades.finalGrade >= 4,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Passed</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">
                    {courses.filter((c) => c.grades.finalGrade === null).length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Courses Table (grouped by semester) */}
            <Card className="border-border/50 shadow-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Course Name</TableHead>
                    <TableHead className="text-center w-24">Credits</TableHead>
                    <TableHead className="text-center w-32">
                      Final Grade
                    </TableHead>
                    <TableHead className="text-center w-28">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursesBySemester.map(
                    ([
                      semesterKey,
                      { name: semesterName, courses: semesterCourses },
                    ]) => (
                      <Fragment key={semesterKey}>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell
                            colSpan={4}
                            className="pl-4 py-3 font-semibold text-foreground"
                          >
                            {semesterName}
                          </TableCell>
                        </TableRow>
                        {semesterCourses.map((course) => {
                          const status = getGradeStatus(
                            course.grades.finalGrade,
                          );
                          const letterGrade = getLetterGrade(
                            course.grades.finalGrade,
                          );
                          const gradeColor = getLetterGradeColor(
                            course.grades.finalGrade,
                          );
                          const grade4 = grade10To4(course.grades.finalGrade);

                          return (
                            <TableRow
                              key={course.enrollmentId}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => setSelectedCourse(course)}
                            >
                              <TableCell className="pl-4">
                                <p className="font-medium">
                                  {course.course?.name ?? "Unknown Course"}
                                </p>
                              </TableCell>
                              <TableCell className="text-center">
                                {course.course?.credits ?? 0}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={gradeColor}>
                                  {letterGrade}
                                </span>
                                {grade4 !== null && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({grade4.toFixed(1)})
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant={status.variant}>
                                  {status.label}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </Fragment>
                    ),
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>

      {/* Course Detail Dialog */}
      <Dialog
        open={selectedCourse !== null}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedCourse?.course?.name ?? "Course Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedCourse?.semester?.name}
              {selectedCourse?.course?.department && (
                <> &bull; {selectedCourse.course.department}</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Schedule & Location */}
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="font-medium">
                    {selectedCourse?.schedule.dayOfWeek !== null &&
                    selectedCourse?.schedule.dayOfWeek !== undefined
                      ? `${DAYS_OF_WEEK[selectedCourse.schedule.dayOfWeek]}, ${formatTime(selectedCourse.schedule.startTime)} - ${formatTime(selectedCourse.schedule.endTime)}`
                      : "TBA"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {selectedCourse?.schedule.location || "TBA"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Lecturer</p>
                  <p className="font-medium">
                    {selectedCourse?.lecturer?.fullName || "TBA"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Credits</p>
                  <p className="font-medium">
                    {selectedCourse?.course?.credits ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">
                  {selectedCourse
                    ? calculateProgress(selectedCourse.grades).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  selectedCourse ? calculateProgress(selectedCourse.grades) : 0
                }
                className="h-2"
              />
            </div>

            {/* Grade Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Grade Breakdown</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {GRADE_TYPE_OPTIONS.map((opt) => (
                  <div
                    key={opt.key}
                    className="text-center p-3 bg-muted/30 rounded-lg"
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {getGradeTypeLabelWithWeight(opt.key)}
                    </p>
                    <p className="font-semibold text-lg">
                      {selectedCourse?.grades?.[opt.key]?.toFixed(1) ?? "-"}
                    </p>
                  </div>
                ))}
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">
                    Final Grade
                  </p>
                  <p
                    className={`text-lg ${getLetterGradeColor(selectedCourse?.grades.finalGrade ?? null)}`}
                  >
                    {getLetterGrade(selectedCourse?.grades.finalGrade ?? null)}
                    {selectedCourse?.grades.finalGrade !== null &&
                      selectedCourse?.grades.finalGrade !== undefined && (
                        <span className="text-sm text-muted-foreground ml-1">
                          ({selectedCourse.grades.finalGrade.toFixed(2)})
                        </span>
                      )}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant={
                  getGradeStatus(selectedCourse?.grades.finalGrade ?? null)
                    .variant
                }
              >
                {
                  getGradeStatus(selectedCourse?.grades.finalGrade ?? null)
                    .label
                }
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
