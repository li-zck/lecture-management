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
import { createStudentSchema } from "@/lib/zod/schemas/create/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Enhance schema for 'edit' mode where password is optional
const editStudentSchema = createStudentSchema.extend({
    password: z.string().optional(),
    username: z.string().min(1, "Username cannot be empty"),
    // Re-declare to ensure it overrides if needed, though 'create' schema has it.
});

type StudentFormValues = z.infer<typeof createStudentSchema>;

interface StudentFormProps {
    initialValues?: Partial<StudentFormValues>;
    onSubmit: (values: StudentFormValues) => Promise<void>;
    mode: "create" | "edit";
}

export function StudentForm({ initialValues, onSubmit, mode }: StudentFormProps) {
    const { departments, loading: loadingDepartments } = useDepartments();

    // Use appropriate schema based on mode
    const schema = mode === "edit" ? editStudentSchema : createStudentSchema;

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: initialValues?.username || "",
            email: initialValues?.email || "",
            password: "", // Always empty for password
            fullName: initialValues?.fullName || "",
            studentId: initialValues?.studentId || "",
            departmentId: initialValues?.departmentId || "",
            citizenId: initialValues?.citizenId || "",
            phone: initialValues?.phone || "",
            address: initialValues?.address || "",
            ...initialValues
        } as any,
    });

    const handleSubmit = async (values: StudentFormValues) => {
        await onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nguyen Van A" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="ST123" {...field} disabled={mode === 'edit'} />
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
                                    <Input placeholder="a@example.com" type="email" {...field} />
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
                        name="citizenId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Citizen ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="+84..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Street..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {mode === "create" ? "Create Student" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
