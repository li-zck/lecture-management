"use client";

import type { GradeDistributionSegment } from "@/components/charts";
import { GradeDistributionDonut } from "@/components/charts";
import { useSession } from "@/components/provider/SessionProvider";
import { useDocuments } from "@/components/ui/hooks/use-documents";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import type { CourseDocument } from "@/lib/api/document";
import { documentApi } from "@/lib/api/document";
import type { PublicExamSchedule } from "@/lib/api/exam-schedule";
import { lecturerExamScheduleApi } from "@/lib/api/exam-schedule";
import {
  lecturerApi,
  type AssignedCourse,
  type CourseStudent,
} from "@/lib/api/lecturer";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { useCreateDocument, useDeleteDocument } from "@/lib/query/mutations";
import { GRADE_TYPE_OPTIONS } from "@/lib/utils/grade-labels";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Download,
  FileQuestion,
  FileUp,
  GraduationCap,
  MapPin,
  Trash2,
  Upload,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

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
  const locale = useLocale();
  const localePath = useLocalePath();
  const dict = getClientDictionary(locale);
  const router = useRouter();
  const { role, isAuthenticated, isLoading: sessionLoading } = useSession();
  const [course, setCourse] = useState<AssignedCourse | null>(null);
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [examSchedules, setExamSchedules] = useState<PublicExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    mode: "ON_CAMPUS" as "ONLINE" | "ON_CAMPUS" | "HYBRID",
    location: "",
    meetingUrl: "",
  });

  const formatTime = (minutes: number | null): string => {
    if (minutes === null) return dict.common.tba;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const resolveModeLabel = (
    mode: "ONLINE" | "ON_CAMPUS" | "HYBRID" | null | undefined,
  ): string => {
    if (mode === "ONLINE") return dict.common.online ?? "Online";
    if (mode === "HYBRID") return dict.common.hybrid ?? "Hybrid";
    if (mode === "ON_CAMPUS") return dict.common.onCampus ?? "On campus";
    return dict.common.tba;
  };

  const refetchCourse = async () => {
    const coursesRes = await lecturerApi.getCourses();
    const found = coursesRes.find(
      (c) => c.courseOnSemesterId === courseOnSemesterId,
    );
    if (found) setCourse(found);
  };

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
          setError("not-found");
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
        setError("load-failed");
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
    router.replace(localePath("my-courses"));
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
    const resolvedError =
      error === "not-found"
        ? dict.lecturerCourseDetail.notFoundDescription
        : error === "load-failed"
          ? dict.common.error
          : (error ?? dict.common.error);
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold mb-4">
            {dict.lecturerCourseDetail.notFoundTitle}
          </h1>
          <p className="text-muted-foreground mb-6">{resolvedError}</p>
          <Button asChild>
            <Link href={localePath("my-courses")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {dict.lecturerCourseDetail.backToMyCourses}
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
            <Link href={localePath("my-courses")}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {course.course.name}
            </h1>
            <p className="text-muted-foreground">{course.semester.name}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant="outline">
                {course.course.credits} {dict.myCoursesList.credits}
              </Badge>
              {course.course.department && (
                <Badge variant="secondary">{course.course.department}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50 min-h-[88px] flex">
            <CardContent className="p-4 flex items-center gap-3 flex-1">
              <Users className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">
                  {dict.lecturerCourseDetail.enrolledStudents}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 min-h-[88px] flex">
            <CardContent className="p-4 flex items-center gap-3 flex-1">
              <GraduationCap className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-2xl font-bold">
                  {course.capacity != null
                    ? `${course.enrolledCount} / ${course.capacity}`
                    : course.enrolledCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dict.lecturerCourseDetail.capacity}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 min-h-[88px] flex">
            <CardContent className="p-4 flex items-center gap-3 flex-1">
              <Clock className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold">
                  {course.schedule.dayOfWeek != null
                    ? (dict.daysOfWeek[course.schedule.dayOfWeek] ??
                      dict.common.tba)
                    : dict.common.tba}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.schedule.startTime != null
                    ? `${formatTime(course.schedule.startTime)} - ${formatTime(course.schedule.endTime)}`
                    : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 min-h-[88px] flex">
            <CardContent className="p-4 flex items-center gap-3 flex-1">
              <MapPin className="h-8 w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold line-clamp-1">
                  {course.schedule.location || dict.common.tba}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dict.common.location}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meeting link & session (lecturer can edit) */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              {dict.lecturerCourseDetail.meetingCardTitle}
            </CardTitle>
            <CardDescription>
              {dict.lecturerCourseDetail.meetingCardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!editingSchedule ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    {dict.lecturerCourseDetail.modeShortLabel}{" "}
                  </span>
                  <span className="font-medium">
                    {resolveModeLabel(course.schedule.mode ?? null)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    {dict.lecturerCourseDetail.locationShortLabel}{" "}
                  </span>
                  <span className="font-medium">
                    {course.schedule.location || "—"}
                  </span>
                </p>
                {(course.schedule.mode === "ONLINE" ||
                  course.schedule.mode === "HYBRID") && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">
                      {dict.lecturerCourseDetail.meetingUrlShortLabel}{" "}
                    </span>
                    {course.schedule.meetingUrl ? (
                      <a
                        href={course.schedule.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        {course.schedule.meetingUrl}
                      </a>
                    ) : (
                      <span className="font-medium">
                        {dict.lecturerCourseDetail.meetingUrlNotSet}
                      </span>
                    )}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setScheduleForm({
                      mode: course.schedule.mode ?? "ON_CAMPUS",
                      location: course.schedule.location ?? "",
                      meetingUrl: course.schedule.meetingUrl ?? "",
                    });
                    setEditingSchedule(true);
                  }}
                >
                  {dict.lecturerCourseDetail.editButton}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="lecturer-schedule-mode"
                    className="text-sm font-medium mb-2 block"
                  >
                    {dict.lecturerCourseDetail.modeFieldLabel}
                  </label>
                  <Select
                    value={scheduleForm.mode}
                    onValueChange={(v) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        mode: v as "ONLINE" | "ON_CAMPUS" | "HYBRID",
                      }))
                    }
                  >
                    <SelectTrigger id="lecturer-schedule-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ON_CAMPUS">
                        {resolveModeLabel("ON_CAMPUS")}
                      </SelectItem>
                      <SelectItem value="ONLINE">
                        {resolveModeLabel("ONLINE")}
                      </SelectItem>
                      <SelectItem value="HYBRID">
                        {resolveModeLabel("HYBRID")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="lecturer-schedule-location"
                    className="text-sm font-medium mb-2 block"
                  >
                    {dict.lecturerCourseDetail.locationFieldLabel}
                  </label>
                  <Input
                    id="lecturer-schedule-location"
                    value={scheduleForm.location}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder={dict.lecturerCourseDetail.locationPlaceholder}
                  />
                </div>
                {(scheduleForm.mode === "ONLINE" ||
                  scheduleForm.mode === "HYBRID") && (
                  <div>
                    <label
                      htmlFor="lecturer-schedule-meetingUrl"
                      className="text-sm font-medium mb-2 block"
                    >
                      {dict.lecturerCourseDetail.meetingUrlFieldLabel}
                    </label>
                    <Input
                      id="lecturer-schedule-meetingUrl"
                      type="url"
                      value={scheduleForm.meetingUrl}
                      onChange={(e) =>
                        setScheduleForm((prev) => ({
                          ...prev,
                          meetingUrl: e.target.value,
                        }))
                      }
                      placeholder={
                        dict.lecturerCourseDetail.meetingUrlPlaceholder
                      }
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={scheduleSaving}
                    onClick={async () => {
                      setScheduleSaving(true);
                      try {
                        await lecturerApi.updateCourseSchedule(
                          courseOnSemesterId,
                          {
                            mode: scheduleForm.mode,
                            location: scheduleForm.location.trim() || null,
                            meetingUrl:
                              scheduleForm.mode === "ONLINE" ||
                              scheduleForm.mode === "HYBRID"
                                ? scheduleForm.meetingUrl.trim() || null
                                : null,
                          },
                        );
                        await refetchCourse();
                        setEditingSchedule(false);
                        toast.success(dict.lecturerCourseDetail.updateSuccess);
                      } catch (err) {
                        console.error(err);
                        toast.error(dict.lecturerCourseDetail.updateError);
                      } finally {
                        setScheduleSaving(false);
                      }
                    }}
                  >
                    {scheduleSaving
                      ? dict.lecturerCourseDetail.savingLabel
                      : dict.lecturerCourseDetail.saveButton}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={scheduleSaving}
                    onClick={() => setEditingSchedule(false)}
                  >
                    {dict.lecturerCourseDetail.cancelButton}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grade distribution donut */}
        {students.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {dict.lecturerCourseDetail.gradeDistributionTitle}
              </CardTitle>
              <CardDescription>
                {dict.lecturerCourseDetail.gradeDistributionDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GradeDistributionDonut
                data={gradeDistributionData}
                totalLabel={
                  dict.lecturerCourseDetail.gradeDistributionTotalLabel
                }
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
              {dict.lecturerCourseDetail.studentsTableTitle} ({students.length})
            </CardTitle>
            <CardDescription>
              {dict.lecturerCourseDetail.studentsTableDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {dict.lecturerCourseDetail.studentsTableEmpty}
              </p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {dict.lecturerCourseDetail.studentsTableName}
                      </TableHead>
                      <TableHead>
                        {dict.lecturerCourseDetail.studentsTableStudentId}
                      </TableHead>
                      {GRADE_TYPE_OPTIONS.map((opt) => (
                        <TableHead key={opt.key} className="text-right">
                          {opt.label}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">
                        {dict.lecturerCourseDetail.studentsTableFinal}
                      </TableHead>
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
              {dict.lecturerCourseDetail.examScheduleTitle}
            </CardTitle>
            <CardDescription>
              {dict.lecturerCourseDetail.examScheduleDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {examSchedules.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                {dict.lecturerCourseDetail.examScheduleEmpty}
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
                          : dict.common.tba}
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

        {/* Documents */}
        <LecturerCourseDocuments courseOnSemesterId={courseOnSemesterId} />
      </div>
    </div>
  );
}

function LecturerCourseDocuments({
  courseOnSemesterId,
}: {
  courseOnSemesterId: string;
}) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { documents, loading } = useDocuments();
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();

  const courseDocuments = useMemo(
    () =>
      (documents ?? []).filter(
        (d) => d.courseOnSemesterId === courseOnSemesterId,
      ),
    [documents, courseOnSemesterId],
  );

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    createDoc.mutate(
      {
        data: {
          title: file.name.replace(/\.[^/.]+$/, "") || file.name,
          courseOnSemesterId,
        },
        file,
      },
      {
        onSettled: () => {
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      },
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDownload = async (doc: CourseDocument) => {
    setDownloadingId(doc.id);
    try {
      await documentApi.download(doc.id, doc.title);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          {dict.lecturerCourseDetail.documentsTitle}
        </CardTitle>
        <CardDescription>
          {dict.lecturerCourseDetail.documentsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload zone: browse + drag-drop */}
        <section
          aria-label={dict.lecturerCourseDetail.uploadDropzoneAria}
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
          <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {dict.lecturerCourseDetail.uploadDropzoneText}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={createDoc.isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            {dict.lecturerCourseDetail.uploadBrowseButton}
          </Button>
        </section>

        {/* Document list */}
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {dict.lecturerCourseDetail.documentsLoading}
          </p>
        ) : courseDocuments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {dict.lecturerCourseDetail.documentsEmpty}
          </p>
        ) : (
          <ul className="space-y-2">
            {courseDocuments.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <span className="truncate text-sm font-medium">
                  {doc.title}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(doc)}
                    disabled={downloadingId === doc.id}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteDoc.mutate(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
