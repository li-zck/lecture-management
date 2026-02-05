"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { usePublicCourseSemesters } from "@/components/ui/hooks";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import type { CourseSemester } from "@/lib/api/course-semester";
import {
  lecturerApi,
  type AssignedCourse,
  type LecturerTeachingRequestItem,
} from "@/lib/api/lecturer";
import { studentApi } from "@/lib/api/student";
import {
  BookOpen,
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
  RefreshCw,
  Search,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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

export default function CoursesPage() {
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

  // Group courses by department
  const isLecturer = role === "lecturer";

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

  const coursesByDepartment = useMemo(() => {
    return filteredCourses.reduce(
      (acc, offering) => {
        const deptName = offering.course?.department?.name || "Other";
        if (!acc[deptName]) {
          acc[deptName] = [];
        }
        acc[deptName].push(offering);
        return acc;
      },
      {} as Record<string, CourseSemester[]>,
    );
  }, [filteredCourses]);

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
      toast.success("Request sent. An admin will review it.");
      setSelectedCourse(null);
      lecturerApi.getMyTeachingRequests().then(setMyTeachingRequests);
      refetch();
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        e?.response?.data?.message ?? e?.message ?? "Failed to submit request",
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;

    setIsEnrolling(true);
    try {
      await studentApi.enrollCourse(selectedCourse.id);
      toast.success("Successfully enrolled in the course!");
      setSelectedCourse(null);
      refetch(); // Refresh to update enrollment counts
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to enroll in course",
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
        <h1 className="text-2xl font-bold">Sign In Required</h1>
        <p className="text-muted-foreground">
          Please sign in to browse courses.
        </p>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const isStudent = role === "student";

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Course Catalog
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse available course offerings and enroll in courses
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {availableSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-4 py-2">
              {filteredCourses.length} Offerings
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              {Object.keys(coursesByDepartment).length} Departments
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isRefetching}
              title="Refresh course list"
              aria-label="Refresh course list"
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
              ? "Click on a course to view details and enroll"
              : isLecturer
                ? "Click on a course to view details and request to teach"
                : "Looking for your enrolled/assigned courses?"}
          </p>
          <Link href="/my-courses">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              My Courses
            </Button>
          </Link>
        </div>

        {filteredCourses.length === 0 ? (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No Courses Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || semesterFilter !== "all"
                  ? "No courses match your search criteria. Try adjusting your search or filter."
                  : "There are no course offerings available at the moment."}
              </p>
            </CardContent>
          </Card>
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
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg line-clamp-2">
                                {offering.course?.name ?? "Unknown Course"}
                              </CardTitle>
                              {isFull && (
                                <Badge
                                  variant="destructive"
                                  className="shrink-0"
                                >
                                  Full
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {offering.semester?.name}
                            </p>
                            {offering.course?.recommendedSemester && (
                              <p className="text-xs text-muted-foreground">
                                Recommended for:{" "}
                                {offering.course.recommendedSemester}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">
                                {offering.course?.credits ?? 0} Credits
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>
                                  {enrollmentCount}
                                  {capacity !== null && `/${capacity}`}
                                </span>
                              </div>
                            </div>

                            {/* Schedule info */}
                            {offering.dayOfWeek !== null && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {DAYS_OF_WEEK[offering.dayOfWeek]},{" "}
                                  {formatTime(offering.startTime)} -{" "}
                                  {formatTime(offering.endTime)}
                                </span>
                              </div>
                            )}

                            {/* Location */}
                            {offering.location && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{offering.location}</span>
                              </div>
                            )}

                            {/* Lecturer */}
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
                  <p className="text-xs text-muted-foreground">Credits</p>
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
                      Recommended for
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
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="font-medium">
                    {selectedCourse?.dayOfWeek !== null &&
                    selectedCourse?.dayOfWeek !== undefined
                      ? `${DAYS_OF_WEEK[selectedCourse.dayOfWeek]}, ${formatTime(selectedCourse.startTime)} - ${formatTime(selectedCourse.endTime)}`
                      : "TBA"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {selectedCourse?.location || "TBA"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Lecturer</p>
                  <p className="font-medium">
                    {selectedCourse?.lecturer?.fullName ?? "TBA"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Enrollment</p>
                  <p className="font-medium">
                    {selectedCourse?._count?.enrollments ?? 0}
                    {selectedCourse?.capacity !== null &&
                      selectedCourse?.capacity !== undefined &&
                      ` / ${selectedCourse.capacity}`}{" "}
                    students
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
                  This course is currently full. You may still attempt to enroll
                  and be placed on a waitlist.
                </div>
              )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              Cancel
            </Button>
            {isStudent && (
              <Button onClick={handleEnroll} disabled={isEnrolling}>
                {isEnrolling ? "Enrolling..." : "Enroll in Course"}
              </Button>
            )}
            {isLecturer && canRequestTeaching(selectedCourse) && (
              <Button onClick={handleRequestToTeach} disabled={isRequesting}>
                {isRequesting ? "Submitting..." : "Request to teach"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
