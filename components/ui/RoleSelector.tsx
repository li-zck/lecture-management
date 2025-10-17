import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { Button } from "./shadcn/button";
import { z } from "zod";
import { roleQuerySchema } from "@/lib/zod/schemas/navigation";

export type Role = "student" | "lecturer";

export type Props = {
	value: Role;
	onChange: (next: Role) => void;
};

export type RoleQuerySchema = z.infer<typeof roleQuerySchema>;

const RoleSelector = ({ value, onChange }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setRole = useCallback(
		(nextRole: "student" | "lecturer") => {
			onChange(nextRole);

			const params = new URLSearchParams(searchParams.toString());

			params.set("role", nextRole);

			const query = params.toString();
			const url = query ? `${pathname}?${query}` : pathname;

			router.replace(url, { scroll: false });
		},
		[router, pathname, searchParams],
	);

	return (
		<div className="text-center">
			<h1 className="text-lg pb-2">Sign in as:</h1>

			<div className="space-x-4 pb-4">
				<Button
					variant={value === "student" ? "default" : "outline"}
					onClick={() => setRole("student")}
				>
					Student
				</Button>

				<Button
					variant={value === "lecturer" ? "default" : "outline"}
					onClick={() => setRole("lecturer")}
				>
					Lecturer
				</Button>
			</div>
		</div>
	);
};

export default RoleSelector;
