import { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/provider/ThemeProvider";
import { ModeToggle } from "@/components/utils/ModeToggle";

const robotoMono = Roboto({
	variable: "--font-roboto-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Lecture Management Site",
	description: "Build with Nextjs",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${robotoMono.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ModeToggle />

					{children}
				</ThemeProvider>

				<Toaster />
			</body>
		</html>
	);
}
