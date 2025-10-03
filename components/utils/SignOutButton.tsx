import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";
import { ROUTES } from "@/lib/utils";
import { Button } from "../ui";

const SignOutButton = () => {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			if (!Cookies.get("accessToken")) {
				console.log("Access token not found");
			}

			signOut();

			toast.success("Signed out successfully");

			router.push(ROUTES.signin);
		} catch {
			console.error("Something went wrong");

			toast.error("An unexpected error occurred while logging out.");
		}
	};

	return <Button onClick={() => handleLogout}>Sign out</Button>;
};

export default SignOutButton;
