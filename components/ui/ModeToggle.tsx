"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("dark")}
          aria-label="Switch to dark mode"
        >
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("light")}
          aria-label="Switch to light mode"
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      )}
    </div>
  );
}
