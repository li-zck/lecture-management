"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, type FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Input } from "@/components/ui/shadcn/input";
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
  onSubmitAction: (values: FieldValues) => Promise<void>;
  defaultValues?: Record<string, any>;
  redirectUrl?: string;
};

export function SignInForm({
  schema,
  fields,
  onSubmitAction,
  defaultValues = {},
  redirectUrl = "/",
}: SignInFormProps) {
  const router = useRouter();

  // Ensure all fields have default values to prevent controlled/uncontrolled warning
  const mergedDefaults = fields.reduce((acc, field) => {
    acc[field.name] = defaultValues[field.name] ?? "";
    return acc;
  }, {} as Record<string, any>);

  const form = useForm<FieldValues>({
    resolver: zodResolver(schema as any),
    defaultValues: mergedDefaults,
  });

  const onSubmit = async (values: any) => {
    try {
      await onSubmitAction(values);

      toast.success("Sign in successful!");
      router.push(redirectUrl);
    } catch (error) {
      const msg =
        (error as { message?: string }).message ??
        "Sign in failed. Please try again.";

      toast.error(msg);
    }
  };

  return (
    <div className="grid">
      <Card className="w-full sm:max-w-md">
        <CardContent>
          <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {fields.map((fieldItem) => {
                return (
                  <Controller
                    key={fieldItem.name}
                    name={fieldItem.name}
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>{fieldItem.label}</FieldLabel>
                          <Input
                            {...field}
                            type={fieldItem.type || "text"}
                            aria-invalid={fieldState.invalid}
                            placeholder={fieldItem.name}
                            autoComplete="off"
                          />
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

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form={formId}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
