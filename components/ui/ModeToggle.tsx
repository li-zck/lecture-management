"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/shadcn/button";
import { useState, useEffect } from "react";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return null;
	}

	return (
		<div>
			{theme === "light" ? (
				<Button variant="outline" size="icon" onClick={() => setTheme("dark")}>
					<Moon className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			) : (
				<Button variant="outline" size="icon" onClick={() => setTheme("light")}>
					<Sun className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			)}
		</div>
	);
}
