import { NextConfig } from "next";

// suppress postgresql warnings
const originalConsoleWarn = console.warn;

console.warn = (...args) => {
	const message = args.join(" ");

	if (message.includes("Package pg can't be external")) {
		return;
	}

	originalConsoleWarn.apply(console, args);
};

const nextConfig: NextConfig = {};

export default nextConfig;
