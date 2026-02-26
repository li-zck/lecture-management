/**
 * API Error utilities
 * Provides helper functions for extracting error information and logging
 */

export interface ApiErrorInfo {
  status: number;
  message: string;
  details?: unknown;
}

/**
 * Extract error information from an unknown error object
 * @param error - The error object (typically from a catch block)
 * @returns Normalized error info with status, message, and details
 */
export const getErrorInfo = (error: unknown): ApiErrorInfo => {
  if (typeof error === "object" && error !== null) {
    const err = error as {
      status?: number;
      message?: string;
      details?: unknown;
      response?: { data?: { message?: string }; status?: number };
    };

    // Handle API client errors (has status property directly)
    if (err.status !== undefined) {
      return {
        status: err.status,
        message: err.message || "An error occurred",
        details: err.details,
      };
    }

    // Handle axios-style errors (has response property)
    if (err.response) {
      return {
        status: err.response.status || 500,
        message:
          err.response.data?.message || err.message || "An error occurred",
        details: err.response.data,
      };
    }

    // Handle standard Error objects
    if (err.message) {
      return {
        status: 500,
        message: err.message,
        details: undefined,
      };
    }
  }

  return {
    status: 500,
    message: "An unexpected error occurred",
    details: undefined,
  };
};

/**
 * Parse NestJS/class-validator style validation errors into field-level errors.
 * Expects details like { message: string | string[] }.
 * Messages are typically "propertyName must be ..." or "propertyName is ...".
 */
export function parseValidationErrors(details: unknown): {
  field: string;
  message: string;
}[] {
  if (details == null || typeof details !== "object") return [];
  const d = details as { message?: string | string[] };
  const messages = d.message;
  if (!messages) return [];
  const list = Array.isArray(messages) ? messages : [messages];
  return list
    .filter((m): m is string => typeof m === "string" && m.length > 0)
    .map((m) => {
      const match = m.match(/^(\w+)\s+/);
      const field = match ? match[1] : "root";
      return { field, message: m };
    });
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Parse schedule conflict error message and return a human-readable description.
 * Backend formats:
 * - "Lecturer has a scheduling conflict on day X between Y and Z"
 * - "Lecturer with ID ... has a scheduling conflict on day X between Y and Z"
 * where X is 0-6 (day of week), Y and Z are minutes since midnight.
 */
export function formatScheduleConflictError(message: string): string {
  const match = message.match(
    /scheduling conflict on day (\d+) between (\d+) and (\d+)/i,
  );
  if (!match) return message;
  const [, dayStr, startStr, endStr] = match;
  const day = Number(dayStr);
  const start = Number(startStr);
  const end = Number(endStr);
  const dayName = DAY_NAMES[day] ?? `Day ${day}`;
  return `Schedule conflict: The lecturer already has a class on ${dayName} from ${formatMinutes(start)} to ${formatMinutes(end)}. Please choose a different time or day.`;
}

/**
 * Check if an error is a schedule conflict (409 or 400 with conflict message).
 */
export function isScheduleConflictError(error: unknown): boolean {
  const info = getErrorInfo(error);
  return (
    (info.status === 409 || info.status === 400) &&
    /scheduling conflict/i.test(info.message)
  );
}

/**
 * Log error details to console for debugging
 * @param error - The error object
 * @param context - Optional context string for where the error occurred
 */
export const logError = (error: unknown, context?: string): void => {
  const prefix = context ? `[${context}]` : "[API Error]";
  const errorInfo = getErrorInfo(error);

  console.error(`${prefix} Status: ${errorInfo.status}`, {
    message: errorInfo.message,
    details: errorInfo.details,
  });
};
