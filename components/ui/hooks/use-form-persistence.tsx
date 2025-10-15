"use client";

import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface UseFormPersistenceOptions<T extends FieldValues> {
	form: UseFormReturn<T>;
	storageKey: string;
	excludeFields?: (keyof T)[];
}

export function useFormPersistence<T extends FieldValues>({
	form,
	storageKey,
	excludeFields = [],
}: UseFormPersistenceOptions<T>) {
	useEffect(() => {
		const savedData = localStorage.getItem(storageKey);

		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);

				// set each field individually to avoid type issues
				Object.keys(parsedData).forEach((key) => {
					if (!excludeFields.includes(key as keyof T)) {
						form.setValue(key as any, parsedData[key]);
					}
				});
			} catch (_error) {
				console.warn(`Failed to parse saved form data for ${storageKey}`);
			}
		}
	}, [form, storageKey, excludeFields]);

	// save form data whenever it changes
	useEffect(() => {
		const subscription = form.watch((data) => {
			const dataToSave = Object.keys(data).reduce(
				(acc, key) => {
					if (!excludeFields.includes(key as keyof T)) {
						(acc as any)[key] = (data as any)[key];
					}
					return acc;
				},
				{} as Record<string, any>,
			);

			localStorage.setItem(storageKey, JSON.stringify(dataToSave));
		});

		return () => subscription.unsubscribe();
	}, [form, storageKey, excludeFields]);

	const clearSavedData = () => {
		localStorage.removeItem(storageKey);
	};

	return { clearSavedData: clearSavedData };
}
