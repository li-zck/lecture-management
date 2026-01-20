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
import { createSemesterSchema } from "@/lib/zod/schemas/create/semester";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SemesterFormValues = z.infer<typeof createSemesterSchema>;

interface SemesterFormProps {
    initialValues?: Partial<SemesterFormValues>;
    onSubmit: (values: SemesterFormValues) => Promise<void>;
    mode: "create" | "edit";
}

export function SemesterForm({ initialValues, onSubmit, mode }: SemesterFormProps) {
    const form = useForm<SemesterFormValues>({
        resolver: zodResolver(createSemesterSchema),
        defaultValues: {
            name: initialValues?.name || "",
            // Provide localized date string YYYY-MM-DD for Input type="date"
            startDate: initialValues?.startDate ? new Date(initialValues.startDate).toISOString().split('T')[0] : "",
            endDate: initialValues?.endDate ? new Date(initialValues.endDate).toISOString().split('T')[0] : "",
            ...initialValues
        } as any,
    });

    const handleSubmit = async (values: SemesterFormValues) => {
        // Validation ensures endDate > startDate
        await onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-2xl">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Semester Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Spring 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {mode === "create" ? "Create Semester" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
