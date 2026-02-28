"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Button } from "@/components/ui/shadcn/button";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { aiChatApi } from "@/lib/api/ai-chat";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConversationList } from "./ConversationList";
import { PrebuiltPrompts } from "./PrebuiltPrompts";

export function AIChatLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useSession();
  const locale = useLocale();
  const localePath = useLocalePath();
  const router = useRouter();
  const dict = getClientDictionary(locale);
  const queryClient = useQueryClient();
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentSubmitting, setConsentSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.replace(localePath("/sign-in"));
      return;
    }
    const role = user.role?.toLowerCase();
    if (role === "admin") {
      router.replace(localePath("/dashboard"));
      return;
    }
  }, [isAuthenticated, user, isLoading, router, localePath]);

  const role = user?.role?.toLowerCase() as
    | "student"
    | "lecturer"
    | "admin"
    | undefined;

  const {
    data: consent,
    isLoading: consentLoading,
    isError: consentError,
  } = useQuery({
    queryKey: ["ai-chat", "consent"],
    queryFn: () => aiChatApi.getConsent(),
    enabled: !!user && role !== "admin",
  });

  if (isLoading || consentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user || role === "admin") {
    return null;
  }

  const needsConsent = !consent?.accepted;

  const handleAccept = async () => {
    if (!consentChecked || consentSubmitting) return;
    setConsentSubmitting(true);
    try {
      await aiChatApi.acceptConsent("v1");
      await queryClient.invalidateQueries({ queryKey: ["ai-chat", "consent"] });
    } finally {
      setConsentSubmitting(false);
    }
  };

  if (needsConsent) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {dict.aiChat?.title ?? "AI Assistant"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {dict.aiChat?.subtitle ??
              "Get schedule insights, optimize your timetable, and ask LMS-related questions."}
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {dict.aiChat?.consentTitle ?? "Before you start using AI"}
          </h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {role === "student"
              ? (dict.aiChat?.consentBodyStudent ??
                "The AI assistant can use your timetable, grades, academic progress, and exam schedule to provide personalized study tips and academic advice.")
              : (dict.aiChat?.consentBodyLecturer ??
                "The AI assistant can use your teaching timetable and course analytics (grades and at-risk counts) to provide teaching insights.")}
          </p>
          <p className="text-sm text-muted-foreground">
            {dict.aiChat?.consentPolicyText ??
              "By continuing, you agree that this data may be sent to the AI provider for generating answers, as described in the"}{" "}
            <a
              href={localePath("/ai-policy")}
              className="underline underline-offset-4"
            >
              {dict.aiChat?.consentPolicyLink ?? "AI Privacy & Usage Policy"}
            </a>
            .
          </p>

          <div className="flex items-start gap-3">
            <Checkbox
              id="ai-consent"
              checked={consentChecked}
              onCheckedChange={(v) => setConsentChecked(!!v)}
            />
            <label
              htmlFor="ai-consent"
              className="text-sm leading-snug cursor-pointer"
            >
              {dict.aiChat?.consentCheckbox ??
                "I understand and agree that my academic data will be used by the AI assistant as described in the AI Privacy & Usage Policy."}
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAccept}
              disabled={!consentChecked || consentSubmitting}
            >
              {consentSubmitting
                ? (dict.aiChat?.consentButton ?? "Saving...")
                : (dict.aiChat?.consentButton ?? "Agree and continue")}
            </Button>
          </div>

          {consentError && (
            <p className="text-xs text-destructive">
              {dict.common?.error ?? "Failed to load consent status."}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {dict.aiChat?.title ?? "AI Assistant"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {dict.aiChat?.subtitle ??
            "Get schedule insights, optimize your timetable, and ask LMS-related questions."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0 space-y-4">
          <ConversationList />
          <PrebuiltPrompts />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
