"use client";

import { type EnrolledCourse, studentApi } from "@/lib/api/student";
import {
	BookOpen,
	Calendar,
	GraduationCap,
	MapPin,
	TrendingUp,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "./shadcn/badge";
import { Button } from "./shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "./shadcn/card";
import { Progress } from "./shadcn/progress";

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
	// Mock progress calculation based on available grades
	let completedAssessments = 0;
	if (grades.gradeType1 !== null) completedAssessments++;
	if (grades.gradeType2 !== null) completedAssessments++;
	if (grades.gradeType3 !== null) completedAssessments++;
	if (grades.finalGrade !== null) completedAssessments++;

	return (completedAssessments / 4) * 100;
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

export function StudentCourses() {
	const [courses, setCourses] = useState<EnrolledCourse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
										{courses.reduce((sum, c) => sum + c.course.credits, 0)}
									</p>
									<p className="text-sm text-muted-foreground">Total Credits</p>
								</CardContent>
							</Card>
							<Card className="border-border/50">
								<CardContent className="p-4 text-center">
									<p className="text-3xl font-bold text-emerald-600">
										{
											courses.filter(
												(c) =>
													c.grades.finalGrade !== null &&
													c.grades.finalGrade >= 5,
											).length
										}
									</p>
									<p className="text-sm text-muted-foreground">Completed</p>
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

						{/* Course Cards */}
						<div className="grid gap-6">
							{courses.map((course) => {
								const progress = calculateProgress(course.grades);
								const status = getGradeStatus(course.grades.finalGrade);

								return (
									<Card
										key={course.enrollmentId}
										className="border-border/50 shadow-md hover:shadow-lg transition-shadow"
									>
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
														<span>•</span>
														<span>{course.semester.name}</span>
														{course.course.department && (
															<>
																<span>•</span>
																<span>{course.course.department}</span>
															</>
														)}
													</div>
												</div>
												<Badge variant={status.variant}>{status.label}</Badge>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											{/* Schedule & Lecturer */}
											<div className="grid md:grid-cols-2 gap-4">
												<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
													<Calendar className="w-5 h-5 text-muted-foreground" />
													<div>
														<p className="text-xs text-muted-foreground">
															Schedule
														</p>
														<p className="font-medium">
															{course.schedule.dayOfWeek !== null
																? `${DAYS_OF_WEEK[course.schedule.dayOfWeek]}, ${formatTime(course.schedule.startTime)} - ${formatTime(course.schedule.endTime)}`
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
												<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
													<User className="w-5 h-5 text-muted-foreground" />
													<div>
														<p className="text-xs text-muted-foreground">
															Lecturer
														</p>
														<p className="font-medium">
															{course.lecturer?.fullName || "TBA"}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
													<TrendingUp className="w-5 h-5 text-muted-foreground" />
													<div>
														<p className="text-xs text-muted-foreground">
															Final Grade
														</p>
														<p className="font-medium">
															{course.grades.finalGrade !== null
																? course.grades.finalGrade.toFixed(2)
																: "Pending"}
														</p>
													</div>
												</div>
											</div>

											{/* Progress Bar */}
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Course Progress
													</span>
													<span className="font-medium">
														{progress.toFixed(0)}%
													</span>
												</div>
												<Progress value={progress} className="h-2" />
											</div>

											{/* Grade Breakdown */}
											<div className="grid grid-cols-4 gap-2 pt-2">
												<div className="text-center p-2 bg-muted/30 rounded">
													<p className="text-xs text-muted-foreground">
														Assignment 1
													</p>
													<p className="font-semibold">
														{course.grades.gradeType1?.toFixed(1) ?? "-"}
													</p>
												</div>
												<div className="text-center p-2 bg-muted/30 rounded">
													<p className="text-xs text-muted-foreground">
														Assignment 2
													</p>
													<p className="font-semibold">
														{course.grades.gradeType2?.toFixed(1) ?? "-"}
													</p>
												</div>
												<div className="text-center p-2 bg-muted/30 rounded">
													<p className="text-xs text-muted-foreground">
														Midterm
													</p>
													<p className="font-semibold">
														{course.grades.gradeType3?.toFixed(1) ?? "-"}
													</p>
												</div>
												<div className="text-center p-2 bg-muted/30 rounded">
													<p className="text-xs text-muted-foreground">Final</p>
													<p className="font-semibold">
														{course.grades.finalGrade?.toFixed(1) ?? "-"}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
