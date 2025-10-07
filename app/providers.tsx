import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { KeyboardShortcutProvider } from "@/components/ui";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/provider";
import { SessionProvider } from "@/components/provider/SessionProvider";

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
