"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInAdmin } from "@/lib/auth";
import { signInSchema } from "@/lib/zod";
import RoleSelector from "@/components/utils/RoleSelector";

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
	const form = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = async (values: SignInFormData) => {
		try {
			const res = await signInAdmin(values);

			if ("data" in res) {
				if (res.status !== 200) {
					toast.error("Sign in failed. Please try again.");

					return;
				}

				Cookies.set("accessToken", res.data.accessToken, {
					expires: 365,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
				});

				toast.success("Sign in successful!");

				router.push("/");

				return;
			}

			const msg = res.error.message ?? "Sign in failed. Please try again.";

			toast.error(msg);
		} catch (error) {
			const msg =
				(error as { message?: string }).message ??
				"Unexpected error. Please try again.";

			toast.error(msg);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 mb-6 text-center text-3xl font-extrabold">
						Welcome Back
					</h2>

					<RoleSelector />

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="********"
													{...field}
													className="pr-10"
												/>
												<button
													type="button"
													onClick={() => {
														setShowPassword(!showPassword);
													}}
													className="absolute inset-y-0 right-0 p-2 flex items-center text-gray-400 hover:text-gray-600"
												>
													{showPassword ? (
														<Eye className="h-5 w-5" />
													) : (
														<EyeClosed className="h-5 w-5" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit">Submit</Button>
						</form>
					</Form>

					<p className="text-center">
						Or{" "}
						<Link
							href="/sign-up"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							create a new account
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;
