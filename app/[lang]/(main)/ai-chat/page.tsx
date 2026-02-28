"use client";

import { getClientDictionary, useLocale } from "@/lib/i18n";
import { Sparkles } from "lucide-react";

export default function AIChatIndexPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border bg-muted/20 p-8 text-center">
      <Sparkles className="h-12 w-12 text-primary/60 mb-4" />
      <h2 className="text-lg font-semibold mb-2">
        {dict.aiChat?.welcome ?? "Welcome to AI Assistant"}
      </h2>
      <p className="text-muted-foreground text-sm max-w-md">
        {dict.aiChat?.welcomeDescription ??
          "Use a quick start preset on the left to begin, or create a general chat to ask about your courses, schedule, grades, and more."}
      </p>
    </div>
  );
}
