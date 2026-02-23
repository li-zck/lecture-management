import { QueryProvider, ThemeProvider } from "@/components/provider";
import { SessionProvider } from "@/components/provider/SessionProvider";
import { SocketProvider } from "@/components/provider/SocketProvider";
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
          <SocketProvider>
            <TooltipProvider>
              <KeyboardShortcutProvider>
                <Toaster
                  className="pointer-events-auto"
                  closeButton={true}
                  position="top-center"
                />
                {children}
              </KeyboardShortcutProvider>
            </TooltipProvider>
          </SocketProvider>
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
