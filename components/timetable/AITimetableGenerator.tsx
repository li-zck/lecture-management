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
          AI Timetable
        </CardTitle>
        <CardDescription>
          Generate a formatted timetable with AI. Add{" "}
          <code className="rounded bg-muted px-1">
            NEXT_PUBLIC_OPENAI_API_KEY
          </code>{" "}
          to .env.local for full AI features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerate}
          disabled={loading || !hasSchedule}
          variant="secondary"
        >
          {loading ? (
            <>
              <span className="animate-pulse">Generating…</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate with AI
            </>
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
