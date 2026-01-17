"use client";

import { useLecturers } from "@/components/ui/hooks/use-lecturer";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { createDepartmentSchema } from "@/lib/zod/schemas/create/department";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DepartmentFormValues = z.infer<typeof createDepartmentSchema>;

interface DepartmentFormProps {
    initialValues?: Partial<DepartmentFormValues>;
    onSubmit: (values: DepartmentFormValues) => Promise<void>;
    mode: "create" | "edit";
}

export function DepartmentForm({ initialValues, onSubmit, mode }: DepartmentFormProps) {
    const { lecturers, loading: loadingLecturers } = useLecturers();

    // Use same schema for edit for now.
    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(createDepartmentSchema),
        defaultValues: {
            departmentId: initialValues?.departmentId || "",
            name: initialValues?.name || "",
            description: initialValues?.description || "",
            headId: initialValues?.headId || undefined, // undefined for Select placeholder
            ...initialValues
        } as any,
    });

    const handleSubmit = async (values: DepartmentFormValues) => {
        await onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Software Engineering" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="SE" {...field} disabled={mode === 'edit'} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="headId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Head of Department (Optional)</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a lecturer" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {lecturers.map((lecturer) => (
                                        <SelectItem key={lecturer.id} value={lecturer.id}>
                                            {lecturer.fullName} ({lecturer.lecturerId})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the department..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {mode === "create" ? "Create Department" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
