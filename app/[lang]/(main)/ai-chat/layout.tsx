"use client";

import { AIChatLayout } from "@/components/ai-chat/AIChatLayout";

export default function AIChatLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AIChatLayout>{children}</AIChatLayout>;
}
