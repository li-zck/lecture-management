"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DatePickerInput } from "@/components/ui/shadcn/date-picker-input";
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
import { Spinner } from "@/components/ui/shadcn/spinner";
import {
  getAdminById,
  getDepartmentById,
  getLecturerById,
  getStudentById,
} from "@/lib/admin/api/read/method";
import {
  updateAdminAccount,
  updateDepartment,
  updateLecturerAccount,
  updateStudentAccount,
} from "@/lib/admin/api/update/method";
import type {
  DepartmentResponse,
  LecturerAccountResponse,
  ReadAdminAccountResponse,
  StudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/read/read.dto";
import {
  updateAdminSchema,
  updateDepartmentSchema,
  updateLecturerSchema,
  updateStudentSchema,
} from "@/lib/zod/schemas/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;
type UpdateLecturerFormData = z.infer<typeof updateLecturerSchema>;
type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;

type UpdatePageProps = {
  entityType: "student" | "lecturer" | "department" | "admin";
  entityId: string;
};

export const UpdatePage = ({ entityType, entityId }: UpdatePageProps) => {
  const router = useRouter();
  const [entityData, setEntityData] = useState<
    | StudentAccountResponse
    | LecturerAccountResponse
    | DepartmentResponse
    | ReadAdminAccountResponse
    | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // initialize forms based on entity type
  const studentForm = useForm<UpdateStudentFormData>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {},
  });

  const lecturerForm = useForm<UpdateLecturerFormData>({
    resolver: zodResolver(updateLecturerSchema),
    defaultValues: {},
  });

  const departmentForm = useForm<UpdateDepartmentFormData>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {},
  });

  const adminForm = useForm<UpdateAdminFormData>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        setLoading(true);

        let response:
          | {
              data:
                | StudentAccountResponse
                | LecturerAccountResponse
                | DepartmentResponse
                | ReadAdminAccountResponse;
            }
          | undefined;

        switch (entityType) {
          case "student":
            response = await getStudentById(entityId);
            break;
          case "lecturer":
            response = await getLecturerById(entityId);
            break;
          case "department":
            response = await getDepartmentById(entityId);
            break;
          case "admin":
            response = await getAdminById(entityId);
            break;
        }

        if (response) {
          setEntityData(response.data);

          // set form default values based on entity type
          if (entityType === "student" && response.data) {
            const studentData = response.data as StudentAccountResponse;
            const birthDate =
              studentData.birthDate != null && studentData.birthDate !== ""
                ? studentData.birthDate.includes("T")
                  ? studentData.birthDate.split("T")[0]
                  : studentData.birthDate
                : "";

            studentForm.reset({
              studentId: studentData.studentId,
              departmentId: studentData.departmentId,
              username: studentData.username,
              email: studentData.email,
              fullName: studentData.fullName,
              gender: studentData.gender,
              birthDate,
              citizenId: studentData.citizenId,
              phone: studentData.phone,
              address: studentData.address,
              active: studentData.active,
            });
          } else if (entityType === "lecturer" && response.data) {
            const lecturerData = response.data as LecturerAccountResponse;
            lecturerForm.reset({
              lecturerId: lecturerData.lecturerId,
              username: lecturerData.username,
              email: lecturerData.email,
              fullName: lecturerData.fullName,
              active: lecturerData.active,
            });
          } else if (entityType === "department" && response.data) {
            const departmentData = response.data as DepartmentResponse;
            departmentForm.reset({
              departmentId: departmentData.departmentId,
              name: departmentData.name,
              description: departmentData.description,
              headId: departmentData.headId,
            });
          } else if (entityType === "admin" && response.data) {
            const adminData = response.data as ReadAdminAccountResponse;
            adminForm.reset({
              username: adminData.username,
              active: adminData.active,
            });
          }
        }
      } catch {
        toast.error("Failed to load entity data");
      } finally {
        setLoading(false);
      }
    };

    if (entityId) {
      fetchEntityData();
    }
  }, [
    entityType,
    entityId,
    studentForm,
    lecturerForm,
    departmentForm,
    adminForm,
  ]);

  const handleStudentSubmit = async (values: UpdateStudentFormData) => {
    try {
      setUpdating(true);

      await updateStudentAccount(values, entityId);

      toast.success("Student updated successfully");

      router.back();
    } catch (error: any) {
      toast.error(error.message || "Failed to update student");
    } finally {
      setUpdating(false);
    }
  };

  const handleLecturerSubmit = async (values: UpdateLecturerFormData) => {
    try {
      setUpdating(true);

      await updateLecturerAccount(values, entityId);

      toast.success("Lecturer updated successfully");

      router.back();
    } catch (error: any) {
      toast.error(error.message || "Failed to update lecturer");
    } finally {
      setUpdating(false);
    }
  };

  const handleDepartmentSubmit = async (values: UpdateDepartmentFormData) => {
    try {
      setUpdating(true);

      await updateDepartment(values, entityId);

      toast.success("Department updated successfully");

      router.back();
    } catch (error: any) {
      toast.error(error.message || "Failed to update department");
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminSubmit = async (values: UpdateAdminFormData) => {
    try {
      setUpdating(true);

      await updateAdminAccount(values, entityId);

      toast.success("Admin updated successfully");

      router.back();
    } catch (error: any) {
      toast.error(error.message || "Failed to update admin");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!entityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Entity Not Found</h1>
          <Button onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            className="mb-6"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold capitalize">Update {entityType}</h1>
          <p className="text-gray-600 mt-2">
            Edit the information below and save your changes.
          </p>
        </div>

        {entityType === "student" && (
          <StudentUpdateForm
            form={studentForm}
            onSubmit={handleStudentSubmit}
            onCancel={handleCancel}
            updating={updating}
          />
        )}

        {entityType === "lecturer" && (
          <LecturerUpdateForm
            form={lecturerForm}
            onSubmit={handleLecturerSubmit}
            onCancel={handleCancel}
            updating={updating}
          />
        )}

        {entityType === "department" && (
          <DepartmentUpdateForm
            form={departmentForm}
            onSubmit={handleDepartmentSubmit}
            onCancel={handleCancel}
            updating={updating}
          />
        )}

        {entityType === "admin" && (
          <AdminUpdateForm
            form={adminForm}
            onSubmit={handleAdminSubmit}
            onCancel={handleCancel}
            updating={updating}
          />
        )}
      </div>
    </div>
  );
};

// student update form
const StudentUpdateForm = ({
  form,
  onSubmit,
  onCancel,
  updating,
}: {
  form: any;
  onSubmit: (values: UpdateStudentFormData) => void;
  onCancel: () => void;
  updating: boolean;
}) => (
  <div className="rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-6">Student Information</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? "male" : "female"}
                    onValueChange={(value) => field.onChange(value === "male")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <DatePickerInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Select date"
                  />
                </FormControl>
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
                  <Input {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Status</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? "active" : "inactive"}
                    onValueChange={(value) =>
                      field.onChange(value === "active")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">
            Change Password (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? <Spinner /> : "Update Student"}
          </Button>
        </div>
      </form>
    </Form>
  </div>
);

// lecturer update form
const LecturerUpdateForm = ({
  form,
  onSubmit,
  onCancel,
  updating,
}: {
  form: any;
  onSubmit: (values: UpdateLecturerFormData) => void;
  onCancel: () => void;
  updating: boolean;
}) => (
  <div className="rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-6">Lecturer Information</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="lecturerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecturer ID</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Status</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? "active" : "inactive"}
                    onValueChange={(value) =>
                      field.onChange(value === "active")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">
            Change Password (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? <Spinner /> : "Update Lecturer"}
          </Button>
        </div>
      </form>
    </Form>
  </div>
);

// department update form
const DepartmentUpdateForm = ({
  form,
  onSubmit,
  onCancel,
  updating,
}: {
  form: any;
  onSubmit: (values: UpdateDepartmentFormData) => void;
  onCancel: () => void;
  updating: boolean;
}) => (
  <div className="rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-6">Department Information</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Head ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? <Spinner /> : "Update Department"}
          </Button>
        </div>
      </form>
    </Form>
  </div>
);

// admin update form
const AdminUpdateForm = ({
  form,
  onSubmit,
  onCancel,
  updating,
}: {
  form: any;
  onSubmit: (values: UpdateAdminFormData) => void;
  onCancel: () => void;
  updating: boolean;
}) => (
  <div className="rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-6">Admin Information</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Status</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? "active" : "inactive"}
                  onValueChange={(value) => field.onChange(value === "active")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">
            Change Password (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? <Spinner /> : "Update Admin"}
          </Button>
        </div>
      </form>
    </Form>
  </div>
);
