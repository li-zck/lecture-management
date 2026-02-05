"use client";

import { useCallback, useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/** Use sessionStorage so draft data is tab-scoped and doesn't leak to other forms/tabs */
const storage = typeof window !== "undefined" ? sessionStorage : null;

interface UseFormPersistenceOptions {
  /**
   * Unique key for this form (e.g. "department-create", "student-create").
   * Must be a non-empty string; otherwise persistence is disabled.
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
 * Persists form data to sessionStorage so it survives accidental refresh in the
 * same tab. Uses sessionStorage (not localStorage) so data is tab-scoped and
 * won't leak to other forms or tabs. Only use for create/draft forms; edit
 * forms should load from the server.
 *
 * @example
 * ```tsx
 * const form = useForm({ defaultValues: { name: "", email: "" } });
 *
 * const { clearPersistedData } = useFormPersistence({
 *   key: "student-create",
 *   form,
 *   exclude: ["password"],
 *   enabled: mode === "create",
 * });
 *
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
  const validKey = typeof key === "string" && key.trim() !== "";
  const effectiveEnabled = Boolean(storage && enabled && validKey);
  const storageKey = validKey ? `form-draft:${key.trim()}` : "";
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
   * Save form data to sessionStorage with debounce
   */
  const saveToStorage = useCallback(
    (values: FieldValues) => {
      if (!effectiveEnabled || !storageKey || isRestoringRef.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        try {
          if (!storage) return;
          const filteredValues = filterValues(values);
          const data = {
            values: filteredValues,
            timestamp: Date.now(),
          };
          storage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
          console.warn("[useFormPersistence] Failed to save form data:", error);
        }
      }, debounceMs);
    },
    [effectiveEnabled, storageKey, filterValues, debounceMs],
  );

  /**
   * Restore form data from sessionStorage
   */
  const restoreFromStorage = useCallback(() => {
    if (!effectiveEnabled || !storageKey || !storage) return null;

    try {
      const stored = storage.getItem(storageKey);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Discard after 24 hours (in case tab was left open)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > maxAge) {
        storage.removeItem(storageKey);
        return null;
      }

      return data.values;
    } catch (error) {
      console.warn("[useFormPersistence] Failed to restore form data:", error);
      return null;
    }
  }, [effectiveEnabled, storageKey]);

  /**
   * Clear persisted form data
   */
  const clearPersistedData = useCallback(() => {
    if (!storageKey || !storage) return;
    try {
      storage.removeItem(storageKey);
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
    if (!storageKey || !storage) return false;
    try {
      return storage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  }, [storageKey]);

  // Restore data on mount
  useEffect(() => {
    if (!effectiveEnabled) return;

    const savedValues = restoreFromStorage();
    if (savedValues) {
      isRestoringRef.current = true;

      const currentValues = form.getValues();
      const mergedValues = {
        ...currentValues,
        ...savedValues,
      };

      form.reset(mergedValues, {
        keepDefaultValues: false,
      });

      setTimeout(() => {
        isRestoringRef.current = false;
      }, 100);
    }
  }, [effectiveEnabled, form, restoreFromStorage]);

  // Subscribe to form changes and save
  useEffect(() => {
    if (!effectiveEnabled) return;

    const subscription = form.watch((values) => {
      saveToStorage(values);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [effectiveEnabled, form, saveToStorage]);

  return {
    clearPersistedData: effectiveEnabled ? clearPersistedData : noop,
    hasPersistedData: effectiveEnabled ? hasPersistedData : () => false,
    restoreFromStorage: effectiveEnabled ? restoreFromStorage : () => null,
  } as const;
}
