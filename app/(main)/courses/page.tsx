"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { useAllCourses } from "@/components/ui/hooks";
import type { Course } from "@/lib/api/course";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { BookOpen, Building2, GraduationCap, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function CoursesPage() {
	const { isAuthenticated } = useSession();
	const { data, isLoading, error } = useAllCourses();
	const courses = data?.data ?? [];
	const [searchQuery, setSearchQuery] = useState("");

	// Filter courses based on search query
	const filteredCourses = useMemo(() => {
		if (searchQuery.trim() === "") {
			return courses;
		}
		const query = searchQuery.toLowerCase();
		return courses.filter(
			(course) =>
				course.name.toLowerCase().includes(query) ||
				course.department?.name.toLowerCase().includes(query),
		);
	}, [searchQuery, courses]);

	// Group courses by department
	const coursesByDepartment = useMemo(() => {
		return filteredCourses.reduce(
			(acc, course) => {
				const deptName = course.department?.name || "Other";
				if (!acc[deptName]) {
					acc[deptName] = [];
				}
				acc[deptName].push(course);
				return acc;
			},
			{} as Record<string, Course[]>,
		);
	}, [filteredCourses]);

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
						Browse all available courses offered at the university
					</p>
				</div>

				{/* Search and Stats */}
				<div className="flex flex-col md:flex-row gap-4 mb-8">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search courses by name or department..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<div className="flex gap-2">
						<Badge variant="secondary" className="px-4 py-2">
							{filteredCourses.length} Courses
						</Badge>
						<Badge variant="outline" className="px-4 py-2">
							{Object.keys(coursesByDepartment).length} Departments
						</Badge>
					</div>
				</div>

				{/* Navigation hint */}
				<div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Looking for your enrolled courses?
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
								{searchQuery
									? "No courses match your search criteria. Try adjusting your search."
									: "There are no courses available at the moment."}
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
										{deptCourses.map((course) => (
											<Card
												key={course.id}
												className="border-border/50 shadow-md hover:shadow-lg transition-shadow"
											>
												<CardHeader className="pb-2">
													<CardTitle className="text-lg line-clamp-2">
														{course.name}
													</CardTitle>
												</CardHeader>
												<CardContent>
													<div className="flex items-center justify-between">
														<Badge variant="outline">
															{course.credits} Credits
														</Badge>
														<span className="text-xs text-muted-foreground">
															{course.department?.name}
														</span>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
}
