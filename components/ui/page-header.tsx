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
    <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {backUrl && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 shrink-0 sm:mr-2"
              aria-label="Go back"
            >
              <Link href={backUrl}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex flex-wrap gap-2 shrink-0">{action}</div>}
    </div>
  );
}
