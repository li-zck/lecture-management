"use client";

import { signOut } from "@/lib/auth";
import type { AccessTokenPayload } from "@/lib/types/payload/auth/access-token";
import { decodeAccessToken } from "@/lib/utils/decodeToken";
import Cookies from "js-cookie";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type SessionContextType = {
	isAuthenticated: boolean;
	user: AccessTokenPayload | null;
	role: string | undefined;
	login: (token: string) => void;
	logout: () => void;
	isLoading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<AccessTokenPayload | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const logout = useCallback(() => {
		signOut();

		setIsAuthenticated(false);
		setUser(null);
	}, []);

	const updateSession = useCallback(
		(token: string | undefined) => {
			if (token) {
				const decoded = decodeAccessToken(token);

				if (decoded) {
					setIsAuthenticated(true);
					setUser(decoded);
				} else {
					logout();
				}
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
			setIsLoading(false);
		},
		[logout],
	);

	const login = useCallback(
		(token: string) => {
			Cookies.set("accessToken", token, {
				path: "/",
				expires: 365,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});

			updateSession(token);
		},
		[updateSession],
	);

	useEffect(() => {
		const token = Cookies.get("accessToken");

		updateSession(token);

		const handleStorageChange = () => {
			const newToken = Cookies.get("accessToken");

			updateSession(newToken);
		};

		window.addEventListener("storage", handleStorageChange);

		return () => window.removeEventListener("storage", handleStorageChange);
	}, [updateSession]);

	const value: SessionContextType = {
		isAuthenticated,
		user,
		role: user?.role,
		login,
		logout,
		isLoading,
	};

	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);

	if (context === undefined) {
		throw new Error("useSession must be used within a SessionProvider");
	}

	return context;
};
