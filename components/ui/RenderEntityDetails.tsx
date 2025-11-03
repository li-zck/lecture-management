import type {
  DepartmentResponse,
  LecturerAccountResponse,
  StudentAccountResponse,
} from "@/lib/types/dto/api/admin/response/read/read.dto";

type RenderEntityDetailsProps = {
  entityType: "student" | "lecturer" | "department";
  data: StudentAccountResponse | LecturerAccountResponse | DepartmentResponse;
};

const Field = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean;
}) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-sm">{value}</span>
  </div>
);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatGender = (gender: boolean) => (gender ? "Male" : "Female");
const formatActive = (active: boolean) => (active ? "Active" : "Inactive");

export const RenderEntityDetails = ({
  entityType,
  data,
}: RenderEntityDetailsProps) => {
  if (entityType === "student") {
    const student = data as StudentAccountResponse;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Student ID" value={student.studentId} />
          <Field label="Full Name" value={student.fullName} />
          <Field label="Email" value={student.email} />
          <Field label="Username" value={student.username} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Gender" value={formatGender(student.gender)} />
          <Field label="Birth Date" value={formatDate(student.birthDate)} />
          <Field label="Citizen ID" value={student.citizenId} />
          <Field label="Phone" value={student.phone} />
          <Field label="Address" value={student.address} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Department ID" value={student.departmentId} />
          <Field label="Status" value={formatActive(student.active)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Created At" value={formatDate(student.createdAt)} />
          <Field label="Updated At" value={formatDate(student.updatedAt)} />
        </div>
      </div>
    );
  }

  if (entityType === "lecturer") {
    const lecturer = data as LecturerAccountResponse;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Lecturer ID" value={lecturer.id} />
          <Field label="Full Name" value={lecturer.fullName} />
          <Field label="Email" value={lecturer.email} />
          <Field label="Username" value={lecturer.username} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Status" value={formatActive(lecturer.active)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Created At" value={formatDate(lecturer.createdAt)} />
          <Field label="Updated At" value={formatDate(lecturer.updatedAt)} />
        </div>
      </div>
    );
  }

  if (entityType === "department") {
    const department = data as DepartmentResponse;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Department ID" value={department.id} />
          <Field label="Name" value={department.name} />
          <Field
            label="Description"
            value={department.description || "Not specified"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Department Head ID"
            value={department.headId || "Not assigned"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Created At" value={formatDate(department.createdAt)} />
          <Field label="Updated At" value={formatDate(department.updatedAt)} />
        </div>
      </div>
    );
  }

  return null;
};
