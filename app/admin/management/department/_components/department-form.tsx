"use client";

import { useFormPersistence } from "@/components/ui/hooks/use-form-persistence";
import { useLecturers } from "@/components/ui/hooks/use-lecturer";
import { Field, FieldError, FieldLabel } from "@/components/ui/shadcn";
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
import { Textarea } from "@/components/ui/shadcn/textarea";
import { createDepartmentSchema } from "@/lib/zod/schemas/create/department";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type DepartmentFormValues = z.infer<typeof createDepartmentSchema>;

interface DepartmentFormProps {
	initialValues?: Partial<DepartmentFormValues>;
	onSubmit: (values: DepartmentFormValues) => Promise<void>;
	mode: "create" | "edit";
}

export function DepartmentForm({
	initialValues,
	onSubmit,
	mode,
}: DepartmentFormProps) {
	const { lecturers } = useLecturers();

	const form = useForm<DepartmentFormValues>({
		resolver: zodResolver(createDepartmentSchema),
		defaultValues: {
			departmentId: initialValues?.departmentId ?? "",
			name: initialValues?.name ?? "",
			description: initialValues?.description ?? "",
			headId: initialValues?.headId ?? "none",
		} as any,
	});

	// Persist form data across page reloads (only in create mode)
	const { clearPersistedData } = useFormPersistence({
		key: `department-form-${mode}`,
		form,
		enabled: mode === "create",
	});

	const handleSubmit = async (values: DepartmentFormValues) => {
		await onSubmit(values);
		if (typeof clearPersistedData === "function") {
			clearPersistedData();
		}
	};

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>
						{mode === "create" ? "Create Department" : "Edit Department"}
					</CardTitle>
					<CardDescription>
						{mode === "create"
							? "Fill in the details below to create a new department."
							: "Update the department information below."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Controller
								control={form.control}
								name="name"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="department-form-name">
											Department Name
										</FieldLabel>
										<Input
											{...field}
											id="department-form-name"
											aria-invalid={fieldState.invalid}
											placeholder="Software Engineering"
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
								name="departmentId"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="department-form-id">
											Department ID
										</FieldLabel>
										<Input
											{...field}
											id="department-form-id"
											aria-invalid={fieldState.invalid}
											placeholder="SE"
											disabled={mode === "edit"}
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						<Controller
							control={form.control}
							name="headId"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="department-form-headId">
										Head of Department (Optional)
									</FieldLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
									>
										<SelectTrigger id="department-form-headId">
											<SelectValue placeholder="Select a lecturer" />
										</SelectTrigger>
										<SelectContent position="popper" sideOffset={5}>
											<SelectItem value="none">None</SelectItem>
											{lecturers.map((lecturer) => (
												<SelectItem key={lecturer.id} value={lecturer.id}>
													{lecturer.fullName} ({lecturer.lecturerId})
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
							name="description"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="department-form-description">
										Description
									</FieldLabel>
									<Textarea
										{...field}
										id="department-form-description"
										aria-invalid={fieldState.invalid}
										placeholder="Describe the department..."
										className="resize-none min-h-[120px]"
										autoComplete="off"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</form>
				</CardContent>
				<CardFooter className="flex justify-end">
					<Button
						type="button"
						disabled={form.formState.isSubmitting}
						onClick={form.handleSubmit(handleSubmit as any)}
					>
						{mode === "create" ? "Create Department" : "Save Changes"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
