"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { usePublicCourseSemesters } from "@/components/ui/hooks";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import type { CourseSemester } from "@/lib/api/course-semester";
import {
  lecturerApi,
  type AssignedCourse,
  type LecturerTeachingRequestItem,
} from "@/lib/api/lecturer";
import { studentApi } from "@/lib/api/student";
import { getClientDictionary, isLocale, useLocalePath } from "@/lib/i18n";
import {
  BookOpen,
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  LayoutGrid,
  MapPin,
  RefreshCw,
  Search,
  Table2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { CoursesTable } from "./_components/CoursesTable";

function formatTime(minutes: number | null, tba = "TBA"): string {
  if (minutes === null) return tba;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export default function CoursesPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const locale = isLocale(lang) ? lang : "en";
  const dict = getClientDictionary(locale);
  const localePath = useLocalePath();
  const c = dict.courses;
  const common = dict.common;
  const DAYS_OF_WEEK = dict.daysOfWeek;
  const { isAuthenticated, role } = useSession();
  const {
    data: courseOfferings,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePublicCourseSemesters({
    includeCourses: true,
    includeSemesters: true,
    includeLecturer: true,
    includeEnrollmentCount: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseSemester | null>(
    null,
  );
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [myCourses, setMyCourses] = useState<AssignedCourse[]>([]);
  const [myTeachingRequests, setMyTeachingRequests] = useState<
    LecturerTeachingRequestItem[]
  >([]);
  const [enrolledCourseOnSemesterIds, setEnrolledCourseOnSemesterIds] =
    useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [myCoursesOnly, setMyCoursesOnly] = useState(false);

  // Extract unique semesters for filter dropdown
  const availableSemesters = useMemo(() => {
    if (!courseOfferings) return [];
    const semesterMap = new Map<string, { id: string; name: string }>();
    for (const offering of courseOfferings) {
      if (offering.semester?.id && offering.semester?.name) {
        semesterMap.set(offering.semester.id, {
          id: offering.semester.id,
          name: offering.semester.name,
        });
      }
    }
    return Array.from(semesterMap.values()).sort((a, b) =>
      b.name.localeCompare(a.name),
    );
  }, [courseOfferings]);

  // Filter courses based on search query and semester
  const filteredCourses = useMemo(() => {
    if (!courseOfferings) return [];

    return courseOfferings.filter((offering) => {
      // Apply semester filter
      if (
        semesterFilter !== "all" &&
        offering.semester?.id !== semesterFilter
      ) {
        return false;
      }

      // Apply search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          offering.course?.name.toLowerCase().includes(query) ||
          offering.course?.department?.name?.toLowerCase().includes(query) ||
          offering.lecturer?.fullName?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, semesterFilter, courseOfferings]);

  const isLecturer = role === "lecturer";
  const isStudent = role === "student";

  const myAssignedIds = useMemo(
    () => new Set(myCourses.map((c) => c.courseOnSemesterId)),
    [myCourses],
  );

  // Apply "my courses only" filter for students (enrolled) and lecturers (teaching)
  const displayCourses = useMemo(() => {
    if (!myCoursesOnly || (!isStudent && !isLecturer)) return filteredCourses;
    if (isStudent) {
      return filteredCourses.filter((o) =>
        enrolledCourseOnSemesterIds.has(o.id),
      );
    }
    return filteredCourses.filter((o) => myAssignedIds.has(o.id));
  }, [
    filteredCourses,
    myCoursesOnly,
    isStudent,
    isLecturer,
    enrolledCourseOnSemesterIds,
    myAssignedIds,
  ]);

  const coursesByDepartment = useMemo(() => {
    return displayCourses.reduce(
      (acc, offering) => {
        const deptName = offering.course?.department?.name || common.other;
        if (!acc[deptName]) {
          acc[deptName] = [];
        }
        acc[deptName].push(offering);
        return acc;
      },
      {} as Record<string, CourseSemester[]>,
    );
  }, [displayCourses, common.other]);

  useEffect(() => {
    if (isLecturer) {
      lecturerApi
        .getCourses()
        .then(setMyCourses)
        .catch(() => setMyCourses([]));
      lecturerApi
        .getMyTeachingRequests()
        .then(setMyTeachingRequests)
        .catch(() => setMyTeachingRequests([]));
    }
  }, [isLecturer]);

  useEffect(() => {
    if (isStudent) {
      studentApi
        .getEnrollments()
        .then((list) =>
          setEnrolledCourseOnSemesterIds(
            new Set(list.map((e) => e.courseOnSemesterId)),
          ),
        )
        .catch(() => setEnrolledCourseOnSemesterIds(new Set()));
    }
  }, [isStudent]);

  function semesterHasStarted(startDate: string | undefined): boolean {
    if (!startDate) return false;
    const today = new Date().toISOString().split("T")[0];
    const start = startDate.includes("T") ? startDate.split("T")[0] : startDate;
    return start <= today;
  }

  function hasScheduleConflict(
    offering: CourseSemester,
    myAssignments: AssignedCourse[],
  ): boolean {
    const day = offering.dayOfWeek;
    const start = offering.startTime;
    const end = offering.endTime;
    if (day === null || start === null || end === null) return false;
    for (const c of myAssignments) {
      const d = c.schedule.dayOfWeek;
      const s = c.schedule.startTime;
      const e = c.schedule.endTime;
      if (d === null || s === null || e === null) continue;
      if (d !== day) continue;
      if (start < e && end > s) return true;
    }
    return false;
  }

  function canRequestTeaching(offering: CourseSemester | null): boolean {
    if (!offering) return false;
    if (offering.lecturerId) return false;
    if (!offering.semester?.startDate) return false;
    if (!semesterHasStarted(offering.semester.startDate)) return false;
    const pending = myTeachingRequests.some(
      (r) => r.courseOnSemesterId === offering.id && r.status === "PENDING",
    );
    if (pending) return false;
    if (hasScheduleConflict(offering, myCourses)) return false;
    return true;
  }

  const handleRequestToTeach = async () => {
    if (!selectedCourse) return;
    setIsRequesting(true);
    try {
      await lecturerApi.requestToTeach(selectedCourse.id);
      toast.success(c.requestSent);
      setSelectedCourse(null);
      lecturerApi.getMyTeachingRequests().then(setMyTeachingRequests);
      refetch();
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(e?.response?.data?.message ?? e?.message ?? c.requestFailed);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;

    setIsEnrolling(true);
    try {
      await studentApi.enrollCourse(selectedCourse.id);
      toast.success(c.enrollSuccess);
      setSelectedCourse(null);
      refetch(); // Refresh to update enrollment counts
      studentApi
        .getEnrollments()
        .then((list) =>
          setEnrolledCourseOnSemesterIds(
            new Set(list.map((e) => e.courseOnSemesterId)),
          ),
        );
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        error.response?.data?.message || error.message || c.enrollFailed,
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">{c.signInRequired}</h1>
        <p className="text-muted-foreground">{c.signInToBrowse}</p>
        <Link href={localePath("/sign-in")}>
          <Button>{dict.nav.signIn}</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold mb-4">{common.error}</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{c.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={c.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder={c.allSemesters} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{c.allSemesters}</SelectItem>
              {availableSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border p-1">
              <Button
                type="button"
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="gap-1.5"
                title={c.viewCards}
                aria-label={c.viewCards}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">{c.viewCards}</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-1.5"
                title={c.viewTable}
                aria-label={c.viewTable}
              >
                <Table2 className="h-4 w-4" />
                <span className="hidden sm:inline">{c.viewTable}</span>
              </Button>
            </div>
            {(isStudent || isLecturer) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={myCoursesOnly}
                  onCheckedChange={(checked) =>
                    setMyCoursesOnly(checked === true)
                  }
                  aria-label={c.filterMyCoursesOnly}
                />
                <button
                  type="button"
                  className="cursor-pointer hover:text-foreground bg-transparent border-none p-0 font-inherit"
                  onClick={() => setMyCoursesOnly((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setMyCoursesOnly((v) => !v);
                    }
                  }}
                >
                  {c.filterMyCoursesOnly}
                </button>
              </div>
            )}
            <Badge variant="secondary" className="px-4 py-2">
              {displayCourses.length} {c.offerings}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isRefetching}
              title={c.refreshTitle}
              aria-label={c.refreshTitle}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Navigation hint */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isStudent
              ? c.hintStudent
              : isLecturer
                ? c.hintLecturer
                : c.hintOther}
          </p>
          <Link href={localePath("/my-courses")}>
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              {dict.nav.myCourses}
            </Button>
          </Link>
        </div>

        {displayCourses.length === 0 ? (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{c.noCoursesFound}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || semesterFilter !== "all" || myCoursesOnly
                  ? c.noMatchCriteria
                  : c.noOfferingsAvailable}
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <CoursesTable
            data={displayCourses}
            daysOfWeek={DAYS_OF_WEEK}
            labels={{
              course: c.tableCourse,
              semester: c.tableSemester,
              department: c.tableDepartment,
              credits: common.credits,
              schedule: common.schedule,
              location: common.location,
              lecturer: common.lecturer,
              enrollment: common.enrollment,
              enrolled: c.enrolled,
              teaching: c.teaching,
              full: c.full,
              tba: common.tba,
              unknownCourse: common.unknownCourse,
            }}
            enrolledIds={enrolledCourseOnSemesterIds}
            myAssignedIds={myAssignedIds}
            isStudent={isStudent}
            isLecturer={isLecturer}
            onRowClick={setSelectedCourse}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(coursesByDepartment)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([departmentName, deptCourses]) => (
                <div key={departmentName} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">{departmentName}</h2>
                    <Badge variant="secondary">{deptCourses.length}</Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {deptCourses.map((offering) => {
                      const enrollmentCount = offering._count?.enrollments ?? 0;
                      const capacity = offering.capacity;
                      const isFull =
                        capacity !== null && enrollmentCount >= capacity;

                      return (
                        <Card
                          key={offering.id}
                          className={`border-border/50 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                            isStudent || isLecturer
                              ? "hover:border-primary/50"
                              : ""
                          }`}
                          onClick={() =>
                            (isStudent || isLecturer) &&
                            setSelectedCourse(offering)
                          }
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-lg font-semibold line-clamp-2">
                                {offering.course?.name ?? common.unknownCourse}
                              </h3>
                              <div className="flex shrink-0 flex-wrap items-center gap-1.5 justify-end">
                                {isStudent &&
                                  enrolledCourseOnSemesterIds.has(
                                    offering.id,
                                  ) && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-primary/15 text-primary"
                                    >
                                      {c.enrolled}
                                    </Badge>
                                  )}
                                {isLecturer &&
                                  myAssignedIds.has(offering.id) && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-primary/15 text-primary"
                                    >
                                      {c.teaching}
                                    </Badge>
                                  )}
                                {isFull && (
                                  <Badge variant="destructive">{c.full}</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {offering.semester?.name}
                            </p>
                            {offering.course?.recommendedSemester && (
                              <p className="text-xs text-muted-foreground">
                                {common.recommendedFor}{" "}
                                {offering.course.recommendedSemester}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">
                                {offering.course?.credits ?? 0} {common.credits}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>
                                  {enrollmentCount}
                                  {capacity !== null && `/${capacity}`}
                                </span>
                              </div>
                            </div>
                            {offering.dayOfWeek !== null && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {DAYS_OF_WEEK[offering.dayOfWeek]},{" "}
                                  {formatTime(offering.startTime, common.tba)} -{" "}
                                  {formatTime(offering.endTime, common.tba)}
                                </span>
                              </div>
                            )}
                            {offering.location && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{offering.location}</span>
                              </div>
                            )}
                            {offering.lecturer && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span>
                                  {offering.lecturer.fullName ??
                                    offering.lecturer.lecturerId}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Enrollment Dialog */}
      <Dialog
        open={selectedCourse !== null}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.course?.name}</DialogTitle>
            <DialogDescription>
              {selectedCourse?.semester?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Course details */}
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {common.credits}
                  </p>
                  <p className="font-medium">
                    {selectedCourse?.course?.credits ?? 0}
                  </p>
                </div>
              </div>

              {selectedCourse?.course?.recommendedSemester && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {common.recommendedFor}
                    </p>
                    <p className="font-medium">
                      {selectedCourse.course.recommendedSemester}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {common.schedule}
                  </p>
                  <p className="font-medium">
                    {selectedCourse?.dayOfWeek !== null &&
                    selectedCourse?.dayOfWeek !== undefined
                      ? `${DAYS_OF_WEEK[selectedCourse.dayOfWeek]}, ${formatTime(selectedCourse.startTime, common.tba)} - ${formatTime(selectedCourse.endTime, common.tba)}`
                      : common.tba}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {common.location}
                  </p>
                  <p className="font-medium">
                    {selectedCourse?.location || common.tba}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {common.lecturer}
                  </p>
                  <p className="font-medium">
                    {selectedCourse?.lecturer?.fullName ?? common.tba}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {common.enrollment}
                  </p>
                  <p className="font-medium">
                    {selectedCourse?._count?.enrollments ?? 0}
                    {selectedCourse?.capacity !== null &&
                      selectedCourse?.capacity !== undefined &&
                      ` / ${selectedCourse.capacity}`}{" "}
                    {common.students}
                  </p>
                </div>
              </div>
            </div>

            {/* Capacity warning */}
            {selectedCourse?.capacity !== null &&
              selectedCourse?.capacity !== undefined &&
              (selectedCourse?._count?.enrollments ?? 0) >=
                selectedCourse.capacity && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {c.capacityFullWarning}
                </div>
              )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              {common.cancel}
            </Button>
            {isStudent &&
              selectedCourse &&
              !enrolledCourseOnSemesterIds.has(selectedCourse.id) && (
                <Button onClick={handleEnroll} disabled={isEnrolling}>
                  {isEnrolling ? c.enrolling : c.enrollInCourse}
                </Button>
              )}
            {isLecturer &&
              selectedCourse &&
              !myAssignedIds.has(selectedCourse.id) &&
              canRequestTeaching(selectedCourse) && (
                <Button onClick={handleRequestToTeach} disabled={isRequesting}>
                  {isRequesting ? c.submitting : c.requestToTeach}
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
