import Papa from "papaparse";
import type { BulkCreateConfig, ParsedRow, RowValidationError } from "./types";

/**
 * Parse CSV or TSV content using Papa Parse
 */
export function parseContent(content: string): {
	headers: string[];
	data: ParsedRow[];
} {
	const result = Papa.parse<Record<string, string>>(content, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (header) => header.trim(),
		transform: (value) => value.trim(),
	});

	if (result.errors.length > 0) {
		console.warn("Parse warnings:", result.errors);
	}

	const headers = result.meta.fields || [];
	const data: ParsedRow[] = result.data.map((row) => {
		const parsed: ParsedRow = {};
		for (const key of headers) {
			const value = row[key];
			parsed[key] = value === "" ? null : value;
		}
		return parsed;
	});

	return { headers, data };
}

/**
 * Parse a File object (CSV)
 */
export function parseFile(
	file: File,
): Promise<{ headers: string[]; data: ParsedRow[] }> {
	return new Promise((resolve, reject) => {
		Papa.parse<Record<string, string>>(file, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header) => header.trim(),
			transform: (value) => value.trim(),
			complete: (result) => {
				if (result.errors.length > 0) {
					console.warn("Parse warnings:", result.errors);
				}

				const headers = result.meta.fields || [];
				const data: ParsedRow[] = result.data.map((row) => {
					const parsed: ParsedRow = {};
					for (const key of headers) {
						const value = row[key];
						parsed[key] = value === "" ? null : value;
					}
					return parsed;
				});

				resolve({ headers, data });
			},
			error: (error) => {
				reject(new Error(error.message));
			},
		});
	});
}

/**
 * Validate a row against the config
 */
export function validateRow(
	row: ParsedRow,
	rowIndex: number,
	config: BulkCreateConfig,
): RowValidationError[] {
	const errors: RowValidationError[] = [];

	for (const field of config.fields) {
		const value = row[field.name];

		// Check required fields
		if (field.required && (value === null || value === "")) {
			errors.push({
				rowIndex,
				field: field.name,
				message: `${field.label} is required`,
			});
			continue;
		}

		// Skip validation for empty optional fields
		if (value === null || value === "") {
			continue;
		}

		// Type-specific validation
		switch (field.type) {
			case "email":
				if (
					typeof value === "string" &&
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
				) {
					errors.push({
						rowIndex,
						field: field.name,
						message: `${field.label} must be a valid email`,
					});
				}
				break;

			case "date":
				if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
					errors.push({
						rowIndex,
						field: field.name,
						message: `${field.label} must be in YYYY-MM-DD format`,
					});
				}
				break;

			case "boolean":
				if (
					!["true", "false", "1", "0", "yes", "no"].includes(
						String(value).toLowerCase(),
					)
				) {
					errors.push({
						rowIndex,
						field: field.name,
						message: `${field.label} must be true/false or yes/no`,
					});
				}
				break;

			case "password":
				if (typeof value === "string" && value.length < 6) {
					errors.push({
						rowIndex,
						field: field.name,
						message: `${field.label} must be at least 6 characters`,
					});
				}
				break;
		}
	}

	return errors;
}

/**
 * Validate all rows
 */
export function validateData(
	data: ParsedRow[],
	config: BulkCreateConfig,
): RowValidationError[] {
	const errors: RowValidationError[] = [];

	data.forEach((row, index) => {
		errors.push(...validateRow(row, index, config));
	});

	return errors;
}

/**
 * Transform parsed data to API format
 */
export function transformToApiFormat(
	data: ParsedRow[],
	config: BulkCreateConfig,
): Record<string, unknown>[] {
	return data.map((row) => {
		const transformed: Record<string, unknown> = {};

		for (const field of config.fields) {
			const value = row[field.name];

			// Skip empty values
			if (value === null || value === "") {
				continue;
			}

			// Transform based on type
			switch (field.type) {
				case "boolean":
					transformed[field.name] = ["true", "1", "yes"].includes(
						String(value).toLowerCase(),
					);
					break;

				case "number":
					transformed[field.name] = Number(value);
					break;

				default:
					transformed[field.name] = value;
			}
		}

		return transformed;
	});
}

/**
 * Generate CSV template content using Papa Parse
 */
export function generateCSVTemplate(config: BulkCreateConfig): string {
	const data = config.exampleData.map((row) => {
		const csvRow: Record<string, unknown> = {};
		for (const col of config.csvTemplate) {
			csvRow[col] = row[col] ?? "";
		}
		return csvRow;
	});

	return Papa.unparse(data, {
		columns: config.csvTemplate,
	});
}

/**
 * Download CSV template
 */
export function downloadCSVTemplate(config: BulkCreateConfig): void {
	const content = generateCSVTemplate(config);
	const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${config.entityNamePlural.toLowerCase()}_template.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
