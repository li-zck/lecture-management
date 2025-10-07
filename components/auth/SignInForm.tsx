"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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

interface SignInField {
	name: string;
	label: string;
	placeholder: string;
	type?: string;
}

interface SignInFormProps {
	schema: z.ZodSchema<any>;
	fields: SignInField[];
	onSubmit: (values: FieldValues) => Promise<void>;
	defaultValues?: Record<string, any>;
}

export function SignInForm({
	schema,
	fields,
	onSubmit,
	defaultValues,
}: SignInFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const form = useForm<FieldValues>({
		resolver: zodResolver(schema as any),
		defaultValues,
	});

	const handleSubmit = async (values: any) => {
		try {
			await onSubmit(values);

			toast.success("Sign in successful!");
			router.push("/");
		} catch (error) {
			const msg =
				(error as { message?: string }).message ??
				"Sign in failed. Please try again.";

			toast.error(msg);
		}
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					{fields.map((field) => (
						<FormField
							key={field.name}
							control={form.control}
							name={field.name as any}
							render={({ field: formField }) => (
								<FormItem>
									<FormLabel>{field.label}</FormLabel>
									<FormControl>
										{field.type === "password" ? (
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													placeholder={field.placeholder}
													{...formField}
													className="pr-10"
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
												>
													{showPassword ? (
														<Eye className="h-5 w-5" />
													) : (
														<EyeClosed className="h-5 w-5" />
													)}
												</button>
											</div>
										) : (
											<Input placeholder={field.placeholder} {...formField} />
										)}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}

					<Button type="submit" className="w-full">
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
}
