"use client";

import { useEffect, useState } from "react";
import {
    lecturerApi,
    LecturerProfile,
    AssignedCourse,
    CourseStudent,
    LecturerSchedule,
} from "@/lib/api/lecturer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";

const DAY_NAMES: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

function formatTime(time: number | null): string {
    if (time === null) return "-";
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function LecturerDashboard() {
    const [profile, setProfile] = useState<LecturerProfile | null>(null);
    const [courses, setCourses] = useState<AssignedCourse[]>([]);
    const [schedule, setSchedule] = useState<LecturerSchedule>({});
    const [selectedCourse, setSelectedCourse] = useState<AssignedCourse | null>(
        null
    );
    const [students, setStudents] = useState<CourseStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"courses" | "schedule">("courses");
    const [editingGrades, setEditingGrades] = useState<Record<string, CourseStudent["grades"]>>({});

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [profileData, coursesData, scheduleData] = await Promise.all([
                    lecturerApi.getProfile(),
                    lecturerApi.getCourses(),
                    lecturerApi.getSchedule(),
                ]);
                setProfile(profileData);
                setCourses(coursesData);
                setSchedule(scheduleData);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const loadCourseStudents = async (course: AssignedCourse) => {
        try {
            setStudentsLoading(true);
            setSelectedCourse(course);
            const studentsData = await lecturerApi.getCourseStudents(
                course.courseOnSemesterId
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
        value: string
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
        if (!selectedCourse) return;
        try {
            await lecturerApi.updateGrade(selectedCourse.courseOnSemesterId, {
                studentId,
                ...editingGrades[studentId],
            });
            // Update local state
            setStudents((prev) =>
                prev.map((s) =>
                    s.student.id === studentId
                        ? { ...s, grades: editingGrades[studentId] }
                        : s
                )
            );
        } catch (err) {
            console.error(err);
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
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {profile?.fullName || profile?.username}
                    </p>
                </div>
            </div>

            {/* Profile Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Lecturer ID</p>
                            <p className="font-medium">{profile?.lecturerId}</p>
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
                            <p className="text-sm text-muted-foreground">Department Head</p>
                            <p className="font-medium">
                                {profile?.departmentHead?.name || "Not a department head"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("courses");
                        setSelectedCourse(null);
                    }}
                    className={`px-4 py-2 rounded-md font-medium transition ${activeTab === "courses"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                        }`}
                >
                    My Courses ({courses.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("schedule")}
                    className={`px-4 py-2 rounded-md font-medium transition ${activeTab === "schedule"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                        }`}
                >
                    Schedule
                </button>
            </div>

            {/* Courses Tab */}
            {activeTab === "courses" && !selectedCourse && (
                <div className="grid gap-4 md:grid-cols-2">
                    {courses.length === 0 ? (
                        <Card className="col-span-2">
                            <CardContent className="p-6 text-center text-muted-foreground">
                                No assigned courses found.
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
                                                {course.semester.name} • {course.course.credits} credits
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">{course.course.department}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Schedule</p>
                                            <p className="font-medium">
                                                {course.schedule.dayOfWeek !== null
                                                    ? DAY_NAMES[course.schedule.dayOfWeek]
                                                    : "-"}{" "}
                                                {formatTime(course.schedule.startTime)} -{" "}
                                                {formatTime(course.schedule.endTime)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Enrolled</p>
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
                        ← Back to Courses
                    </Button>

                    <Card>
                        <CardHeader>
                            <CardTitle>{selectedCourse.course.name}</CardTitle>
                            <CardDescription>
                                {selectedCourse.semester.name} • {students.length} students
                                enrolled
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
                                                <th className="text-left py-3 px-2">Student ID</th>
                                                <th className="text-left py-3 px-2">Name</th>
                                                <th className="text-center py-3 px-2">Type 1</th>
                                                <th className="text-center py-3 px-2">Type 2</th>
                                                <th className="text-center py-3 px-2">Type 3</th>
                                                <th className="text-center py-3 px-2">Final</th>
                                                <th className="text-center py-3 px-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.enrollmentId} className="border-b">
                                                    <td className="py-3 px-2">
                                                        {student.student.studentId || "-"}
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        {student.student.fullName || student.student.email}
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            className="w-16 text-center"
                                                            value={
                                                                editingGrades[student.student.id]?.gradeType1 ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleGradeChange(
                                                                    student.student.id,
                                                                    "gradeType1",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            className="w-16 text-center"
                                                            value={
                                                                editingGrades[student.student.id]?.gradeType2 ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleGradeChange(
                                                                    student.student.id,
                                                                    "gradeType2",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            className="w-16 text-center"
                                                            value={
                                                                editingGrades[student.student.id]?.gradeType3 ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleGradeChange(
                                                                    student.student.id,
                                                                    "gradeType3",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                            className="w-16 text-center"
                                                            value={
                                                                editingGrades[student.student.id]?.finalGrade ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleGradeChange(
                                                                    student.student.id,
                                                                    "finalGrade",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3 px-2 text-center">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => saveGrade(student.student.id)}
                                                        >
                                                            Save
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
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Schedule</CardTitle>
                        <CardDescription>Current semester timetable</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(schedule).length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                No schedule for current semester.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(schedule)
                                    .sort(([a], [b]) => Number(a) - Number(b))
                                    .map(([day, classes]) => (
                                        <div key={day}>
                                            <h3 className="font-semibold text-lg mb-2">
                                                {DAY_NAMES[Number(day)]}
                                            </h3>
                                            <div className="space-y-2">
                                                {classes.map((classInfo, idx) => (
                                                    <div
                                                        key={classInfo.courseName + idx}
                                                        className="flex justify-between items-center p-3 bg-muted rounded-md"
                                                    >
                                                        <p className="font-medium">{classInfo.courseName}</p>
                                                        <div className="text-right">
                                                            <p className="font-medium">
                                                                {formatTime(classInfo.startTime)} -{" "}
                                                                {formatTime(classInfo.endTime)}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {classInfo.location || "-"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className="mt-4" />
                                        </div>
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
