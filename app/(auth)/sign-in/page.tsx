"use client";

import Cookies from "js-cookie";
import { Suspense, useState } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import RoleSelector from "@/components/ui/RoleSelector";
import { signInLecturer, signInStudent } from "@/lib/auth";
import { signInLecturerSchema, signInStudentSchema } from "@/lib/zod";
import { Wordmark } from "@/components/ui";

const SignInPage = () => {
  const [role, setRole] = useState<"student" | "lecturer">("student");

  const schema =
    role === "student" ? signInStudentSchema : signInLecturerSchema;

  const fields = [
    {
      name: "username",
      label: "Username",
      placeholder: "Enter your username",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "********",
      type: "password",
    },
  ];

  const defaultValues = { username: "", password: "" };

  const onSubmit = async (values: any) => {
    const res =
      role === "student"
        ? await signInStudent(values)
        : await signInLecturer(values);

    Cookies.set("accessToken", res.data.token, {
      path: "/",
      expires: 365,
      secure: false,
      sameSite: "lax",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <Wordmark />
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
            onSubmitAction={onSubmit}
            defaultValues={defaultValues}
            redirectUrl={role === "student" ? "/student" : "/lecturer"}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
