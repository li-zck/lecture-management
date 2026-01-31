"use client";

import { useCallback, useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

interface UseFormPersistenceOptions {
  /**
   * Unique key for storing form data in localStorage
   */
  key: string;
  /**
   * React Hook Form instance
   */
  form: UseFormReturn<any>;
  /**
   * Fields to exclude from persistence (e.g., passwords)
   */
  exclude?: string[];
  /**
   * Debounce delay in milliseconds (default: 500ms)
   */
  debounceMs?: number;
  /**
   * Whether persistence is enabled (default: true)
   */
  enabled?: boolean;
}

/**
 * Custom hook to persist form data across page reloads
 *
 * @example
 * ```tsx
 * const form = useForm({ defaultValues: { name: "", email: "" } });
 *
 * const { clearPersistedData } = useFormPersistence({
 *   key: "create-student-form",
 *   form,
 *   exclude: ["password"],
 * });
 *
 * // Clear persisted data after successful submission
 * const onSubmit = async (values) => {
 *   await saveData(values);
 *   clearPersistedData();
 * };
 * ```
 */
export function useFormPersistence({
  key,
  form,
  exclude = [],
  debounceMs = 500,
  enabled = true,
}: UseFormPersistenceOptions) {
  const storageKey = `form-persist:${key}`;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  // No-op function for when persistence is disabled
  const noop = useCallback(() => {}, []);

  /**
   * Filter out excluded fields from form values
   */
  const filterValues = useCallback(
    (values: FieldValues): FieldValues => {
      const filtered = { ...values };
      for (const field of exclude) {
        delete filtered[field];
      }
      return filtered;
    },
    [exclude],
  );

  /**
   * Save form data to localStorage with debounce
   */
  const saveToStorage = useCallback(
    (values: FieldValues) => {
      if (!enabled || isRestoringRef.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        try {
          const filteredValues = filterValues(values);
          const data = {
            values: filteredValues,
            timestamp: Date.now(),
          };
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
          console.warn("[useFormPersistence] Failed to save form data:", error);
        }
      }, debounceMs);
    },
    [enabled, filterValues, storageKey, debounceMs],
  );

  /**
   * Restore form data from localStorage
   */
  const restoreFromStorage = useCallback(() => {
    if (!enabled) return null;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Check if data is older than 24 hours
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - data.timestamp > maxAge) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return data.values;
    } catch (error) {
      console.warn("[useFormPersistence] Failed to restore form data:", error);
      return null;
    }
  }, [enabled, storageKey]);

  /**
   * Clear persisted form data
   */
  const clearPersistedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn(
        "[useFormPersistence] Failed to clear persisted data:",
        error,
      );
    }
  }, [storageKey]);

  /**
   * Check if there is persisted data
   */
  const hasPersistedData = useCallback((): boolean => {
    try {
      return localStorage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  }, [storageKey]);

  // Restore data on mount
  useEffect(() => {
    if (!enabled) return;

    const savedValues = restoreFromStorage();
    if (savedValues) {
      isRestoringRef.current = true;

      // Reset form with saved values, preserving default values for excluded fields
      const currentValues = form.getValues();
      const mergedValues = {
        ...currentValues,
        ...savedValues,
      };

      form.reset(mergedValues, {
        keepDefaultValues: false,
      });

      // Small delay to prevent immediate re-save
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 100);
    }
  }, [enabled, form, restoreFromStorage]);

  // Subscribe to form changes and save
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((values) => {
      saveToStorage(values);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, form, saveToStorage]);

  // Always return stable function references
  // When disabled, return no-op functions to prevent runtime errors
  return {
    clearPersistedData: enabled ? clearPersistedData : noop,
    hasPersistedData: enabled ? hasPersistedData : () => false,
    restoreFromStorage: enabled ? restoreFromStorage : () => null,
  } as const;
}
