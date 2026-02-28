"use client";

import { useSession } from "@/components/provider/SessionProvider";
import { Button } from "@/components/ui/shadcn/button";
import { aiChatApi, type AiPreset } from "@/lib/api/ai-chat";
import { getClientDictionary, useLocale, useLocalePath } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Calendar,
  GraduationCap,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const QUERY_KEY = ["ai-chat", "conversations"];

const ALL_PRESETS: {
  preset: AiPreset;
  labelKey: string;
  icon: React.ReactNode;
  roles: ("student" | "lecturer")[];
}[] = [
  {
    preset: "schedule_insights",
    labelKey: "scheduleInsights",
    icon: <Sparkles className="h-4 w-4" />,
    roles: ["student", "lecturer"],
  },
  {
    preset: "schedule_optimizer",
    labelKey: "scheduleOptimizer",
    icon: <Calendar className="h-4 w-4" />,
    roles: ["student", "lecturer"],
  },
  {
    preset: "academic_advisor",
    labelKey: "academicAdvisor",
    icon: <GraduationCap className="h-4 w-4" />,
    roles: ["student"],
  },
  {
    preset: "course_analytics",
    labelKey: "courseAnalytics",
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ["lecturer"],
  },
  {
    preset: "general",
    labelKey: "generalHelp",
    icon: <MessageCircle className="h-4 w-4" />,
    roles: ["student", "lecturer"],
  },
];

export function PrebuiltPrompts() {
  const locale = useLocale();
  const localePath = useLocalePath();
  const router = useRouter();
  const { user } = useSession();
  const dict = getClientDictionary(locale);
  const queryClient = useQueryClient();
  const [loadingPreset, setLoadingPreset] = useState<AiPreset | null>(null);

  const role = user?.role?.toLowerCase() as "student" | "lecturer" | undefined;
  const presets = useMemo(
    () =>
      role
        ? ALL_PRESETS.filter((p) => p.roles.includes(role))
        : ALL_PRESETS.filter((p) => p.roles.includes("student")),
    [role],
  );

  const handlePreset = async (preset: AiPreset) => {
    setLoadingPreset(preset);
    try {
      const conv = await aiChatApi.createConversation({ preset });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      router.push(localePath(`/ai-chat/${conv.id}`));
      if (preset === "general") {
        toast.success(
          dict.aiChat?.created ??
            "Conversation created. Type your question below.",
        );
      }
    } catch (err) {
      toast.error(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : (dict.common?.error ?? "Failed to create"),
      );
    } finally {
      setLoadingPreset(null);
    }
  };

  const labels: Record<string, string> = {
    scheduleInsights: dict.aiChat?.scheduleInsights ?? "Schedule Insights",
    scheduleOptimizer: dict.aiChat?.scheduleOptimizer ?? "Schedule Optimizer",
    academicAdvisor: dict.aiChat?.academicAdvisor ?? "Academic Advisor",
    courseAnalytics: dict.aiChat?.courseAnalytics ?? "Course Analytics",
    generalHelp: dict.aiChat?.generalHelp ?? "General LMS Help",
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium">
        {dict.aiChat?.quickStart ?? "Quick start"}
      </h2>
      <div className="space-y-2">
        {presets.map(({ preset, labelKey, icon }) => (
          <Button
            key={preset}
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handlePreset(preset)}
            disabled={!!loadingPreset}
          >
            {loadingPreset === preset ? (
              <span className="animate-pulse">...</span>
            ) : (
              icon
            )}
            {labels[labelKey]}
          </Button>
        ))}
      </div>
    </div>
  );
}
