import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import RootProviders from "./providers";

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
				<RootProviders>{children}</RootProviders>
			</body>
		</html>
	);
}
