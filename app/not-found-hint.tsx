"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { signOut } from "@/lib/auth";
import { getUserRole } from "@/lib/utils";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function NotFoundHint() {
	return (
		<div>
			<NotFoundHintChild />
		</div>
	);
}

const NotFoundHintChild = () => {
	const router = useRouter();
	const [accessToken, setAccessToken] = useState<string | undefined>();
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const accessToken = Cookies.get("accessToken");

		setAccessToken(accessToken);
		setUserRole(accessToken ? getUserRole(accessToken) : null);
	}, []);

	if (accessToken === undefined || null) {
		return (
			<div className="flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	const handleSignOut = async () => {
		try {
			setIsLoading(true);
			signOut();

			toast.success("Signed out successfully");

			router.push("/");
		} catch (error) {
			toast.error("Failed to sign out");
		} finally {
			setIsLoading(false);
		}
	};

	if (!accessToken) {
		return (
			<Button asChild>
				<Link href="/">Return home</Link>
			</Button>
		);
	}

	return (
		<>
			<div className="font-bold mb-5">
				You're signed in as:
				<p>{userRole}</p>
			</div>

			<span>
				<Button onClick={handleSignOut} disabled={isLoading}>
					{isLoading ? "Signing out..." : "Sign out"}
				</Button>
			</span>
		</>
	);
};
