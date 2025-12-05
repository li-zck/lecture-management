"use client";

import { Button } from "@/components/ui/shadcn/button";
import { ButtonGroup } from "@/components/ui/shadcn/button-group";
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
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/shadcn/input-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import { signInAdmin } from "@/lib/auth";
import { signInAdminSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Eye, EyeClosed, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SignInAdminSchema = z.infer<typeof signInAdminSchema>;

const SignInPage = () => {
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<SignInAdminSchema>({
		resolver: zodResolver(signInAdminSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (values: SignInAdminSchema) => {
		try {
			const res = await signInAdmin(values);

			Cookies.set("accessToken", res.data.accessToken, {
				path: "/",
				expires: 365,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});

			toast.success("Sign in successful!");

			window.location.href = "/admin";
		} catch (error: any) {
			if (error.status === 401) {
				toast.error("Invalid username or password");

				return;
			}

			toast.error("Failed to sign in. Please try again");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<h2 className="mt-6 mb-6 text-center text-3xl font-extrabold">
					Welcome Back
				</h2>
				<div className="flex justify-center">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<InputGroup className="w-full">
												<InputGroupInput placeholder="johndoe" {...field} />
												<InputGroupAddon align="inline-end">
													<Tooltip>
														<TooltipTrigger asChild>
															<InputGroupButton
																variant="ghost"
																aria-label="Help"
																size="icon-xs"
															>
																<HelpCircle />
															</InputGroupButton>
														</TooltipTrigger>
														<TooltipContent>
															<p>This is your username</p>
														</TooltipContent>
													</Tooltip>
												</InputGroupAddon>
											</InputGroup>
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
												<ButtonGroup className="w-full">
													<Input
														type={showPassword ? "text" : "password"}
														placeholder="********"
														{...field}
													/>
													<Button
														type="button"
														variant="outline"
														aria-label="Toggle password visibility"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? <Eye /> : <EyeClosed />}
													</Button>
												</ButtonGroup>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-center">
								<Button type="submit">Submit</Button>
							</div>
						</form>
					</Form>
				</div>

				<p className="text-center mt-7">
					Or{" "}
					<Link
						href="/admin/sign-up"
						className="font-medium text-indigo-600 hover:text-indigo-500"
						rel="preload"
					>
						create a new account
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignInPage;
