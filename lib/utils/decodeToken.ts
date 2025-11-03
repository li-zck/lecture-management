import { jwtDecode } from "jwt-decode";
import type { AccessTokenPayload } from "../types/payload/auth/access-token";

export const decodeAccessToken = (
	accessToken: string | undefined,
): AccessTokenPayload | null => {
	if (!accessToken) {
		return null;
	}

	try {
		return jwtDecode<AccessTokenPayload>(accessToken);
	} catch (error) {
		console.error("Failed to decode access token:", error);

		return null;
	}
};

export const getUserRole = (accessToken: string | undefined): string | null => {
	const decodedToken = decodeAccessToken(accessToken);

	return decodedToken?.role ?? null;
};
