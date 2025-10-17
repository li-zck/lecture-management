"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "./shadcn/button";
import { useSession } from "../provider/SessionProvider";

const SignOutButton = () => {
	const router = useRouter();
	const { logout } = useSession();

	const handleLogout = async () => {
		try {
			if (!Cookies.get("accessToken")) {
				console.log("Access token not found");
			}

			logout();

			toast.success("Signed out successfully");

			router.push("/");
		} catch {
			console.error("Something went wrong");

			toast.error("An unexpected error occurred while logging out.");
		}
	};

	return <Button onClick={handleLogout}>Sign out</Button>;
};

export default SignOutButton;
