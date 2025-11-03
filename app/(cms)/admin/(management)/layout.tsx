import type { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/error";

export default function ManagementPageLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <ErrorBoundary>{children}</ErrorBoundary>;
}
