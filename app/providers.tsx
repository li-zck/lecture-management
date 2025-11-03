import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/provider";
import { SessionProvider } from "@/components/provider/SessionProvider";
import { KeyboardShortcutProvider } from "@/components/ui";

export default function RootProviders({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<SessionProvider>
				<TooltipProvider>
					<KeyboardShortcutProvider>
						<Toaster className="pointer-events-auto" />
						{children}
					</KeyboardShortcutProvider>
				</TooltipProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}
