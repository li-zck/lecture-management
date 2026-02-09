"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { RoleSelector, Wordmark } from "@/components/ui";
import { Spinner } from "@/components/ui/shadcn";
import { signInLecturer, signInStudent } from "@/lib/auth";
import { signInLecturerSchema, signInStudentSchema } from "@/lib/zod";
import { BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { isLocale } from "@/lib/i18n/config";

export default function SignInPage() {
	const params = useParams();
	const lang = (params?.lang as string) || "en";
	const locale = isLocale(lang) ? lang : "en";
	const [role, setRole] = useState<"student" | "lecturer">("student");
	const [loginMethod, setLoginMethod] = useState<"id" | "username">("id");

	const schema =
		role === "student" ? signInStudentSchema : signInLecturerSchema;

	// Dynamic label based on role and login method
	const getIdentifierLabel = () => {
		if (loginMethod === "id") {
			return role === "student" ? "Student ID" : "Lecturer ID";
		}
		return "Username";
	};

	const getIdentifierPlaceholder = () => {
		if (loginMethod === "id") {
			return role === "student"
				? "Enter your student ID"
				: "Enter your lecturer ID";
		}
		return "Enter your username";
	};

	const fields = [
		{
			name: "identifier",
			label: getIdentifierLabel(),
			placeholder: getIdentifierPlaceholder(),
		},
		{
			name: "password",
			label: "Password",
			placeholder: "********",
			type: "password",
		},
	];

	// Default values include the loginMethod for form state tracking
	const defaultValues = {
		identifier: "",
		loginMethod:
			role === "student"
				? loginMethod === "id"
					? "studentId"
					: "username"
				: loginMethod === "id"
					? "lecturerId"
					: "username",
		password: "",
	} as const;

	const onSubmit = async (values: Record<string, unknown>) => {
		const { identifier, password } = values as {
			identifier: string;
			loginMethod: string;
			password: string;
		};
		// Construct the form data with the correct loginMethod based on current state
		const formData = {
			identifier,
			loginMethod:
				role === "student"
					? loginMethod === "id"
						? ("studentId" as const)
						: ("username" as const)
					: loginMethod === "id"
						? ("lecturerId" as const)
						: ("username" as const),
			password,
		};

		// The signInStudent/signInLecturer functions handle the transformation
		// from form data (identifier + loginMethod) to API format (studentId/lecturerId/username)
		const res =
			role === "student"
				? await signInStudent(formData)
				: await signInLecturer(formData);

		// Return the access token so SignInForm can use login() to update session state
		return res.data.accessToken;
	};

	const toggleLoginMethod = () => {
		setLoginMethod((prev) => (prev === "id" ? "username" : "id"));
	};

	return (
		<div className="min-h-screen flex relative overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20">
				{/* Floating shapes */}
				<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-float" />
				<div className="absolute top-40 right-10 w-72 h-72 bg-primary/15 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-float-delayed" />
				<div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-float" />
			</div>

			<div className="flex flex-col lg:flex-row w-full relative z-10">
				{/* Left Panel - Branding & Info */}
				<div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground relative overflow-hidden">
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-background/5 rounded-full -mr-32 -mt-32" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-background/5 rounded-full -ml-48 -mb-48" />

					<div className="relative z-10 max-w-md space-y-8">
						<div className="space-y-4">
							<div>
								<Wordmark />
							</div>

							<h1 className="text-4xl font-bold leading-tight tracking-tight">
								Welcome to Your Academic Portal
							</h1>
							<p className="text-lg text-primary-foreground/90 leading-relaxed">
								Access your courses, track progress, and connect with your
								academic community.
							</p>
						</div>

						<div className="space-y-4 pt-8">
							<div className="flex items-start space-x-3 p-4 rounded-lg bg-background/10 backdrop-blur-sm transition-all duration-300 hover:bg-background/15 hover:translate-x-1">
								<div className="bg-background/20 p-2 rounded-lg shadow-sm">
									<BookOpen className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-semibold text-lg">Course Management</h3>
									<p className="text-primary-foreground/80 text-sm leading-relaxed">
										Enroll, track, and manage all your courses in one place
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-3 p-4 rounded-lg bg-background/10 backdrop-blur-sm transition-all duration-300 hover:bg-background/15 hover:translate-x-1">
								<div className="bg-background/20 p-2 rounded-lg shadow-sm">
									<Users className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-semibold text-lg">Collaboration</h3>
									<p className="text-primary-foreground/80 text-sm leading-relaxed">
										Connect with lecturers and fellow students
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Panel - Sign In Form */}
				<div className="flex-1 flex items-center justify-center p-6 lg:p-12">
					<div className="w-full max-w-md space-y-8">
						{/* Mobile Logo */}
						<div className="lg:hidden flex justify-center">
							<div className="flex items-center space-x-3 transition-transform hover:scale-105 duration-300">
								<Wordmark />
							</div>
						</div>

						{/* Header */}
						<div className="space-y-3 text-center">
							<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
								Welcome Back
							</h2>
							<p className="text-muted-foreground text-sm md:text-base">
								{role === "student"
									? "Sign in to access your student dashboard"
									: "Sign in to access your lecturer dashboard"}
							</p>
						</div>

						{/* Role Selector */}
						<Suspense
							fallback={
								<div className="flex justify-center">
									<Spinner className="h-8 w-8 text-center" />
								</div>
							}
						>
							<RoleSelector value={role} onChange={setRole} />
						</Suspense>

						{/* Sign In Form */}
						<SignInForm
							key={`${role}-${loginMethod}`}
							schema={schema}
							fields={fields}
							onSubmitAction={onSubmit}
							defaultValues={defaultValues}
							redirectUrl={`/${locale}/my-courses`}
							role={role}
						/>

						{/* Login Method Toggle */}
						<div className="text-center">
							<button
								type="button"
								onClick={toggleLoginMethod}
								className="text-sm text-primary hover:underline font-medium transition-colors"
							>
								{loginMethod === "id"
									? "Sign in with username instead"
									: role === "student"
										? "Sign in with Student ID instead"
										: "Sign in with Lecturer ID instead"}
							</button>
						</div>

						{/* Help Text */}
						<div className="text-center text-sm text-muted-foreground">
							<p>
								Need help?{" "}
								<Link
									href="/support"
									className="text-primary hover:underline font-medium"
								>
									Contact support
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
