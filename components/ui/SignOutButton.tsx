"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "../provider/SessionProvider";
import { Button } from "./shadcn/button";

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
