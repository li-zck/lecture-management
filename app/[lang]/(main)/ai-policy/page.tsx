"use client";

import { getClientDictionary, useLocale } from "@/lib/i18n";

export default function AIPrivacyPolicyPage() {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const p = dict.aiPolicy;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">
          {p?.title ?? "AI Privacy & Usage Policy"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {p?.subtitle ??
            "This page explains what academic data the AI assistant can see and how it is used."}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {p?.studentsTitle ?? "For Students"}
        </h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {p?.studentsBody ??
            "When you use Academic Advisor or schedule-related features, the assistant may access your timetable, grades, academic progress, and exam schedule to generate personalized study tips and academic advice.\n\nThe AI cannot change your records; it only reads this data to answer your questions."}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {p?.lecturersTitle ?? "For Lecturers"}
        </h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {p?.lecturersBody ??
            "When you use Course Analytics or schedule-related features, the assistant may access your teaching timetable and course analytics (grade distributions and at-risk counts) to suggest teaching strategies and interventions.\n\nThe AI cannot modify grades or enrollments; it only reads aggregated analytics."}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {p?.limitsTitle ?? "What the AI does NOT see"}
        </h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>{p?.limits1 ?? "No passwords or authentication secrets."}</li>
          <li>
            {p?.limits2 ??
              "No citizen IDs, phone numbers, physical addresses, or other civil identifiers are sent to the AI provider."}
          </li>
          <li>
            {p?.limits3 ??
              "No other users’ personal records are shared; the assistant only sees data associated with your own account."}
          </li>
          <li>
            {p?.limits4 ??
              "Course documents and file contents are not sent to the AI assistant."}
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {p?.controlTitle ?? "Your control"}
        </h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {p?.controlBody ??
            "You can choose whether to enable AI features. If you do not accept this policy, AI chat and academic advisor features will remain disabled.\n\nYou can stop using the AI assistant at any time."}
        </p>
      </section>
    </div>
  );
}
