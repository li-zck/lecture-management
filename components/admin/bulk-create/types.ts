/**
 * Field definition for bulk create forms
 */
export interface BulkCreateField {
	name: string;
	label: string;
	type:
		| "text"
		| "email"
		| "password"
		| "number"
		| "date"
		| "boolean"
		| "select";
	required: boolean;
	placeholder?: string;
	description?: string;
	options?: { value: string; label: string }[];
	defaultValue?: string | number | boolean;
}

/**
 * Entity configuration for bulk creation
 */
export interface BulkCreateConfig {
	entityName: string;
	entityNamePlural: string;
	fields: BulkCreateField[];
	csvTemplate: string[];
	exampleData: Record<string, unknown>[];
}

/**
 * Parsed row from CSV or paste
 */
export type ParsedRow = Record<string, string | number | boolean | null>;

/**
 * Validation error for a row
 */
export interface RowValidationError {
	rowIndex: number;
	field: string;
	message: string;
}

/**
 * Bulk create result
 */
export interface BulkCreateResult {
	success: boolean;
	created: number;
	errors?: string[];
}
