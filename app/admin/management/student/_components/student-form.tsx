"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
import { useFormPersistence } from "@/components/ui/hooks/use-form-persistence";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/shadcn";
import { Button } from "@/components/ui/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/shadcn/select";
import { createStudentSchema } from "@/lib/zod/schemas/create/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Enhance schema for 'edit' mode where password fields are optional
const editStudentSchema = createStudentSchema
	.omit({ password: true })
	.extend({
		username: z.string().min(1, "Username cannot be empty"),
		newPassword: z.string().optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(
		(data) => {
			// If newPassword is provided, confirmPassword must match
			if (data.newPassword && data.newPassword !== data.confirmPassword) {
				return false;
			}
			return true;
		},
		{
			message: "Passwords do not match",
			path: ["confirmPassword"],
		},
	);

type StudentFormValues =
	| z.infer<typeof createStudentSchema>
	| z.infer<typeof editStudentSchema>;

interface StudentFormProps {
	initialValues?: Partial<z.infer<typeof createStudentSchema>>;
	onSubmit: (values: any) => Promise<void>;
	mode: "create" | "edit";
}

export function StudentForm({
	initialValues,
	onSubmit,
	mode,
}: StudentFormProps) {
	const { departments } = useDepartments();

	// Use appropriate schema based on mode
	const schema = mode === "edit" ? editStudentSchema : createStudentSchema;

	const form = useForm<StudentFormValues>({
		resolver: zodResolver(schema) as any,
		defaultValues: {
			username: initialValues?.username ?? "",
			email: initialValues?.email ?? "",
			fullName: initialValues?.fullName ?? "",
			studentId: initialValues?.studentId ?? "",
			departmentId: initialValues?.departmentId ?? "",
			citizenId: initialValues?.citizenId ?? "",
			phone: initialValues?.phone ?? "",
			address: initialValues?.address ?? "",
			gender: initialValues?.gender ?? true,
			birthDate: initialValues?.birthDate ?? "",
			// Password fields differ based on mode
			...(mode === "create"
				? { password: "" }
				: { newPassword: "", confirmPassword: "" }),
		} as any,
	});

	// Persist form data across page reloads (only in create mode)
	const { clearPersistedData } = useFormPersistence({
		key: `student-form-${mode}`,
		form,
		exclude: ["password", "newPassword", "confirmPassword"], // Don't persist passwords
		enabled: mode === "create", // Only persist in create mode
	});

	const handleSubmit = async (values: StudentFormValues) => {
		await onSubmit(values);
		// Clear persisted data after successful submission
		if (typeof clearPersistedData === "function") {
			clearPersistedData();
		}
	};

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>
						{mode === "create"
							? "Create Student Account"
							: "Edit Student Account"}
					</CardTitle>
					<CardDescription>
						{mode === "create"
							? "Fill in the details below to create a new student account."
							: "Update the student information below."}
					</CardDescription>
				</CardHeader>
				<form
					id="create-student-form"
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-4"
				>
					<CardContent>
						<FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Controller
								control={form.control}
								name="fullName"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-fullName">
											Full Name
										</FieldLabel>
										<Input
											{...field}
											id="student-form-fullName"
											aria-invalid={fieldState.invalid}
											placeholder="John Doe"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="studentId"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-studentId">
											Student ID
										</FieldLabel>
										<Input
											{...field}
											id="student-form-studentId"
											aria-invalid={fieldState.invalid}
											placeholder="ST123"
											disabled={mode === "edit"}
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="email"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-email">Email</FieldLabel>
										<Input
											{...field}
											id="student-form-email"
											type="email"
											aria-invalid={fieldState.invalid}
											placeholder="a@example.com"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="username"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-username">
											Username
										</FieldLabel>
										<Input
											{...field}
											id="student-form-username"
											aria-invalid={fieldState.invalid}
											placeholder="username"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{mode === "create" ? (
								<Controller
									control={form.control}
									name="password"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="student-form-password">
												Password
											</FieldLabel>
											<Input
												{...field}
												id="student-form-password"
												type="password"
												aria-invalid={fieldState.invalid}
												placeholder="********"
												autoComplete="off"
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							) : (
								<>
									<Controller
										control={form.control}
										name="newPassword"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="student-form-newPassword">
													New Password (Leave blank to keep unchanged)
												</FieldLabel>
												<Input
													{...field}
													id="student-form-newPassword"
													type="password"
													aria-invalid={fieldState.invalid}
													placeholder="********"
													autoComplete="off"
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
									<Controller
										control={form.control}
										name="confirmPassword"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="student-form-confirmPassword">
													Confirm Password
												</FieldLabel>
												<Input
													{...field}
													id="student-form-confirmPassword"
													type="password"
													aria-invalid={fieldState.invalid}
													placeholder="********"
													autoComplete="off"
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
								</>
							)}

							<Controller
								control={form.control}
								name="departmentId"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-departmentId">
											Department
										</FieldLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											value={field.value}
										>
											<SelectTrigger id="student-form-departmentId">
												<SelectValue placeholder="Select a department" />
											</SelectTrigger>
											<SelectContent position="popper" sideOffset={5}>
												{departments.map((dept) => (
													<SelectItem key={dept.id} value={dept.id}>
														{dept.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="citizenId"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-citizenId">
											Citizen ID
										</FieldLabel>
										<Input
											{...field}
											id="student-form-citizenId"
											aria-invalid={fieldState.invalid}
											placeholder="123456789"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="phone"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-phone">Phone</FieldLabel>
										<Input
											{...field}
											id="student-form-phone"
											aria-invalid={fieldState.invalid}
											placeholder="+84..."
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="gender"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-gender">
											Gender
										</FieldLabel>
										<Select
											onValueChange={(value) =>
												field.onChange(value === "true")
											}
											value={field.value?.toString()}
											defaultValue={field.value?.toString()}
										>
											<SelectTrigger id="student-form-gender">
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
											<SelectContent position="popper" sideOffset={5}>
												<SelectItem value="true">Male</SelectItem>
												<SelectItem value="false">Female</SelectItem>
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="birthDate"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-birthDate">
											Birth Date (Optional)
										</FieldLabel>
										<Input
											{...field}
											id="student-form-birthDate"
											type="date"
											aria-invalid={fieldState.invalid}
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="address"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="student-form-address">
											Address (Optional)
										</FieldLabel>
										<Input
											{...field}
											id="student-form-address"
											aria-invalid={fieldState.invalid}
											placeholder="123 Street..."
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</CardContent>

					<CardFooter className="flex justify-end">
						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
							form="create-student-form"
						>
							{mode === "create" ? "Create Student" : "Save Changes"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
