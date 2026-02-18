"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { generateTimetable, type ScheduleData } from "@/lib/ai";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export type AITimetableGeneratorProps = {
  schedule: ScheduleData;
  userRole: "student" | "lecturer";
  context?: string;
};

export function AITimetableGenerator({
  schedule,
  userRole,
  context,
}: AITimetableGeneratorProps) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSchedule = Object.values(schedule).some((slots) => slots.length > 0);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const text = await generateTimetable({
        schedule,
        role: userRole,
        context,
      });
      setResult(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5" />
          Schedule Insights (Beta)
        </CardTitle>
        <CardDescription>
          Get AI-powered analysis: study gaps, workload tips, and practical
          advice. Add{" "}
          <code className="rounded bg-muted px-1">
            NEXT_PUBLIC_GEMINI_API_KEY
          </code>{" "}
          to .env.local.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerate}
          disabled={loading || !hasSchedule}
          variant="secondary"
        >
          {loading ? (
            <span className="animate-pulse">Analyzing…</span>
          ) : (
            <>
              <Sparkles className="size-4" />
              Get Schedule Insights
            </>
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_p]:my-2 first:[&_p]:mt-0 last:[&_p]:mb-0">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
