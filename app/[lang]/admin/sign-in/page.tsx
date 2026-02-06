"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Wordmark } from "@/components/ui";
import { Button } from "@/components/ui/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { authApi } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

export default function AdminSignInPage() {
	const router = useRouter();
	const { login } = useSession();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const response = await authApi.adminSignIn(values);
			login(response.accessToken);
			toast.success("Admin signed in successfully");
			router.push("/admin");
		} catch (error: unknown) {
			const err = error as { status?: number; message?: string };
			const status = err.status || 500;

			const messages: Record<number, string> = {
				400: "Please check your credentials and try again.",
				401: "Invalid username or password.",
				403: "Your account has been disabled. Contact support.",
				429: "Too many login attempts. Please wait and try again.",
			};

			toast.error(messages[status] || err.message || "Failed to sign in.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 gap-4">
			<Wordmark />
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl text-center">Admin Access</CardTitle>
					<CardDescription className="text-center">
						Sign in to manage the system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="admin" {...field} />
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
												placeholder="••••••••"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Sign In as Admin
							</Button>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link
							href="/admin/sign-up"
							className="text-primary hover:underline"
						>
							Sign Up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
