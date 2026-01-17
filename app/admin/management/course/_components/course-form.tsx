"use client";

import { useDepartments } from "@/components/ui/hooks/use-department";
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
import { createCourseSchema } from "@/lib/zod/schemas/create/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CourseFormValues = z.infer<typeof createCourseSchema>;

interface CourseFormProps {
    initialValues?: Partial<CourseFormValues>;
    onSubmit: (values: CourseFormValues) => Promise<void>;
    mode: "create" | "edit";
}

export function CourseForm({ initialValues, onSubmit, mode }: CourseFormProps) {
    const { departments, loading: loadingDepartments } = useDepartments();

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            name: initialValues?.name || "",
            credits: initialValues?.credits || 3,
            departmentId: initialValues?.departmentId || undefined,
            semester: initialValues?.semester || "1",
            description: initialValues?.description || "",
            ...initialValues
        } as any,
    });

    const handleSubmit = async (values: CourseFormValues) => {
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
                            <FormLabel>Course Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Calculus I" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="credits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Credits</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="3"
                                        {...field}
                                        min={1}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="semester"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recommended Semester/Level</FormLabel>
                                <FormControl>
                                    <Input placeholder="1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                            {dept.name}
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
                                    placeholder="Describe the course..."
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
                        {mode === "create" ? "Create Course" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
