"use client";

import { useDepartments, useFormPersistence } from "@/components/ui/hooks";
import {
	Button,
	Calendar,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/shadcn";
import { createStudentAccount } from "@/lib/admin/api/create/method";
import { findEntityByDisplayId, getDisplayId } from "@/lib/utils";
import { createStudentSchema } from "@/lib/zod/schemas/create/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type CreateStudentFormData = z.infer<typeof createStudentSchema>;

export default function StudentCreationPage() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { departments } = useDepartments();

	const form = useForm<CreateStudentFormData>({
		resolver: zodResolver(createStudentSchema),
		defaultValues: {
			departmentId: "",
			username: "",
			email: "",
			password: "",
			studentId: "",
			fullName: "",
			gender: true,
			birthDate: "",
			citizenId: "",
			phone: "",
			address: "",
		},
	});

	const { clearSavedData } = useFormPersistence({
		form,
		storageKey: "student-create-form-data",
		excludeFields: ["password"],
	});

	const onSubmit = async (values: CreateStudentFormData) => {
		try {
			let submitData = { ...values };

			if (values.departmentId) {
				const internalId = findEntityByDisplayId(
					values.departmentId,
					departments,
					"department",
				);

				if (!internalId) {
					toast.error(`Department with ID ${values.departmentId} not found`);

					return;
				}

				submitData.departmentId = internalId;
			}

			await createStudentAccount(submitData);

			console.log("Creating student:", values);

			toast.success("New student created successfully");

			clearSavedData();

			router.back();
		} catch (error: any) {
			if (error.message === "Authentication required") return;

			toast.error(error.message || "Failed to create student");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="px-4 sm:px-6 w-full max-w-3xl">
				<div className="rounded-lg shadow p-6">
					<h1 className="text-2xl text-center font-bold mb-8">
						Create New Student Account
					</h1>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="departmentId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Department ID</FormLabel>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={(value) => {
														// const selectedDept = departments.find(
														//   (dept) =>
														//     getDisplayId(dept, "department") === value,
														// );

														// field.onChange(
														//   selectedDept ? selectedDept.id : value,
														// );
														field.onChange(value);
													}}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select department" />
													</SelectTrigger>
													<SelectContent>
														{departments.map((dept) => (
															<SelectItem
																key={dept.id}
																value={getDisplayId(dept, "department")}
															>
																{dept.name} ({getDisplayId(dept, "department")})
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input placeholder="johndoe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="john@example.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="studentId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Student ID</FormLabel>
											<FormControl>
												<Input placeholder="ST123456" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="fullName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input placeholder="John Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="********"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Gender</FormLabel>
											<FormControl>
												<Select
													value={field.value ? "male" : "female"}
													onValueChange={(value) =>
														field.onChange(value === "male")
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>Gender</SelectLabel>
															<SelectItem value="male">Male</SelectItem>
															<SelectItem value="female">Female</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="birthDate"
									render={({ field }) => {
										const [date, setDate] = useState<Date | undefined>(
											field.value ? new Date(field.value) : undefined,
										);

										return (
											<FormItem>
												<FormLabel>Birth Date</FormLabel>
												<FormControl>
													<Popover open={open} onOpenChange={setOpen}>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																id="date"
																className="w-48 justify-between font-normal"
															>
																{date
																	? new Intl.DateTimeFormat("vi-VN", {
																			year: "numeric",
																			month: "long",
																			day: "numeric",
																		}).format(date)
																	: "Select date"}
																<ChevronDown />
															</Button>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto overflow-hidden p-0"
															align="start"
														>
															<Calendar
																mode="single"
																selected={date}
																captionLayout="dropdown"
																onSelect={(selectedDate) => {
																	setDate(selectedDate);
																	field.onChange(
																		selectedDate
																			? selectedDate.toLocaleDateString()
																			: "",
																	);
																	setOpen(false);
																}}
															/>
														</PopoverContent>
													</Popover>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>

								<FormField
									control={form.control}
									name="citizenId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Citizen ID</FormLabel>
											<FormControl>
												<Input placeholder="123456789012" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="08123456789"
													{...field}
													onChange={(e) => {
														const value = e.target.value.replace(/\D/g, "");
														field.onChange(value);
													}}
													onKeyDown={(e) => {
														if (
															e.key === "Backspace" ||
															e.key === "Delete" ||
															e.key === "Tab" ||
															e.key === "Escape" ||
															e.key === "Enter" ||
															e.key === "ArrowLeft" ||
															e.key === "ArrowRight" ||
															e.key === "ArrowUp" ||
															e.key === "ArrowDown"
														) {
															return;
														}

														if (!/[0-9]/.test(e.key)) {
															e.preventDefault();
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Address<p className="text-gray-400">(optional)</p>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Jl. Example No. 123, City"
												{...field}
											/>
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

								<Button type="submit">Create Student</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
