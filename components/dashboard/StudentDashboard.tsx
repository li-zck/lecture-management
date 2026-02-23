"use client";

import { useSession } from "@/components/provider/SessionProvider";
import {
  AITimetableGenerator,
  TimetableDownload,
  TimetableGrid,
} from "@/components/timetable";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  studentApi,
  type AvailableCourse,
  type CourseDocument,
  type EnrolledCourse,
  type GradeSummary,
  type StudentProfile,
  type WeeklySchedule,
} from "@/lib/api/student";
import { GRADE_TYPE_OPTIONS } from "@/lib/utils/grade-labels";
import { enrollmentsToWeeklySchedule } from "@/lib/utils/schedule";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** Backend stores time as minutes since midnight (e.g. 8:00 = 480) */
function formatTime(minutes: number | null): string {
  if (minutes === null) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function StudentDashboard() {
  const { user } = useSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [grades, setGrades] = useState<GradeSummary[]>([]);
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "courses" | "grades" | "schedule" | "enroll"
  >("courses");

  // State for viewing documents
  const [viewingDocuments, setViewingDocuments] = useState<string | null>(null);
  const [documents, setDocuments] = useState<CourseDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [profileData, enrollmentsData, gradesData] = await Promise.all([
        studentApi.getById(user.id),
        studentApi.getEnrollments(),
        studentApi.getGrades(),
      ]);
      setProfile(profileData);
      setCourses(enrollmentsData);
      setGrades(gradesData);
      setSchedule(enrollmentsToWeeklySchedule(enrollmentsData));
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  const fetchAvailableCourses = useCallback(async () => {
    try {
      const data = await studentApi.getAvailableCourses();
      setAvailableCourses(data);
    } catch (err) {
      console.error("Failed to fetch available courses", err);
    }
  }, []);

  // Fetch available courses when tab changes to enroll
  useEffect(() => {
    if (activeTab === "enroll") {
      fetchAvailableCourses();
    }
  }, [activeTab, fetchAvailableCourses]);

  const handleEnroll = async (courseOnSemesterId: string) => {
    try {
      if (!confirm("Are you sure you want to enroll in this course?")) return;
      await studentApi.enrollCourse(courseOnSemesterId);
      alert("Successfully enrolled!");
      // Refresh data
      fetchAvailableCourses();
      const [enrollmentsData, scheduleData] = await Promise.all([
        studentApi.getEnrollments(),
        studentApi.getSchedule(),
      ]);
      setCourses(enrollmentsData);
      setSchedule(scheduleData);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to enroll");
    }
  };

  const handleWithdraw = async (enrollmentId: string) => {
    try {
      if (
        !confirm(
          "Are you sure you want to withdraw from this course? Query cannot be undone.",
        )
      )
        return;

      await studentApi.withdrawCourse(enrollmentId);
      alert("Successfully withdrawn!");
      // Refresh data
      const [enrollmentsData, scheduleData] = await Promise.all([
        studentApi.getEnrollments(),
        studentApi.getSchedule(),
      ]);
      setCourses(enrollmentsData);
      setSchedule(scheduleData);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to withdraw", {
        position: "top-center",
      });
    }
  };

  const handleViewDocuments = async (
    courseOnSemesterId: string,
    enrollmentId: string,
  ) => {
    setViewingDocuments(enrollmentId);
    setLoadingDocs(true);
    try {
      const docs = await studentApi.getCourseDocuments(courseOnSemesterId);
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to fetch documents", err);
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Student Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Welcome back, {profile?.fullName || profile?.username}
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="font-medium">{profile?.studentId || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{profile?.fullName || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{profile?.department?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{profile?.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{profile?.address || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
            activeTab === "courses"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          My Courses ({courses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("enroll")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
            activeTab === "enroll"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Enrollment
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("grades")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
            activeTab === "grades"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Grades
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("schedule")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
            activeTab === "schedule"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Schedule
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="grid gap-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No enrolled courses found.
              </CardContent>
            </Card>
          ) : (
            courses.map((enrollment) => (
              <Card key={enrollment.enrollmentId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{enrollment.course.name}</CardTitle>
                      <CardDescription>
                        {enrollment.semester.name} • {enrollment.course.credits}{" "}
                        credits
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {enrollment.course.department}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Lecturer</p>
                      <p className="font-medium">
                        {enrollment.lecturer?.fullName || "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule</p>
                      <p className="font-medium">
                        {enrollment.schedule.dayOfWeek !== null
                          ? DAY_NAMES[enrollment.schedule.dayOfWeek]
                          : "-"}{" "}
                        {formatTime(enrollment.schedule.startTime)} -{" "}
                        {formatTime(enrollment.schedule.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {enrollment.schedule.location || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="font-medium">
                        {enrollment.grades.finalGrade ?? "Not graded"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewDocuments(
                          enrollment.courseOnSemesterId,
                          enrollment.enrollmentId,
                        )
                      }
                    >
                      View Documents
                    </Button>

                    {enrollment.grades.finalGrade === null &&
                      enrollment.grades.gradeType1 === null && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleWithdraw(enrollment.enrollmentId)
                          }
                        >
                          Withdraw
                        </Button>
                      )}
                  </div>

                  {/* Documents List Overlay/Expand */}
                  {viewingDocuments === enrollment.enrollmentId && (
                    <div className="mt-4 p-4 bg-muted rounded-md animate-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Course Documents</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setViewingDocuments(null)}
                        >
                          ✕
                        </Button>
                      </div>

                      {loadingDocs ? (
                        <div className="flex justify-center p-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        </div>
                      ) : documents.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No documents available for this course.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {documents.map((doc) => (
                            <li
                              key={doc.id}
                              className="flex justify-between items-center p-2 bg-background rounded border"
                            >
                              <span className="text-sm truncate max-w-[200px]">
                                {doc.title}
                              </span>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                Download
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Enrollment Tab */}
      {activeTab === "enroll" && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
              <CardDescription>
                Courses open for enrollment in the current semester
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableCourses.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No courses available for enrollment at this moment.
                </p>
              ) : (
                <div className="grid gap-4">
                  {availableCourses.map((course) => (
                    <div
                      key={course.courseOnSemesterId}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">
                            {course.course.name}
                          </h3>
                          <Badge variant="outline">
                            {course.course.credits} Credits
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {course.lecturer?.fullName || "TBA"} •{" "}
                          {course.semester}
                        </p>
                        <p className="text-sm">
                          {course.schedule.dayOfWeek !== null
                            ? DAY_NAMES[course.schedule.dayOfWeek]
                            : "TBA"}{" "}
                          • {formatTime(course.schedule.startTime)} -{" "}
                          {formatTime(course.schedule.endTime)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>
                            Capacity: {course.enrolledCount} /{" "}
                            {course.capacity || "∞"}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEnroll(course.courseOnSemesterId)}
                        disabled={!course.hasCapacity}
                      >
                        {course.hasCapacity ? "Enroll Now" : "Class Full"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grades Tab */}
      {activeTab === "grades" && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No grades available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Course</th>
                      <th className="text-left py-3 px-2">Semester</th>
                      <th className="text-center py-3 px-2">Credits</th>
                      {GRADE_TYPE_OPTIONS.map((opt) => (
                        <th key={opt.key} className="text-center py-3 px-2">
                          {opt.label}
                        </th>
                      ))}
                      <th className="text-center py-3 px-2 font-bold">Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr
                        key={grade.courseName + grade.semester}
                        className="border-b"
                      >
                        <td className="py-3 px-2">{grade.courseName}</td>
                        <td className="py-3 px-2">{grade.semester}</td>
                        <td className="text-center py-3 px-2">
                          {grade.credits}
                        </td>
                        {GRADE_TYPE_OPTIONS.map((opt) => (
                          <td key={opt.key} className="text-center py-3 px-2">
                            {grade[opt.key] ?? "-"}
                          </td>
                        ))}
                        <td className="text-center py-3 px-2 font-bold">
                          {grade.finalGrade ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Current semester timetable</CardDescription>
              <CardAction>
                <TimetableDownload
                  schedule={schedule}
                  title={
                    courses[0]?.semester?.name
                      ? `Timetable - ${courses[0].semester.name}`
                      : "Timetable"
                  }
                  includeLecturer
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              {Object.keys(schedule).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No schedule for current semester.
                </p>
              ) : (
                <TimetableGrid schedule={schedule} />
              )}
            </CardContent>
          </Card>
          <AITimetableGenerator
            schedule={schedule}
            userRole="student"
            context={
              courses[0]?.semester?.name
                ? `Semester: ${courses[0].semester.name}`
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
