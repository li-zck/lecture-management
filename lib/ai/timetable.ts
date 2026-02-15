/**
 * AI-powered timetable generation.
 * Uses OpenAI API (or compatible endpoint) to format schedule data.
 *
 * Setup: Add your API key to .env.local:
 *   NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
 *
 * Or use another provider by changing the API_URL and headers below.
 */
const API_KEY =
  process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "YOUR_OPENAI_API_KEY_HERE";
const API_URL = "https://api.openai.com/v1/chat/completions";

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

function formatTime(time: number | null): string {
  if (time === null) return "TBA";
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
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
 * Call AI to generate a formatted timetable with optional insights.
 */
export async function generateTimetable(
  options: GenerateTimetableOptions,
): Promise<string> {
  const { schedule, role, context } = options;
  const scheduleText = scheduleToText(schedule, role);

  const systemPrompt =
    role === "student"
      ? "You are a helpful assistant that formats student timetables. Given a list of enrolled courses with their schedule, produce a clear, readable timetable. Optionally add 1-2 brief tips for managing the schedule (e.g., study gaps, potential conflicts). Keep the response concise."
      : "You are a helpful assistant that formats lecturer teaching timetables. Given a list of assigned courses with their schedule, produce a clear, readable timetable. Optionally add 1-2 brief tips (e.g., preparation time between classes). Keep the response concise.";

  const userPrompt = `Format this ${role} timetable${context ? ` for ${context}` : ""}:\n\n${scheduleText}`;

  if (!API_KEY || API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
    return `**Timetable** (AI unavailable – add NEXT_PUBLIC_OPENAI_API_KEY to .env.local)\n\n${scheduleText}`;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        (err as { error?: { message?: string } })?.error?.message ??
          `AI request failed: ${response.status}`,
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;

    return content ?? scheduleText;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return `**Timetable** (AI error: ${msg})\n\n${scheduleText}`;
  }
}
