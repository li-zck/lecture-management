"use client";

import { Input } from "@/components/ui/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, type FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useSession } from "../provider/SessionProvider";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/shadcn";

const formId = "sign-in-form";

type SignInField = {
	name: string;
	label: string;
	placeholder: string;
	type?: string;
};

type SignInFormProps = {
	schema: z.ZodSchema<any>;
	fields: SignInField[];
	onSubmitAction: (values: FieldValues) => Promise<string>; // Now returns the access token
	defaultValues?: Record<string, any>;
	redirectUrl?: string;
	role?: "student" | "lecturer";
};

export function SignInForm({
	schema,
	fields,
	onSubmitAction,
	defaultValues = {},
	redirectUrl = "/",
	role,
}: SignInFormProps) {
	const router = useRouter();
	const { login } = useSession();
	const [isLoading, setIsLoading] = useState(false);

	// Ensure all fields have default values, and also include any additional defaultValues (like hidden fields)
	const mergedDefaults = {
		// First, include all passed defaultValues (including hidden fields like loginMethod)
		...defaultValues,
		// Then ensure all visible fields have at least an empty string
		...fields.reduce(
			(acc, field) => {
				acc[field.name] = defaultValues[field.name] ?? "";
				return acc;
			},
			{} as Record<string, any>,
		),
	};

	const form = useForm<FieldValues>({
		resolver: zodResolver(schema as any),
		defaultValues: mergedDefaults,
	});

	const onSubmit = async (values: any) => {
		setIsLoading(true);
		try {
			const accessToken = await onSubmitAction(values);

			// Use the login function from SessionProvider to update state AND set cookie
			login(accessToken);

			toast.success("Welcome back! Redirecting...", {
				description: `Signed in as ${role || "user"}`,
			});
			router.push(redirectUrl);
		} catch (error) {
			const msg =
				(error as { message?: string }).message ??
				"Sign in failed. Please check your credentials.";

			toast.error("Authentication Failed", {
				description: msg,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const getFieldIcon = (fieldName: string) => {
		if (
			fieldName === "username" ||
			fieldName === "studentId" ||
			fieldName === "lecturerId" ||
			fieldName === "identifier"
		)
			return <User className="w-4 h-4 text-gray-500" />;
		if (fieldName === "password")
			return <Lock className="w-4 h-4 text-gray-500" />;
		return null;
	};

	return (
		<div className="w-full">
			<Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/95 transition-all duration-300">
				<CardContent className="pt-6 pb-6">
					<form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup className="space-y-4">
							{fields.map((fieldItem) => {
								return (
									<Controller
										key={fieldItem.name}
										name={fieldItem.name}
										control={form.control}
										render={({ field, fieldState }) => {
											return (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel className="text-sm font-medium text-foreground mb-1.5">
														{fieldItem.label}
													</FieldLabel>
													<div className="relative group">
														<div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-focus-within:text-primary">
															{getFieldIcon(fieldItem.name)}
														</div>
														<Input
															{...field}
															type={fieldItem.type || "text"}
															aria-invalid={fieldState.invalid}
															placeholder={fieldItem.placeholder}
															autoComplete={
																fieldItem.name === "password"
																	? "current-password"
																	: "off"
															}
															disabled={isLoading}
															className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed border-border/60 hover:border-border"
														/>
													</div>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											);
										}}
									/>
								);
							})}
						</FieldGroup>
					</form>
				</CardContent>

				<CardFooter className="flex-col gap-3 pb-2 border-t border-border/50">
					<Button
						type="submit"
						className="w-full h-11 font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
						form={formId}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing In...
							</>
						) : (
							<>
								Sign In
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
