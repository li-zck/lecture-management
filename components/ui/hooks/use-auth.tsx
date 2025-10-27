"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = Cookies.get("accessToken");

		setIsAuthenticated(!!token);
	}, []);

	return isAuthenticated;
};
