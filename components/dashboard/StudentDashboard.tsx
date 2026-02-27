"use client";

import { useSession } from "@/components/provider/SessionProvider";
import {
  AITimetableGenerator,
  ScheduleCalendar,
  ScheduleChangesList,
  TimetableDownload,
  TimetableGrid,
} from "@/components/timetable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
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
import { studentExamScheduleApi } from "@/lib/api/exam-schedule";
import {
  studentApi,
  type AvailableCourse,
  type CourseDocument,
  type EnrolledCourse,
  type GradeSummary,
  type StudentProfile,
  type StudentProgress,
  type WeeklySchedule,
} from "@/lib/api/student";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { GRADE_TYPE_OPTIONS } from "@/lib/utils/grade-labels";
import { enrollmentsToWeeklySchedule } from "@/lib/utils/schedule";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/** Backend stores time as minutes since midnight (e.g. 8:00 = 480) */
function formatTime(minutes: number | null): string {
  if (minutes === null) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function StudentDashboard() {
  const { user } = useSession();
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const sd = dict.studentDashboard;
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
    "courses" | "grades" | "progress" | "schedule" | "enroll"
  >("courses");

  // State for viewing documents
  const [viewingDocuments, setViewingDocuments] = useState<string | null>(null);
  const [documents, setDocuments] = useState<CourseDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [pendingEnrollCourse, setPendingEnrollCourse] = useState<string | null>(
    null,
  );

  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [scheduleView, setScheduleView] = useState<"weekly" | "calendar">(
    "weekly",
  );
  const [examSchedules, setExamSchedules] = useState<
    Awaited<ReturnType<typeof studentExamScheduleApi.getMySchedules>>
  >([]);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [profileData, enrollmentsData, progressData] = await Promise.all([
        studentApi.getById(user.id),
        studentApi.getEnrollments(),
        studentApi.getProgress(),
      ]);
      setProfile(profileData);
      setCourses(enrollmentsData);
      setGrades(studentApi.getGradesFromEnrollments(enrollmentsData));
      setSchedule(enrollmentsToWeeklySchedule(enrollmentsData));
      setProgress(progressData);
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

  // Fetch exam schedules when schedule tab is active
  useEffect(() => {
    if (activeTab === "schedule") {
      studentExamScheduleApi
        .getMySchedules()
        .then(setExamSchedules)
        .catch(() => setExamSchedules([]));
    }
  }, [activeTab]);

  const confirmEnroll = (courseOnSemesterId: string) => {
    setPendingEnrollCourse(courseOnSemesterId);
  };

  const handleEnroll = async (courseOnSemesterId: string) => {
    try {
      await studentApi.enrollCourse(courseOnSemesterId);
      toast.success(dict.courses.enrollSuccess, { position: "top-center" });
      fetchAvailableCourses();
      const [enrollmentsData, progressData] = await Promise.all([
        studentApi.getEnrollments(),
        studentApi.getProgress(),
      ]);
      setCourses(enrollmentsData);
      setGrades(studentApi.getGradesFromEnrollments(enrollmentsData));
      setSchedule(enrollmentsToWeeklySchedule(enrollmentsData));
      setProgress(progressData);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : dict.courses.enrollFailed;
      toast.error(msg || dict.courses.enrollFailed, {
        position: "top-center",
      });
    }
  };

  const confirmWithdraw = (courseOnSemesterId: string) => {
    // Navigate to withdrawal request form page
    window.location.href = localePath(
      `my-courses/withdrawal/${courseOnSemesterId}`,
    );
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
            <CardTitle className="text-destructive">
              {dict.common.error}
            </CardTitle>
          </CardHeader>
          <CardContent>{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <AlertDialog
        open={pendingEnrollCourse !== null}
        onOpenChange={(open) => {
          if (!open) setPendingEnrollCourse(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{sd.confirmEnrollTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {sd.confirmEnrollBody}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingEnrollCourse(null)}>
              {dict.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!pendingEnrollCourse) return;
                const id = pendingEnrollCourse;
                setPendingEnrollCourse(null);
                await handleEnroll(id);
              }}
            >
              {dict.courses.enrollInCourse}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{sd.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {sd.welcomeBack.replace(
            "{name}",
            profile?.fullName || profile?.username || "",
          )}
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{sd.profileInfo}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{sd.studentId}</p>
              <p className="font-medium">{profile?.studentId || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{sd.fullName}</p>
              <p className="font-medium">{profile?.fullName || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{sd.email}</p>
              <p className="font-medium">{profile?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{sd.department}</p>
              <p className="font-medium">{profile?.department?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{sd.phone}</p>
              <p className="font-medium">{profile?.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{sd.address}</p>
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
          {sd.myCourses} ({courses.length})
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
          {sd.enrollment}
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
          {sd.grades}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("progress")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
            activeTab === "progress"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          {sd.progress}
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
          {sd.schedule}
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="grid gap-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {sd.noEnrolledCourses}
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
                      <p className="text-sm text-muted-foreground">
                        {sd.lecturer}
                      </p>
                      <p className="font-medium">
                        {enrollment.lecturer?.fullName || "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {sd.schedule}
                      </p>
                      <p className="font-medium">
                        {enrollment.schedule.dayOfWeek !== null
                          ? dict.daysOfWeek[enrollment.schedule.dayOfWeek]
                          : "-"}{" "}
                        {formatTime(enrollment.schedule.startTime)} -{" "}
                        {formatTime(enrollment.schedule.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {sd.location}
                      </p>
                      <p className="font-medium">
                        {enrollment.schedule.location || "-"}
                      </p>
                    </div>
                    {enrollment.schedule.mode && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {dict.admin?.courseSemesters?.mode ?? "Mode"}
                        </p>
                        <Badge
                          variant={
                            enrollment.schedule.mode === "ONLINE"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {enrollment.schedule.mode === "ONLINE"
                            ? (dict.common.online ?? "Online")
                            : enrollment.schedule.mode === "HYBRID"
                              ? (dict.common.hybrid ?? "Hybrid")
                              : (dict.common.onCampus ?? "On campus")}
                        </Badge>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {sd.grade}
                      </p>
                      <p className="font-medium">
                        {enrollment.grades.finalGrade ?? sd.notGraded}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(enrollment.schedule.mode === "ONLINE" ||
                      enrollment.schedule.mode === "HYBRID") &&
                      enrollment.schedule.meetingUrl && (
                        <Button variant="default" size="sm" asChild>
                          <a
                            href={enrollment.schedule.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {dict.admin?.courseSemesters?.joinMeeting ??
                              dict.common.joinMeeting ??
                              "Join meeting"}
                          </a>
                        </Button>
                      )}
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
                      {sd.viewDocuments}
                    </Button>

                    {enrollment.grades.finalGrade === null &&
                      enrollment.grades.gradeType1 === null && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            confirmWithdraw(enrollment.courseOnSemesterId)
                          }
                        >
                          {sd.withdraw}
                        </Button>
                      )}
                  </div>

                  {/* Documents List Overlay/Expand */}
                  {viewingDocuments === enrollment.enrollmentId && (
                    <div className="mt-4 p-4 bg-muted rounded-md animate-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">{sd.documents}</h4>
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
                          {sd.noDocuments}
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
                                {dict.home.cta.title.split("?")[0] ??
                                  "Download"}
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
                            ? dict.daysOfWeek[course.schedule.dayOfWeek]
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
                        onClick={() => confirmEnroll(course.courseOnSemesterId)}
                        disabled={!course.hasCapacity}
                      >
                        {course.hasCapacity
                          ? dict.courses.enrollInCourse
                          : dict.courses.full}
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

      {/* Progress Tab */}
      {activeTab === "progress" && (
        <Card>
          <CardHeader>
            <CardTitle>{sd.progress}</CardTitle>
            <CardDescription>{sd.progressDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            {!progress || progress.bySemester.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {sd.noEnrolledCourses}
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 rounded-lg border p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Credits
                    </p>
                    <p className="text-xl font-semibold">
                      {progress.overall.totalCreditsCompleted} /{" "}
                      {progress.overall.totalCreditsAttempted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Cumulative GPA
                    </p>
                    <p className="text-xl font-semibold">
                      {progress.overall.cumulativeGpa != null
                        ? progress.overall.cumulativeGpa.toFixed(2)
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        progress.overall.status === "at_risk"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {progress.overall.status === "at_risk"
                        ? "At Risk"
                        : "On Track"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  {progress.bySemester.map((s) => (
                    <div
                      key={s.semesterId}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{s.semesterName}</h3>
                        <span className="text-sm text-muted-foreground">
                          GPA: {s.gpa != null ? s.gpa.toFixed(2) : "-"} ·{" "}
                          {s.creditsCompleted}/{s.creditsAttempted} credits
                        </span>
                      </div>
                      <ul className="text-sm space-y-1">
                        {s.enrollments.map((e) => (
                          <li key={e.courseName}>
                            {e.courseName} ({e.credits} cr) —{" "}
                            {e.finalGrade != null ? e.finalGrade : "—"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={scheduleView === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setScheduleView("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={scheduleView === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setScheduleView("calendar")}
            >
              Calendar
            </Button>
          </div>

          {scheduleView === "weekly" && (
            <Card>
              <CardHeader>
                <CardTitle>{dict.home.studentFeatures[2]?.title}</CardTitle>
                <CardDescription>
                  {dict.home.studentFeatures[2]?.description}
                </CardDescription>
                <CardAction>
                  <TimetableDownload
                    schedule={schedule}
                    title={
                      courses[0]?.semester?.name
                        ? `${dict.home.studentFeatures[2]?.title} - ${courses[0].semester.name}`
                        : (dict.home.studentFeatures[2]?.title ?? "Timetable")
                    }
                    includeLecturer
                    buttonLabel={sd.exportTimetable}
                    loadingLabel={sd.exportTimetable}
                  />
                </CardAction>
              </CardHeader>
              <CardContent>
                {Object.keys(schedule).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    {sd.noEnrolledCourses}
                  </p>
                ) : (
                  <TimetableGrid
                    schedule={schedule}
                    dayNames={dict.daysOfWeek}
                    modeLabels={{
                      online: dict.common.online ?? "Online",
                      onCampus: dict.common.onCampus ?? "On campus",
                      hybrid: dict.common.hybrid ?? "Hybrid",
                    }}
                    joinMeetingLabel={
                      dict.admin?.courseSemesters?.joinMeeting ??
                      dict.common.joinMeeting ??
                      "Join meeting"
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}

          {scheduleView === "calendar" &&
            courses[0]?.semester?.startDate &&
            courses[0]?.semester?.endDate && (
              <ScheduleCalendar
                schedule={schedule}
                exams={examSchedules}
                semesterStart={courses[0].semester.startDate}
                semesterEnd={courses[0].semester.endDate}
                dayNames={dict.daysOfWeek}
                modeLabels={{
                  online: dict.common.online ?? "Online",
                  onCampus: dict.common.onCampus ?? "On campus",
                  hybrid: dict.common.hybrid ?? "Hybrid",
                }}
                joinMeetingLabel={
                  dict.admin?.courseSemesters?.joinMeeting ??
                  dict.common.joinMeeting ??
                  "Join meeting"
                }
                emptyMessage={sd.noEnrolledCourses}
              />
            )}

          {scheduleView === "calendar" &&
            (!courses[0]?.semester?.startDate ||
              !courses[0]?.semester?.endDate) &&
            courses.length > 0 && (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  Semester dates not available for calendar view.
                </CardContent>
              </Card>
            )}

          <ScheduleChangesList
            courseOnSemesterIds={courses.map((c) => c.courseOnSemesterId)}
            courseNames={Object.fromEntries(
              courses.map((c) => [c.courseOnSemesterId, c.course.name]),
            )}
            emptyMessage="No recent schedule changes."
          />

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
