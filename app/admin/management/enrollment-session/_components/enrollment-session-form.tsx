"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Checkbox,
} from "@/components/ui/shadcn";
import { useSemesters } from "@/components/ui/hooks/use-semesters";
import {
	createEnrollmentSessionSchema,
	type CreateEnrollmentSessionFormValues,
} from "@/lib/zod/schemas/create/enrollment-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EnrollmentSessionFormProps {
	initialValues?: Partial<CreateEnrollmentSessionFormValues>;
	onSubmit: (values: CreateEnrollmentSessionFormValues) => Promise<void>;
	mode: "create" | "edit";
}

export function EnrollmentSessionForm({
	initialValues,
	onSubmit,
	mode,
}: EnrollmentSessionFormProps) {
	const { semesters, loading: semestersLoading } = useSemesters();

	const form = useForm<CreateEnrollmentSessionFormValues>({
		resolver: zodResolver(createEnrollmentSessionSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			semesterId: initialValues?.semesterId ?? "",
			startDate: initialValues?.startDate
				? new Date(initialValues.startDate).toISOString().slice(0, 16)
				: "",
			endDate: initialValues?.endDate
				? new Date(initialValues.endDate).toISOString().slice(0, 16)
				: "",
			isActive: initialValues?.isActive ?? false,
		},
	});

	const handleSubmit = async (values: CreateEnrollmentSessionFormValues) => {
		await onSubmit(values);
	};

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>
						{mode === "create"
							? "Create Enrollment Session"
							: "Edit Enrollment Session"}
					</CardTitle>
					<CardDescription>
						{mode === "create"
							? "Define a time period when students can enroll in courses."
							: "Update the enrollment session details."}
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Session Name (Optional)</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., Early Registration, Regular Enrollment"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											A descriptive name for this enrollment period
										</FormDescription>
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
											disabled={semestersLoading}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a semester" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{semesters.map((semester) => (
													<SelectItem key={semester.id} value={semester.id}>
														{semester.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											The semester this enrollment session is for
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Start Date & Time</FormLabel>
											<FormControl>
												<Input type="datetime-local" {...field} />
											</FormControl>
											<FormDescription>When enrollment opens</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>End Date & Time</FormLabel>
											<FormControl>
												<Input type="datetime-local" {...field} />
											</FormControl>
											<FormDescription>When enrollment closes</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Active</FormLabel>
											<FormDescription>
												When active, this session will be available for
												enrollment during the specified time range
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className="flex justify-end">
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{mode === "create"
									? "Create Enrollment Session"
									: "Save Changes"}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
