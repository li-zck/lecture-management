import type { ScheduleData, ScheduleSlot } from "@/lib/ai";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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

function formatType(mode: ScheduleSlot["mode"]): string {
  if (!mode) return "On campus";
  if (mode === "ONLINE") return "Online";
  if (mode === "HYBRID") return "Hybrid";
  return "On campus";
}

function formatLocation(slot: ScheduleSlot): string {
  if (slot.mode === "ONLINE" && slot.meetingUrl) return slot.meetingUrl;
  if (slot.mode === "HYBRID" && slot.meetingUrl)
    return [slot.location ?? "TBA", slot.meetingUrl]
      .filter(Boolean)
      .join(" | ");
  return slot.location ?? "TBA";
}

export type ExportOptions = {
  schedule: ScheduleData;
  title?: string;
  /** Include lecturer column (for student timetable) */
  includeLecturer?: boolean;
};

type TableRow = {
  dayName: string;
  courseName: string;
  schedule: string;
  type: string;
  location: string;
  lecturer: string;
};

function scheduleToTableRows(
  schedule: ScheduleData,
  includeLecturer: boolean,
): TableRow[] {
  const rows: TableRow[] = [];
  const sortedDays = Object.keys(schedule)
    .map(Number)
    .sort((a, b) => a - b);

  for (const day of sortedDays) {
    const slots = schedule[day];
    if (!slots?.length) continue;

    for (const slot of slots.sort(
      (a, b) => (a.startTime ?? 0) - (b.startTime ?? 0),
    )) {
      rows.push({
        dayName: DAY_NAMES[day],
        courseName: slot.courseName,
        schedule: `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`,
        type: formatType(slot.mode),
        location: formatLocation(slot),
        lecturer: includeLecturer ? (slot.lecturer ?? "") : "",
      });
    }
  }

  return rows;
}

/**
 * Export timetable as plain text (.txt) in table format
 */
export function exportTimetableAsText(options: ExportOptions): string {
  const { schedule, title = "Timetable", includeLecturer = true } = options;
  const rows = scheduleToTableRows(schedule, includeLecturer);

  if (rows.length === 0)
    return `${title}\n${"=".repeat(title.length)}\n\nNo scheduled classes.`;

  const cols = ["Course Name", "Day", "Schedule", "Type", "Location"];
  if (includeLecturer) cols.push("Lecturer");

  const colKeys: (keyof TableRow)[] = [
    "courseName",
    "dayName",
    "schedule",
    "type",
    "location",
  ];
  if (includeLecturer) colKeys.push("lecturer");

  const widths = colKeys.map((k, i) =>
    Math.max(cols[i].length, ...rows.map((r) => String(r[k] ?? "").length)),
  );
  const pad = (s: string, w: number) => s.padEnd(w);
  const sep = widths.map((w) => "─".repeat(w)).join("─┬─");
  const header = colKeys.map((_, i) => pad(cols[i], widths[i])).join(" │ ");
  const dataRows = rows.map((r) =>
    colKeys.map((k, i) => pad(String(r[k] ?? ""), widths[i])).join(" │ "),
  );

  const lines = [
    title,
    "=".repeat(title.length),
    "",
    `┬─${sep}─┐`,
    `│ ${header} │`,
    `├─${sep}─┤`,
    ...dataRows.map((row) => `│ ${row} │`),
    `└─${sep}─┘`,
  ];

  return lines.join("\n");
}

/**
 * Export timetable as CSV with columns: Day, Course Name, Schedule, Type, Location, Lecturer
 */
export function exportTimetableAsCsv(options: ExportOptions): string {
  const { schedule, includeLecturer = true } = options;
  const rows = scheduleToTableRows(schedule, includeLecturer);

  const headers = ["Day", "Course Name", "Schedule", "Type", "Location"];
  if (includeLecturer) headers.push("Lecturer");

  const colKeys: (keyof TableRow)[] = [
    "dayName",
    "courseName",
    "schedule",
    "type",
    "location",
  ];
  if (includeLecturer) colKeys.push("lecturer");

  const allRows = [headers, ...rows.map((r) => colKeys.map((k) => r[k] ?? ""))];
  return allRows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

/**
 * Export timetable as PDF with a proper table (grid, headers, rows)
 */
export async function exportTimetableAsPdf(
  options: ExportOptions,
): Promise<Uint8Array> {
  const { schedule, title = "Timetable", includeLecturer = true } = options;
  const rows = scheduleToTableRows(schedule, includeLecturer);

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const titleSize = 16;
  const cellPadding = 4;
  const fontSize = 9;
  const headerFontSize = 9;

  const cols = ["Course Name", "Day", "Schedule", "Type", "Location"];
  if (includeLecturer) cols.push("Lecturer");

  const colKeys: (keyof TableRow)[] = [
    "courseName",
    "dayName",
    "schedule",
    "type",
    "location",
  ];
  if (includeLecturer) colKeys.push("lecturer");

  const numCols = colKeys.length;
  const totalWidth = pageWidth - 2 * margin;
  const colWidths = [
    totalWidth * 0.28,
    totalWidth * 0.12,
    totalWidth * 0.14,
    totalWidth * 0.12,
    totalWidth * 0.22,
  ];
  if (includeLecturer) colWidths.push(totalWidth * 0.12);

  const rowHeight = fontSize * 1.4 + 2 * cellPadding;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  page.drawText(title, {
    x: margin,
    y,
    size: titleSize,
    font: fontBold,
  });
  y -= titleSize + 12;

  const drawTable = (startY: number, tableRows: TableRow[]) => {
    let currentY = startY;
    const tableHeight = (tableRows.length + 1) * rowHeight;
    if (currentY - tableHeight < margin) {
      page = doc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }

    const left = margin;
    let x = left;

    for (let c = 0; c < numCols; c++) {
      const w = colWidths[c];
      const cellRight = x + w;
      const headerY = currentY - rowHeight;

      page.drawRectangle({
        x,
        y: headerY,
        width: w,
        height: rowHeight,
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 0.5,
      });

      const headerText = cols[c];
      const truncated =
        fontBold.widthOfTextAtSize(headerText, headerFontSize) >
        w - 2 * cellPadding
          ? headerText.slice(
              0,
              Math.floor((w - 2 * cellPadding) / (headerFontSize * 0.5)),
            )
          : headerText;
      page.drawText(truncated, {
        x: x + cellPadding,
        y: headerY + cellPadding + 2,
        size: headerFontSize,
        font: fontBold,
      });
      x = cellRight;
    }
    currentY -= rowHeight;

    for (let r = 0; r < tableRows.length; r++) {
      if (currentY - rowHeight < margin) {
        page = doc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
        x = left;
        for (let c = 0; c < numCols; c++) {
          page.drawRectangle({
            x,
            y: currentY - rowHeight,
            width: colWidths[c],
            height: rowHeight,
            borderColor: rgb(0.2, 0.2, 0.2),
            borderWidth: 0.5,
          });
          x += colWidths[c];
        }
      }

      const row = tableRows[r];
      x = left;
      for (let c = 0; c < numCols; c++) {
        const w = colWidths[c];
        const cellY = currentY - rowHeight;
        if (r % 2 === 1) {
          page.drawRectangle({
            x,
            y: cellY,
            width: w,
            height: rowHeight,
            color: rgb(0.97, 0.97, 0.97),
          });
        }
        page.drawRectangle({
          x,
          y: cellY,
          width: w,
          height: rowHeight,
          borderColor: rgb(0.2, 0.2, 0.2),
          borderWidth: 0.5,
        });

        let cellText = String(row[colKeys[c]] ?? "");
        const maxChars = Math.floor((w - 2 * cellPadding) / (fontSize * 0.55));
        if (cellText.length > maxChars)
          cellText = `${cellText.slice(0, maxChars - 2)}..`;
        page.drawText(cellText, {
          x: x + cellPadding,
          y: cellY + cellPadding + 2,
          size: fontSize,
          font,
        });
        x += w;
      }
      currentY -= rowHeight;
    }

    return currentY;
  };

  drawTable(y, rows);
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
