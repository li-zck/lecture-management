"use client";

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
import { createLecturerSchema } from "@/lib/zod/schemas/create/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const editLecturerSchema = createLecturerSchema.extend({
    password: z.string().optional(),
    username: z.string().min(1, "Username cannot be empty"),
});

type LecturerFormValues = z.infer<typeof createLecturerSchema>;

interface LecturerFormProps {
    initialValues?: Partial<LecturerFormValues>;
    onSubmit: (values: LecturerFormValues) => Promise<void>;
    mode: "create" | "edit";
}

export function LecturerForm({ initialValues, onSubmit, mode }: LecturerFormProps) {
    const schema = mode === "edit" ? editLecturerSchema : createLecturerSchema;

    const form = useForm<LecturerFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: initialValues?.username || "",
            email: initialValues?.email || "",
            password: "",
            fullName: initialValues?.fullName || "",
            lecturerId: initialValues?.lecturerId || "",
            ...initialValues
        } as any,
    });

    const handleSubmit = async (values: LecturerFormValues) => {
        await onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-2xl">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Dr. Nguyen Van B" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lecturerId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lecturer ID</FormLabel>
                            <FormControl>
                                <Input placeholder="GV123" {...field} disabled={mode === 'edit'} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="b@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
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
                            <FormLabel>Password {mode === 'edit' && '(Leave blank to keep unchanged)'}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {mode === "create" ? "Create Lecturer" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
