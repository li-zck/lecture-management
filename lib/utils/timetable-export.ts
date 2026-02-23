import type { ScheduleData } from "@/lib/ai";
import { PDFDocument, StandardFonts } from "pdf-lib";

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
  if (minutes === null) return "–";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export type ExportOptions = {
  schedule: ScheduleData;
  title?: string;
  /** Include lecturer column (for student timetable) */
  includeLecturer?: boolean;
};

/**
 * Export timetable as plain text (.txt)
 */
export function exportTimetableAsText(options: ExportOptions): string {
  const { schedule, title = "Timetable", includeLecturer = true } = options;
  const lines: string[] = [title, "=".repeat(title.length), ""];

  const sortedDays = Object.keys(schedule)
    .map(Number)
    .sort((a, b) => a - b);

  for (const day of sortedDays) {
    const slots = schedule[day];
    if (!slots?.length) continue;

    lines.push(`${DAY_NAMES[day]}`);
    lines.push("-".repeat(DAY_NAMES[day].length));
    for (const slot of slots.sort(
      (a, b) => (a.startTime ?? 0) - (b.startTime ?? 0),
    )) {
      const timeStr = `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`;
      const loc = slot.location ?? "TBA";
      const extra =
        includeLecturer && slot.lecturer ? ` | ${slot.lecturer}` : "";
      lines.push(`  ${slot.courseName}`);
      lines.push(`    ${timeStr} @ ${loc}${extra}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim() || "No scheduled classes.";
}

/**
 * Export timetable as CSV
 */
export function exportTimetableAsCsv(options: ExportOptions): string {
  const { schedule, includeLecturer = true } = options;
  const headers = ["Day", "Course", "Start", "End", "Location"];
  if (includeLecturer) headers.push("Lecturer");

  const rows: string[][] = [headers];

  const sortedDays = Object.keys(schedule)
    .map(Number)
    .sort((a, b) => a - b);

  for (const day of sortedDays) {
    const slots = schedule[day];
    if (!slots?.length) continue;

    for (const slot of slots.sort(
      (a, b) => (a.startTime ?? 0) - (b.startTime ?? 0),
    )) {
      const row = [
        DAY_NAMES[day],
        slot.courseName,
        formatTime(slot.startTime),
        formatTime(slot.endTime),
        slot.location ?? "",
      ];
      if (includeLecturer) row.push(slot.lecturer ?? "");
      rows.push(row);
    }
  }

  return rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

/**
 * Export timetable as PDF
 */
export async function exportTimetableAsPdf(
  options: ExportOptions,
): Promise<Uint8Array> {
  const { schedule, title = "Timetable", includeLecturer = true } = options;

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const lineHeight = 14;
  const sectionGap = 8;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const drawText = (
    text: string,
    opts: { size?: number; bold?: boolean } = {},
  ) => {
    const { size = 10, bold = false } = opts;
    const f = bold ? fontBold : font;
    const textWidth = f.widthOfTextAtSize(text, size);
    if (y < margin + lineHeight) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: f,
    });
    y -= lineHeight;
    return textWidth;
  };

  drawText(title, { size: 18, bold: true });
  y -= sectionGap;

  const sortedDays = Object.keys(schedule)
    .map(Number)
    .sort((a, b) => a - b);

  for (const day of sortedDays) {
    const slots = schedule[day];
    if (!slots?.length) continue;

    drawText(DAY_NAMES[day], { size: 12, bold: true });
    y -= 4;

    for (const slot of slots.sort(
      (a, b) => (a.startTime ?? 0) - (b.startTime ?? 0),
    )) {
      const timeStr = `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`;
      const loc = slot.location ?? "TBA";
      const extra =
        includeLecturer && slot.lecturer ? ` (${slot.lecturer})` : "";
      drawText(`  ${slot.courseName}`, { size: 10 });
      drawText(`    ${timeStr} @ ${loc}${extra}`, { size: 9 });
    }
    y -= sectionGap;
  }

  return doc.save();
}

/**
 * Trigger browser download of a blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
