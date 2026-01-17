import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./shadcn/button";

interface PageHeaderProps {
    title: string;
    description?: string; // Optional description
    action?: React.ReactNode; // Optional action button (e.g., "Create New")
    backUrl?: string; // Optional back button URL
}

export function PageHeader({
    title,
    description,
    action,
    backUrl,
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <div className="flex items-center gap-2">
                    {backUrl && (
                        <Button variant="ghost" size="icon" asChild className="mr-2 h-8 w-8">
                            <Link href={backUrl}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                </div>
                {description && (
                    <p className="text-muted-foreground mt-1">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
