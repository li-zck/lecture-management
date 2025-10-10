"use client";

import React from "react";
import { Button } from "@/components/ui/shadcn/button";

type ErrorBoundaryState = {
	hasError: boolean;
	error?: Error;
};

type ErrorBoundaryProps = {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
};

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	resetError = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return (
					<FallbackComponent
						error={this.state.error}
						resetError={this.resetError}
					/>
				);
			}

			return (
				<DefaultErrorFallback
					error={this.state.error}
					resetError={this.resetError}
				/>
			);
		}

		return this.props.children;
	}
}

type DefaultErrorFallbackProps = {
	error?: Error;
	resetError: () => void;
};

function DefaultErrorFallback({
	error,
	resetError,
}: DefaultErrorFallbackProps) {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center p-6 max-w-md">
				<h1 className="text-2xl font-bold text-red-600 mb-4">
					Something went wrong
				</h1>
				<p className="text-gray-600 mb-6">
					{error?.message || "An unexpected error occurred"}
				</p>
				<Button onClick={resetError} variant="outline">
					Try again
				</Button>
			</div>
		</div>
	);
}
