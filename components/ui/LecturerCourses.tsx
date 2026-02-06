"use client";

import { lecturerApi, type AssignedCourse } from "@/lib/api/lecturer";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "./shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./shadcn/card";

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

function getSemesterStatus(
  startDate: string,
  endDate: string,
): { label: string; variant: "default" | "secondary" | "outline" } {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return { label: "Upcoming", variant: "secondary" };
  if (now > end) return { label: "Completed", variant: "outline" };
  return { label: "Active", variant: "default" };
}

export function LecturerCourses() {
  const [courses, setCourses] = useState<AssignedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await lecturerApi.getCourses();
        setCourses(data);
      } catch (err) {
        console.error("[LecturerCourses] Failed to fetch courses:", err);
        setError("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Group courses by semester
  const coursesBySemester = courses.reduce(
    (acc, course) => {
      const semesterName = course.semester.name;
      if (!acc[semesterName]) {
        acc[semesterName] = {
          semester: course.semester,
          courses: [],
        };
      }
      acc[semesterName].courses.push(course);
      return acc;
    },
    {} as Record<
      string,
      { semester: AssignedCourse["semester"]; courses: AssignedCourse[] }
    >,
  );

  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledCount, 0);

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">My Courses</h1>
          <p className="text-muted-foreground text-lg">
            Courses you are currently teaching
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <GraduationCap className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No Assigned Courses</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You are not currently assigned to teach any courses. Contact the
                administration if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    {totalStudents}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {Object.keys(coursesBySemester).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Semesters</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {courses.reduce((sum, c) => sum + c.course.credits, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                </CardContent>
              </Card>
            </div>

            {/* Courses by Semester */}
            {Object.entries(coursesBySemester).map(
              ([semesterName, { semester, courses: semesterCourses }]) => {
                const status = getSemesterStatus(
                  semester.startDate,
                  semester.endDate,
                );

                return (
                  <div key={semesterName} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {semesterName}
                      </h2>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>

                    <div className="grid gap-4">
                      {semesterCourses.map((course) => (
                        <Link
                          key={course.courseOnSemesterId}
                          href={`/my-courses/${course.courseOnSemesterId}`}
                          className="block"
                        >
                          <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                            <CardHeader className="pb-4">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="space-y-1">
                                  <CardTitle className="text-xl">
                                    {course.course.name}
                                  </CardTitle>
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="outline">
                                      {course.course.credits} Credits
                                    </Badge>
                                    {course.course.department && (
                                      <>
                                        <span>•</span>
                                        <span>{course.course.department}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {course.enrolledCount}
                                    {course.capacity && ` / ${course.capacity}`}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    students
                                  </span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <Clock className="w-5 h-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Schedule
                                    </p>
                                    <p className="font-medium">
                                      {course.schedule.dayOfWeek !== null
                                        ? DAYS_OF_WEEK[
                                            course.schedule.dayOfWeek
                                          ]
                                        : "TBA"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <Calendar className="w-5 h-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Time
                                    </p>
                                    <p className="font-medium">
                                      {course.schedule.startTime !== null
                                        ? `${formatTime(course.schedule.startTime)} - ${formatTime(course.schedule.endTime)}`
                                        : "TBA"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <MapPin className="w-5 h-5 text-muted-foreground" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Location
                                    </p>
                                    <p className="font-medium">
                                      {course.schedule.location || "TBA"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}
