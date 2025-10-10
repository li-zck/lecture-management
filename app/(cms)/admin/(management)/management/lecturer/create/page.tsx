"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/shadcn/button";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { createLecturerSchema } from "@/lib/zod/schemas/create/account";
import Link from "next/link";
import { createLecturerAccount } from "@/lib/admin/api/create/method";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/utils";

type CreateLecturerFormData = z.infer<typeof createLecturerSchema>;

export default function LectureCreationPage() {
	const router = useRouter();

	const form = useForm<CreateLecturerFormData>({
		resolver: zodResolver(createLecturerSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			fullName: "",
		},
	});

	const onSubmit = async (values: CreateLecturerFormData) => {
		try {
			await createLecturerAccount(values);

			console.log("Creating lecturer:", values);

			toast.success("New lecturer created successfully");

			router.push(ROUTES.adminSite.management.lecturer);
		} catch (error: any) {
			if (error.message === "Authentication required") return;

			toast.error(error.message || "Failed to create lecturer");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="px-4 sm:px-6 w-full max-w-3xl">
				<div className="rounded-lg shadow p-6">
					<h1 className="text-2xl text-center font-bold mb-8">
						Create New Lecturer Account
					</h1>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
							</div>

							<div className="flex justify-end space-x-4">
								<Link href={`${ROUTES.adminSite.management.lecturer}`}>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</Link>

								<Button type="submit" onClick={() => onSubmit}>
									Create Lecturer
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
