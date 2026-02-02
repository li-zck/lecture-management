import type { BulkCreateConfig } from "./types";

/**
 * Student bulk create configuration
 */
export const studentBulkConfig: BulkCreateConfig = {
	entityName: "Student",
	entityNamePlural: "Students",
	fields: [
		{
			name: "email",
			label: "Email",
			type: "email",
			required: true,
			placeholder: "student@example.com",
		},
		{
			name: "username",
			label: "Username",
			type: "text",
			required: true,
			placeholder: "student001",
		},
		{
			name: "password",
			label: "Password",
			type: "password",
			required: true,
			placeholder: "********",
			description: "Minimum 6 characters",
		},
		{
			name: "studentId",
			label: "Student ID",
			type: "text",
			required: false,
			placeholder: "STU001",
		},
		{
			name: "fullName",
			label: "Full Name",
			type: "text",
			required: false,
			placeholder: "John Doe",
		},
		{
			name: "gender",
			label: "Gender",
			type: "select",
			required: false,
			options: [
				{ value: "true", label: "Male" },
				{ value: "false", label: "Female" },
			],
		},
		{
			name: "birthDate",
			label: "Birth Date",
			type: "date",
			required: false,
			placeholder: "YYYY-MM-DD",
		},
		{
			name: "citizenId",
			label: "Citizen ID",
			type: "text",
			required: false,
			placeholder: "123456789",
		},
		{
			name: "phone",
			label: "Phone",
			type: "text",
			required: false,
			placeholder: "+1234567890",
		},
		{
			name: "address",
			label: "Address",
			type: "text",
			required: false,
			placeholder: "123 Main St",
		},
		{
			name: "departmentId",
			label: "Department ID",
			type: "text",
			required: false,
			placeholder: "dept-uuid",
			description: "UUID of the department",
		},
	],
	csvTemplate: [
		"email",
		"username",
		"password",
		"studentId",
		"fullName",
		"gender",
		"birthDate",
		"citizenId",
		"phone",
		"address",
		"departmentId",
	],
	exampleData: [
		{
			email: "john.doe@example.com",
			username: "johndoe",
			password: "password123",
			studentId: "STU001",
			fullName: "John Doe",
			gender: "true",
			birthDate: "2000-01-15",
			citizenId: "123456789",
			phone: "+1234567890",
			address: "123 Main St",
			departmentId: "",
		},
		{
			email: "jane.smith@example.com",
			username: "janesmith",
			password: "password456",
			studentId: "STU002",
			fullName: "Jane Smith",
			gender: "false",
			birthDate: "2001-03-20",
			citizenId: "987654321",
			phone: "+0987654321",
			address: "456 Oak Ave",
			departmentId: "",
		},
	],
};

/**
 * Lecturer bulk create configuration
 */
export const lecturerBulkConfig: BulkCreateConfig = {
	entityName: "Lecturer",
	entityNamePlural: "Lecturers",
	fields: [
		{
			name: "email",
			label: "Email",
			type: "email",
			required: true,
			placeholder: "lecturer@example.com",
		},
		{
			name: "username",
			label: "Username",
			type: "text",
			required: true,
			placeholder: "lecturer001",
		},
		{
			name: "password",
			label: "Password",
			type: "password",
			required: true,
			placeholder: "********",
			description: "Minimum 6 characters",
		},
		{
			name: "lecturerId",
			label: "Lecturer ID",
			type: "text",
			required: true,
			placeholder: "LEC001",
		},
		{
			name: "fullName",
			label: "Full Name",
			type: "text",
			required: false,
			placeholder: "Dr. John Doe",
		},
		{
			name: "departmentHeadId",
			label: "Department Head ID",
			type: "text",
			required: false,
			placeholder: "dept-uuid",
			description: "UUID of department if this lecturer is head",
		},
	],
	csvTemplate: [
		"email",
		"username",
		"password",
		"lecturerId",
		"fullName",
		"departmentHeadId",
	],
	exampleData: [
		{
			email: "dr.smith@example.com",
			username: "drsmith",
			password: "password123",
			lecturerId: "LEC001",
			fullName: "Dr. John Smith",
			departmentHeadId: "",
		},
		{
			email: "prof.jones@example.com",
			username: "profjones",
			password: "password456",
			lecturerId: "LEC002",
			fullName: "Prof. Mary Jones",
			departmentHeadId: "",
		},
	],
};

/**
 * Department bulk create configuration
 */
export const departmentBulkConfig: BulkCreateConfig = {
	entityName: "Department",
	entityNamePlural: "Departments",
	fields: [
		{
			name: "departmentId",
			label: "Department ID",
			type: "text",
			required: true,
			placeholder: "CS",
		},
		{
			name: "name",
			label: "Name",
			type: "text",
			required: true,
			placeholder: "Computer Science",
		},
		{
			name: "description",
			label: "Description",
			type: "text",
			required: false,
			placeholder: "Department description",
		},
		{
			name: "headId",
			label: "Head ID",
			type: "text",
			required: false,
			placeholder: "lecturer-uuid",
			description: "UUID of the department head (lecturer)",
		},
	],
	csvTemplate: ["departmentId", "name", "description", "headId"],
	exampleData: [
		{
			departmentId: "CS",
			name: "Computer Science",
			description: "Department of Computer Science and Engineering",
			headId: "",
		},
		{
			departmentId: "MATH",
			name: "Mathematics",
			description: "Department of Mathematics",
			headId: "",
		},
	],
};

/**
 * Get configuration by entity type
 */
export function getBulkCreateConfig(
	entityType: "student" | "lecturer" | "department",
): BulkCreateConfig {
	switch (entityType) {
		case "student":
			return studentBulkConfig;
		case "lecturer":
			return lecturerBulkConfig;
		case "department":
			return departmentBulkConfig;
		default:
			throw new Error(`Unknown entity type: ${entityType}`);
	}
}
