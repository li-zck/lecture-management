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
import { signUpAdmin } from "@/lib/auth";
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
		},
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const onSubmit = async (values: SignUpFormData) => {
		try {
			await signUpAdmin(values);

			toast.success("Sign up successful!");

			window.location.href = "/admin/sign-in";
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<h2 className="text-center text-3xl font-extrabold">
					Create Your Account
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
															<p>You will use this to sign in</p>
														</TooltipContent>
													</Tooltip>
												</InputGroupAddon>
											</InputGroup>
											{/* <Input placeholder="johndoe" {...field} /> */}
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

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<div className="relative">
												<ButtonGroup className="w-full">
													<Input
														type={showConfirmPassword ? "text" : "password"}
														placeholder="********"
														{...field}
													/>
													<Button
														type="button"
														variant="outline"
														aria-label="Toggle confirm password visibility"
														onClick={() =>
															setShowConfirmPassword(!showConfirmPassword)
														}
													>
														{showConfirmPassword ? <Eye /> : <EyeClosed />}
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
						href="/admin/sign-in"
						className="font-medium text-indigo-600 hover:text-indigo-500"
						rel="preload"
					>
						sign in to existing account
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUpPage;
