"use client";

import { useFormPersistence, useLecturers } from "@/components/ui/hooks";
import { Button } from "@/components/ui/shadcn/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { createDepartment } from "@/lib/admin/api/create/method";
import { findEntityByDisplayId } from "@/lib/utils";
import { createDepartmentSchema } from "@/lib/zod/schemas/create/department";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;

export default function DepartmentCreationPage() {
	const router = useRouter();
	const { lecturers } = useLecturers();

	const form = useForm<CreateDepartmentFormData>({
		resolver: zodResolver(createDepartmentSchema),
		defaultValues: {
			departmentId: "",
			name: "",
			description: "",
			headId: "",
		},
	});

	const { clearSavedData } = useFormPersistence({
		form,
		storageKey: "department-create-form-data",
	});

	const onSubmit = async (values: CreateDepartmentFormData) => {
		try {
			const submitData = { ...values };

			if (values.headId) {
				const internalId = findEntityByDisplayId(
					values.headId,
					lecturers,
					"lecturer",
				);

				if (!internalId) {
					toast.error(`Lecturer with ID '${values.headId}' not found`);
					return;
				}

				submitData.headId = internalId;
			}

			await createDepartment(submitData);

			toast.success("New department created successfully");

			clearSavedData();

			router.back();
		} catch (error: any) {
			if (error.message === "Authentication required") return;

			toast.error(error.message || "Failed to create department");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="px-4 sm:px-6 w-full max-w-2xl">
				<div className="rounded-lg shadow p-6">
					<h1 className="text-2xl text-center font-bold mb-8">
						Create New Department
					</h1>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="departmentId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department ID</FormLabel>
										<FormControl>
											<Input placeholder="d1234" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department Name</FormLabel>
										<FormControl>
											<Input placeholder="Computer Science" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Department description..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="headId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department Head Lecturer ID</FormLabel>
										<FormControl>
											<Input placeholder="L001" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end space-x-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										clearSavedData();

										router.back();
									}}
								>
									Cancel
								</Button>

								<Button type="submit">Create Department</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
