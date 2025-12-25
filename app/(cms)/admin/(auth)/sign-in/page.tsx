"use client";

import { Wordmark } from "@/components/ui";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/components/ui/shadcn";
import { signInAdmin } from "@/lib/auth";
import { ROUTES } from "@/lib/utils";
import { signInAdminSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const formId = "sign-in-form-admin";

type SignInAdminSchema = z.infer<typeof signInAdminSchema>;

export default function SignInPage() {
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
    <div className="min-h-screen flex flex-col gap-7 items-center justify-center">
      <Wordmark />

      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="johndoe@gmail.com"
                        autoComplete="off"
                        type="text"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <span className="flex items-center justify-between">
                        <FieldLabel>Password</FieldLabel>
                        <Link
                          href={ROUTES.mainSite.home}
                          className="text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </span>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="********"
                        autoComplete="off"
                        type="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form={formId}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
