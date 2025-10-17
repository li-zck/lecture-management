export const hashToken = async (
	token: string,
	{ secret = false }: { secret?: boolean },
) => {
	if (!token || typeof token !== "string") {
		throw new Error("Token must be a non-empty string");
	}

	const encoder = new TextEncoder();

	if (secret && !process.env.AUTH_SECRET) {
		throw new Error(
			"AUTH_SECRET environment variable is required when secret option is enabled",
		);
	}

	const data = encoder.encode(
		`${token}${secret ? process.env.AUTH_SECRET : ""}`,
	);

	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
