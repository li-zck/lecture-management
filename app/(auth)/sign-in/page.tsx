"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { Suspense, useState } from "react";
import { signInLecturer, signInStudent } from "@/lib/auth";
import { signInLecturerSchema, signInStudentSchema } from "@/lib/zod";
import { SignInForm } from "@/components/auth/SignInForm";
import RoleSelector from "@/components/ui/RoleSelector";
import { Button } from "@/components/ui";

const SignInPage = () => {
	const [role, setRole] = useState<"student" | "lecturer">("student");

	const schema =
		role === "student" ? signInStudentSchema : signInLecturerSchema;

	const fields = [
		{
			name: role === "student" ? "studentId" : "lecturerId",
			label: role === "student" ? "Student ID" : "Lecturer ID",
			placeholder: "johndoe",
		},
		{
			name: "password",
			label: "Password",
			placeholder: "********",
			type: "password",
		},
	];

	const defaultValues =
		role === "student"
			? { studentId: "", password: "" }
			: { lecturerId: "", password: "" };

	const handleSubmit = async (values: any) => {
		const res =
			role === "student"
				? await signInStudent(values)
				: await signInLecturer(values);

		Cookies.set("accessToken", res.data.accessToken, {
			path: "/",
			expires: 365,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<Link href="/">
						<Button variant="outline">Logo</Button>
					</Link>
				</div>

				<div>
					<h2 className="mt-6 mb-3 text-center text-3xl font-extrabold">
						Welcome Back
					</h2>

					<Suspense fallback={<div>Loading...</div>}>
						<RoleSelector value={role} onChange={setRole} />
					</Suspense>

					<SignInForm
						schema={schema}
						fields={fields}
						onSubmit={handleSubmit}
						defaultValues={defaultValues}
					/>

					<div className="pt-4">
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
		</div>
	);
};

export default SignInPage;
