import { QueryProvider, ThemeProvider } from "@/components/provider";
import { SessionProvider } from "@/components/provider/SessionProvider";
import { KeyboardShortcutProvider } from "@/components/ui";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function RootProviders({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			<QueryProvider>
				<SessionProvider>
					<TooltipProvider>
						<KeyboardShortcutProvider>
							<Toaster className="pointer-events-auto" />
							{children}
						</KeyboardShortcutProvider>
					</TooltipProvider>
				</SessionProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}
