/**
 * AI-powered schedule insights.
 * Uses Google Gemini API to analyze schedules and provide actionable tips.
 *
 * Setup: Add your API key to .env.local:
 *   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
 *
 * Get a key at: https://aistudio.google.com/app/apikey
 *
 * Model: Set NEXT_PUBLIC_GEMINI_MODEL if needed. Find models at:
 *   https://ai.google.dev/gemini-api/docs/models
 *   Or in Google AI Studio: create a prompt → model dropdown shows IDs
 */
const API_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "YOUR_GEMINI_API_KEY_HERE";
const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "gemini-1.5-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export type ScheduleSlot = {
  courseName: string;
  startTime: number | null;
  endTime: number | null;
  location: string | null;
  lecturer: string | null;
};

export type ScheduleData = Record<number, ScheduleSlot[]>;

const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** Backend stores time as minutes since midnight (e.g. 8:00 = 480) */
function formatTime(minutes: number | null): string {
  if (minutes === null) return "TBA";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

function scheduleToText(
  schedule: ScheduleData,
  role: "student" | "lecturer",
): string {
  const lines: string[] = [];
  const sortedDays = Object.keys(schedule)
    .map(Number)
    .sort((a, b) => a - b);

  for (const day of sortedDays) {
    const slots = schedule[day];
    if (!slots?.length) continue;

    lines.push(`\n${DAY_NAMES[day]}:`);
    for (const slot of slots) {
      const timeStr = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
      const loc = slot.location ?? "TBA";
      const extra =
        role === "student" && slot.lecturer ? ` (${slot.lecturer})` : "";
      lines.push(`  - ${slot.courseName}: ${timeStr} @ ${loc}${extra}`);
    }
  }

  return lines.join("\n") || "No scheduled classes.";
}

export type GenerateTimetableOptions = {
  schedule: ScheduleData;
  role: "student" | "lecturer";
  /** Optional: semester or context name */
  context?: string;
};

/**
 * Call AI to analyze the schedule and generate actionable insights.
 * Does NOT reformat the timetable (the UI already displays it).
 * Focuses on: study gaps, workload, conflicts, tips.
 */
export async function generateTimetable(
  options: GenerateTimetableOptions,
): Promise<string> {
  const { schedule, role, context } = options;
  const scheduleText = scheduleToText(schedule, role);

  const systemPrompt =
    role === "student"
      ? `You are a helpful academic advisor. Analyze the student's weekly schedule and provide SHORT, ACTIONABLE insights. Do NOT repeat the timetable - the user already sees it.

Focus on:
1. **Study gaps** - Identify free blocks between classes (e.g., "2-hour gap on Monday 10:00–12:00 – ideal for reviewing Database Systems before your afternoon class")
2. **Workload** - Which days are heaviest? Any imbalance?
3. **Practical tips** - Best times to study, when to take breaks, any back-to-back classes that might need a quick room change

Keep each section to 1–2 sentences. Use bullet points. Be concise. No fluff.`
      : `You are a helpful teaching assistant. Analyze the lecturer's weekly teaching schedule and provide SHORT, ACTIONABLE insights. Do NOT repeat the timetable - the user already sees it.

Focus on:
1. **Preparation gaps** - Time between classes for prep or office hours
2. **Teaching load** - Which days are busiest? Any back-to-back sessions?
3. **Practical tips** - Best times for grading, when to schedule office hours, any room changes between classes

Keep each section to 1–2 sentences. Use bullet points. Be concise. No fluff.`;

  const userPrompt = `Analyze this ${role} schedule${context ? ` for ${context}` : ""} and give insights:\n\n${scheduleText}`;

  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    return `**Schedule Insights** (AI unavailable – add NEXT_PUBLIC_GEMINI_API_KEY to .env.local)\n\nView your timetable above. To get AI-powered study tips and schedule analysis, add your Gemini API key.`;
  }

  try {
    const url = `${API_BASE}/${MODEL}:generateContent?key=${encodeURIComponent(API_KEY)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg =
        (err as { error?: { message?: string } })?.error?.message ??
        `AI request failed: ${response.status}`;
      throw new Error(msg);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return content ?? "Unable to generate insights. Please try again.";
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return `**Schedule Insights** (AI error: ${msg})\n\nTo fix: Add NEXT_PUBLIC_GEMINI_MODEL to .env.local with a model from https://ai.google.dev/gemini-api/docs/models (e.g. gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash-exp). Or check the model dropdown in Google AI Studio.`;
  }
}
