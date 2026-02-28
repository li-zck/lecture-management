"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  askScheduleAssistant,
  optimizeTimetable,
  type ScheduleData,
} from "@/lib/ai";
import { MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export type AITimetableOptimizerProps = {
  schedule: ScheduleData;
  userRole: "student" | "lecturer";
  context?: string;
};

export function AITimetableOptimizer({
  schedule,
  userRole,
  context,
}: AITimetableOptimizerProps) {
  const [optimizationResult, setOptimizationResult] = useState<string | null>(
    null,
  );
  const [qaResult, setQaResult] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [loadingOptimize, setLoadingOptimize] = useState(false);
  const [loadingQa, setLoadingQa] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSchedule = Object.values(schedule).some((slots) => slots.length > 0);

  const handleOptimize = async () => {
    setLoadingOptimize(true);
    setError(null);
    setOptimizationResult(null);

    try {
      const text = await optimizeTimetable({
        schedule,
        role: userRole,
        context,
      });
      setOptimizationResult(text);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to optimize timetable",
      );
    } finally {
      setLoadingOptimize(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoadingQa(true);
    setError(null);
    setQaResult(null);

    try {
      const answer = await askScheduleAssistant({
        schedule,
        role: userRole,
        context,
        question,
      });
      setQaResult(answer);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to answer your question",
      );
    } finally {
      setLoadingQa(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="size-5" />
            Schedule Optimizer & Assistant
          </span>
        </CardTitle>
        <CardDescription>
          Detect conflicts, risky transitions, and get natural-language answers
          about your timetable. Powered by the same Gemini setup as the schedule
          insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Button
            onClick={handleOptimize}
            disabled={loadingOptimize || !hasSchedule}
            variant="secondary"
          >
            {loadingOptimize ? (
              <span className="animate-pulse">Analyzing conflicts…</span>
            ) : (
              <>
                <Sparkles className="size-4" />
                Detect Conflicts & Optimize
              </>
            )}
          </Button>
          {optimizationResult && (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_p]:my-2 first:[&_p]:mt-0 last:[&_p]:mb-0">
              <ReactMarkdown>{optimizationResult}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="size-4" />
              Ask about your timetable
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder={
                userRole === "student"
                  ? "e.g. When is my next offline class?"
                  : "e.g. Which day is best for office hours?"
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleAsk}
              disabled={loadingQa || !hasSchedule || !question.trim()}
              variant="outline"
            >
              {loadingQa ? "Thinking…" : "Ask"}
            </Button>
          </div>
          {qaResult && (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <ReactMarkdown>{qaResult}</ReactMarkdown>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
