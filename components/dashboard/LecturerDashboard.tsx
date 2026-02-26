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
import { Input } from "@/components/ui/shadcn/input";
import { getErrorInfo } from "@/lib/api/error";
import {
  type AssignedCourse,
  type CourseStudent,
  type LecturerProfile,
  type LecturerSchedule,
  lecturerApi,
} from "@/lib/api/lecturer";
import { getClientDictionary, useLocale } from "@/lib/i18n";
import { GRADE_TYPE_OPTIONS } from "@/lib/utils/grade-labels";
import { coursesToLecturerSchedule } from "@/lib/utils/schedule";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/** Backend stores time as minutes since midnight (e.g. 8:00 = 480) */
function formatTime(minutes: number | null): string {
  if (minutes === null) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function LecturerDashboard() {
  const { user } = useSession();
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const d = dict.lecturerDashboard;
  const [profile, setProfile] = useState<LecturerProfile | null>(null);
  const [courses, setCourses] = useState<AssignedCourse[]>([]);
  const [schedule, setSchedule] = useState<LecturerSchedule>({});
  const [selectedCourse, setSelectedCourse] = useState<AssignedCourse | null>(
    null,
  );
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "schedule">("courses");
  const [editingGrades, setEditingGrades] = useState<
    Record<string, CourseStudent["grades"]>
  >({});

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [profileData, coursesData] = await Promise.all([
        lecturerApi.getById(user.id),
        lecturerApi.getCourses(),
      ]);
      setProfile(profileData);
      setCourses(coursesData);
      setSchedule(coursesToLecturerSchedule(coursesData));
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

  const loadCourseStudents = async (course: AssignedCourse) => {
    try {
      setStudentsLoading(true);
      setSelectedCourse(course);
      const studentsData = await lecturerApi.getCourseStudents(
        course.courseOnSemesterId,
      );
      setStudents(studentsData);
      // Initialize editing grades
      const initialGrades: Record<string, CourseStudent["grades"]> = {};
      for (const student of studentsData) {
        initialGrades[student.student.id] = { ...student.grades };
      }
      setEditingGrades(initialGrades);
    } catch (err) {
      console.error(err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleGradeChange = (
    studentId: string,
    field: keyof CourseStudent["grades"],
    value: string,
  ) => {
    const numValue = value === "" ? null : Number(value);
    setEditingGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: numValue,
      },
    }));
  };

  const saveGrade = async (studentId: string) => {
    const student = students.find((s) => s.student.id === studentId);
    if (!student?.enrollmentId) return;
    try {
      const updated = await lecturerApi.updateGrade(student.enrollmentId, {
        gradeType1: editingGrades[studentId]?.gradeType1 ?? undefined,
        gradeType2: editingGrades[studentId]?.gradeType2 ?? undefined,
        gradeType3: editingGrades[studentId]?.gradeType3 ?? undefined,
      });
      // Update local state with backend response (includes calculated finalGrade)
      setStudents((prev) =>
        prev.map((s) =>
          s.student.id === studentId ? { ...s, grades: updated.grades } : s,
        ),
      );
      toast.success(d.gradesSaved);
    } catch (err) {
      console.error(err);
      toast.error(getErrorInfo(err).message);
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{d.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {d.welcomeBack.replace(
            "{name}",
            profile?.fullName || profile?.username || "",
          )}
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{d.profileInfo}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{d.lecturerId}</p>
              <p className="font-medium">{profile?.lecturerId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {dict.studentDashboard.fullName}
              </p>
              <p className="font-medium">{profile?.fullName || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {dict.studentDashboard.email}
              </p>
              <p className="font-medium">{profile?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {d.departmentHead}
              </p>
              <p className="font-medium">
                {profile?.departmentHead?.name || d.notDeptHead}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("courses");
            setSelectedCourse(null);
          }}
          className={`rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
            activeTab === "courses"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          {d.myCourses} ({courses.length})
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
          {d.schedule}
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && !selectedCourse && (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.length === 0 ? (
            <Card className="col-span-2">
              <CardContent className="p-6 text-center text-muted-foreground">
                {d.noAssignedCourses}
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card
                key={course.courseOnSemesterId}
                className="cursor-pointer hover:shadow-md transition"
                onClick={() => loadCourseStudents(course)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {course.course.name}
                      </CardTitle>
                      <CardDescription>
                        {course.semester.name} • {course.course.credits}{" "}
                        {dict.common.credits}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {course.course.department}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {dict.common.schedule}
                      </p>
                      <p className="font-medium">
                        {course.schedule.dayOfWeek !== null
                          ? dict.daysOfWeek[course.schedule.dayOfWeek]
                          : "-"}{" "}
                        {formatTime(course.schedule.startTime)} -{" "}
                        {formatTime(course.schedule.endTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {d.enrolled}
                      </p>
                      <p className="font-medium">
                        {course.enrolledCount}
                        {course.capacity && ` / ${course.capacity}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Course Students View */}
      {activeTab === "courses" && selectedCourse && (
        <div>
          <Button
            variant="outline"
            onClick={() => setSelectedCourse(null)}
            className="mb-4"
          >
            ← {dict.common.back}
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{selectedCourse.course.name}</CardTitle>
              <CardDescription>
                {selectedCourse.semester.name} • {students.length}{" "}
                {dict.common.students}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : students.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No students enrolled.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">
                          {dict.studentDashboard.studentId}
                        </th>
                        <th className="text-left py-3 px-2">
                          {dict.studentDashboard.fullName}
                        </th>
                        {GRADE_TYPE_OPTIONS.map((opt) => (
                          <th
                            key={opt.key}
                            className="text-center py-3 px-2 w-[100px]"
                          >
                            {opt.label}
                          </th>
                        ))}
                        <th className="text-center py-3 px-2 w-[100px]">
                          {dict.studentDashboard.grade}
                        </th>
                        <th className="text-center py-3 px-2">
                          {dict.common.submit}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={`${student.enrollmentId}-${student.student.id}`}
                          className="border-b"
                        >
                          <td className="py-3 px-2">
                            {student.student.studentId || "-"}
                          </td>
                          <td className="py-3 px-2">
                            {student.student.fullName || student.student.email}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                className="w-16 text-center"
                                value={
                                  editingGrades[student.student.id]
                                    ?.gradeType1 ?? ""
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.student.id,
                                    "gradeType1",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                className="w-16 text-center"
                                value={
                                  editingGrades[student.student.id]
                                    ?.gradeType2 ?? ""
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.student.id,
                                    "gradeType2",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                className="w-16 text-center"
                                value={
                                  editingGrades[student.student.id]
                                    ?.gradeType3 ?? ""
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.student.id,
                                    "gradeType3",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                className="w-16 text-center"
                                value={
                                  editingGrades[student.student.id]
                                    ?.finalGrade ?? ""
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    student.student.id,
                                    "finalGrade",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <Button
                              size="sm"
                              onClick={() => saveGrade(student.student.id)}
                            >
                              {d.saveGrades}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
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
                  includeLecturer={false}
                  buttonLabel={d.exportTimetable}
                  loadingLabel={d.exportTimetable}
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              {Object.keys(schedule).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {dict.myCoursesList.noAssignedCourses}
                </p>
              ) : (
                <TimetableGrid schedule={schedule} dayNames={dict.daysOfWeek} />
              )}
            </CardContent>
          </Card>
          <AITimetableGenerator
            schedule={schedule}
            userRole="lecturer"
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
