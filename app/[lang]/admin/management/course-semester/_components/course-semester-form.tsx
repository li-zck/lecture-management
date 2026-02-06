"use client";

import { useCourses, useLecturers, useSemesters } from "@/components/ui/hooks";
import { Button } from "@/components/ui/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/shadcn/select";
import { createCourseSemesterSchema } from "@/lib/zod/schemas/create/course-semester";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define type manually to avoid z.coerce.number() inferring as `unknown`
type CourseSemesterFormValues = {
	courseId: string;
	semesterId: string;
	lecturerId?: string;
	dayOfWeek?: number;
	startTime?: number;
	endTime?: number;
	location?: string;
	capacity?: number;
};

interface CourseSemesterFormProps {
	initialValues?: Partial<CourseSemesterFormValues>;
	onSubmit: (values: CourseSemesterFormValues) => Promise<void>;
	mode: "create" | "edit";
}

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export function CourseSemesterForm({
	initialValues,
	onSubmit,
	mode,
}: CourseSemesterFormProps) {
	const { courses } = useCourses();
	const { semesters } = useSemesters();
	const { lecturers } = useLecturers();

	const form = useForm<CourseSemesterFormValues>({
		// Cast needed because z.coerce.number() infers as `unknown`
		resolver: zodResolver(createCourseSemesterSchema) as any,
		defaultValues: {
			courseId: initialValues?.courseId ?? "",
			semesterId: initialValues?.semesterId ?? "",
			lecturerId: initialValues?.lecturerId,
			dayOfWeek: initialValues?.dayOfWeek,
			startTime: initialValues?.startTime,
			endTime: initialValues?.endTime,
			location: initialValues?.location ?? "",
			capacity: initialValues?.capacity ?? 60,
		},
	});

	const handleSubmit = async (values: CourseSemesterFormValues) => {
		await onSubmit(values);
	};

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>
						{mode === "create" ? "Add Course Schedule" : "Edit Course Schedule"}
					</CardTitle>
					<CardDescription>
						{mode === "create"
							? "Assign a course to a semester with schedule details."
							: "Update the course schedule information below."}
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="courseId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Course</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
												disabled={mode === "edit"}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a course" />
													</SelectTrigger>
												</FormControl>
												<SelectContent position="popper" sideOffset={5}>
													{courses.map((c) => (
														<SelectItem key={c.id} value={c.id}>
															{c.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="semesterId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Semester</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
												disabled={mode === "edit"}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a semester" />
													</SelectTrigger>
												</FormControl>
												<SelectContent position="popper" sideOffset={5}>
													{semesters.map((s) => (
														<SelectItem key={s.id} value={s.id}>
															{s.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="lecturerId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Lecturer (Optional)</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a lecturer" />
												</SelectTrigger>
											</FormControl>
											<SelectContent position="popper" sideOffset={5}>
												<SelectItem value="none">Unassigned</SelectItem>
												{lecturers.map((l) => (
													<SelectItem key={l.id} value={l.id}>
														{l.fullName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="dayOfWeek"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Day of Week</FormLabel>
											<Select
												onValueChange={(val) => field.onChange(Number(val))}
												value={field.value?.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select day" />
													</SelectTrigger>
												</FormControl>
												<SelectContent position="popper" sideOffset={5}>
													{DAYS.map((day, index) => (
														<SelectItem key={day} value={index.toString()}>
															{day}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="startTime"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Start Period</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={1}
													placeholder="1"
													{...field}
													onChange={(e) =>
														field.onChange(e.target.valueAsNumber)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="endTime"
									render={({ field }) => (
										<FormItem>
											<FormLabel>End Period</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={1}
													placeholder="3"
													{...field}
													onChange={(e) =>
														field.onChange(e.target.valueAsNumber)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="location"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Location</FormLabel>
											<FormControl>
												<Input placeholder="Room 101" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="capacity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Capacity</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={1}
													{...field}
													onChange={(e) =>
														field.onChange(e.target.valueAsNumber)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex justify-end">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{mode === "create" ? "Add Schedule" : "Save Changes"}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
