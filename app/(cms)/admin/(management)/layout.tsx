import { ErrorBoundary } from "@/components/ui/error";
import type { ReactNode } from "react";

export default function ManagementPageLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <ErrorBoundary>{children}</ErrorBoundary>;
}
