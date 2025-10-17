"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { createStudentSchema } from "@/lib/zod/schemas/create/account";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/shadcn/select";
import { createStudentAccount } from "@/lib/admin/api/create/method";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/components/ui/hooks";

type CreateStudentFormData = z.infer<typeof createStudentSchema>;

export default function StudentCreationPage() {
	const router = useRouter();

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
			birthDate: new Date(),
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
			await createStudentAccount(values);

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
												<Input placeholder="01" {...field} />
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
									render={({ field }) => (
										<FormItem>
											<FormLabel>Birth Date</FormLabel>
											<FormControl>
												<Input
													type="date"
													{...field}
													value={
														field.value
															? field.value.toISOString().split("T")[0]
															: ""
													}
													onChange={(e) =>
														field.onChange(new Date(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
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
