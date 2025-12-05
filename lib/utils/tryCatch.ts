type Result<T, E = Error> = readonly [T, null] | readonly [null, E];

type TryCatchOptions<E> = {
	onError?: (error: unknown) => E;
};

// Sync operations
export function tryCatch<T, E = Error>(
	operation: () => T,
	options?: TryCatchOptions<E>,
): Result<T, E>;

// Async operations
export function tryCatch<T, E = Error>(
	operation: () => Promise<T>,
	options?: TryCatchOptions<E>,
): Promise<Result<T, E>>;

export function tryCatch<T, E = Error>(
	operation: (() => T) | (() => Promise<T>),
	options: TryCatchOptions<E> = {},
): Result<T, E> | Promise<Result<T, E>> {
	const { onError } = options;

	const handleError = (error: unknown): E => {
		return onError ? onError(error) : (error as E);
	};

	const fn = operation;

	// Check if async function
	if (fn.constructor.name === "AsyncFunction") {
		return (async () => {
			try {
				const result = await (fn as () => Promise<T>)();
				return [result, null] as const;
			} catch (error) {
				return [null, handleError(error)] as const;
			}
		})();
	}

	// Sync function
	try {
		const result = (fn as () => T)();
		return [result, null] as const;
	} catch (error) {
		return [null, handleError(error)] as const;
	}
}

// For direct promises
export async function tryCatchAsync<T, E = Error>(
	promise: Promise<T>,
	options: TryCatchOptions<E> = {},
): Promise<Result<T, E>> {
	const { onError } = options;

	const handleError = (error: unknown): E => {
		return onError ? onError(error) : (error as E);
	};

	return promise
		.then((result) => [result, null] as const)
		.catch((error) => [null, handleError(error)] as const);
}
